from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import motor.motor_asyncio
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'recruitment_db')
JWT_SECRET = os.getenv('JWT_SECRET', 'secret')
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
db = client[DATABASE_NAME]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI(title='TalentConnect API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(request: Request):
    auth = request.headers.get('Authorization')
    if not auth:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Not authenticated')
    try:
        scheme, token = auth.split()
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        email: str = payload.get('sub')
        role: str = payload.get('role')
        if email is None:
            raise HTTPException(status_code=401, detail='Invalid token')
        return { 'email': email, 'role': role }
    except Exception as e:
        raise HTTPException(status_code=401, detail='Invalid token')


class UserIn(BaseModel):
    email: EmailStr
    password: str
    role: str = 'candidate'


class UserOut(BaseModel):
    email: EmailStr
    role: str
    name: Optional[str]


@app.post('/api/login')
async def login(user: UserIn):
    # Demo: check users collection
    u = await db.users.find_one({'email': user.email})
    if not u:
        # support demo credentials
        if (user.email == 'candidate@demo.com' and user.password == 'demo123') or (user.email == 'hr@demo.com' and user.password == 'demo123'):
            token = create_access_token({'sub': user.email, 'role': user.role})
            return { 'success': True, 'user': { 'email': user.email, 'role': user.role, 'name': 'Demo User' }, 'token': token }
        raise HTTPException(status_code=400, detail='Incorrect email or password')

    # verify password if stored (for future)
    # verify password if stored
    stored_hash = u.get('password')
    if stored_hash:
        if not pwd_context.verify(user.password, stored_hash):
            raise HTTPException(status_code=400, detail='Incorrect email or password')

    token = create_access_token({'sub': user.email, 'role': u.get('role', 'candidate')})
    return { 'success': True, 'user': { 'email': u['email'], 'role': u.get('role','candidate'), 'name': u.get('name') }, 'token': token }


# New registration and login endpoints (used by SPA)
class RegisterIn(BaseModel):
    name: str
    email: EmailStr
    password: str


@app.post('/register')
async def register(payload: RegisterIn):
    existing = await db.users.find_one({'email': payload.email})
    if existing:
        return { 'success': False, 'message': 'User already exists' }

    hashed = pwd_context.hash(payload.password)
    user_doc = {
        'name': payload.name,
        'email': payload.email,
        'password': hashed,
        'role': 'candidate',
        'createdAt': datetime.utcnow()
    }
    await db.users.insert_one(user_doc)
    return { 'success': True }


class LoginIn(BaseModel):
    email: EmailStr
    password: str


@app.post('/login')
async def login_spa(payload: LoginIn):
    user = await db.users.find_one({'email': payload.email})
    if not user:
        return { 'success': False, 'message': 'Invalid credentials' }

    if not pwd_context.verify(payload.password, user.get('password','')):
        return { 'success': False, 'message': 'Invalid credentials' }

    token = create_access_token({'sub': user['email'], 'role': user.get('role','candidate')})
    return { 'success': True, 'token': token, 'user': { 'email': user['email'], 'name': user.get('name'), 'role': user.get('role') } }


@app.get('/api/jobs')
async def get_jobs(current=Depends(get_current_user)):
    # return some demo jobs
    jobs = [
        { 'id': 1, 'title': 'Frontend Developer', 'company': 'TechCorp Inc.', 'location': 'Remote', 'description': 'Frontend role', 'skills': ['JavaScript','React'] },
        { 'id': 2, 'title': 'Backend Developer', 'company': 'DataSoft', 'location': 'Austin, TX', 'description': 'Backend role', 'skills': ['Python','Django'] }
    ]
    return jobs


@app.post('/api/apply')
async def apply(payload: dict, current=Depends(get_current_user)):
    # store application in MongoDB
    application = payload.copy()
    application['applicant'] = current['email']
    application['status'] = 'new'
    application['appliedAt'] = datetime.utcnow()
    await db.applications.insert_one(application)
    return { 'success': True }


@app.post('/api/chatbot')
async def chatbot_endpoint(payload: dict, current=Depends(get_current_user)):
    message = payload.get('message','')
    # simple echo or canned response for demo
    if 'job' in message.lower():
        response = 'You can browse jobs on the Dashboard. Use filters to narrow down by skill and experience.'
    else:
        response = 'Thanks for your message. Our AI assistant will respond here in future.'
    # Optionally store chat history
    await db.chathistory.insert_one({'user': current['email'], 'message': message, 'response': response, 'ts': datetime.utcnow()})
    return { 'response': response }


@app.get('/api/dashboard')
async def dashboard(current=Depends(get_current_user)):
    # demo stats
    return { 'totalApplicants': 156, 'recentApplicants': 23, 'eligibleApplicants': 89, 'conversionRate': 57 }


@app.get('/api/applicants')
async def applicants(current=Depends(get_current_user)):
    # return recent applications
    cursor = db.applications.find().sort('appliedAt', -1).limit(50)
    apps = []
    async for doc in cursor:
        doc['_id'] = str(doc.get('_id'))
        apps.append(doc)
    return apps


@app.post('/api/send_email')
async def send_email(payload: dict, current=Depends(get_current_user)):
    # Only HR role may send emails
    if current.get('role') != 'hr':
        raise HTTPException(status_code=403, detail='Insufficient permissions')

    emails = payload.get('emails', [])
    subject = payload.get('subject', 'Message from TalentConnect')
    body = payload.get('body', '')

    results = []
    SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
    FROM_EMAIL = os.getenv('FROM_EMAIL')

    # If SendGrid isn't configured, just log the request
    if not SENDGRID_API_KEY or not FROM_EMAIL:
        await db.email_logs.insert_one({'requestedBy': current['email'], 'payload': payload, 'ts': datetime.utcnow(), 'note': 'sendgrid_not_configured'})
        return { 'success': True, 'note': 'sendgrid_not_configured' }

    sg = SendGridAPIClient(SENDGRID_API_KEY)

    for e in emails:
        try:
            # naive personalization: use email local-part as name if {name} not provided
            name = e.split('@')[0].replace('.', ' ').title()
            personalized = body.replace('{name}', name)
            message = Mail(from_email=FROM_EMAIL, to_emails=e, subject=subject, plain_text_content=personalized)
            resp = sg.send(message)
            results.append({'email': e, 'status': resp.status_code})
        except Exception as ex:
            results.append({'email': e, 'error': str(ex)})

    await db.email_logs.insert_one({'requestedBy': current['email'], 'payload': payload, 'results': results, 'ts': datetime.utcnow()})
    return { 'success': True, 'results': results }


if __name__ == '__main__':
    import uvicorn
    uvicorn.run('app:app', host='127.0.0.1', port=8000, reload=True)
