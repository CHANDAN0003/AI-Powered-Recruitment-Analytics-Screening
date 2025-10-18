# TalentConnect Backend (FastAPI)

This is a minimal FastAPI scaffold for the TalentConnect recruitment platform. It provides demo endpoints the frontend expects and can be extended with JWT auth, resume parsing, AI integration, and SendGrid.

Quick start

1. Create a Python 3.11+ virtual environment and activate it.
2. Install dependencies:

   pip install -r backend/requirements.txt

3. Copy `.env.example` to `.env` and set the values (MongoDB URI, JWT secret, SendGrid key).

4. Run the app:

   python backend/app.py

The API will be available at http://127.0.0.1:8000

Endpoints (demo)

- POST /api/login
- GET /api/jobs
- POST /api/apply
- POST /api/chatbot
- GET /api/dashboard
- GET /api/applicants
- POST /api/send_email

Next steps

- Implement secure registration and password hashing
- Integrate resume parsing (pdfminer / python-docx)
- Add AI screening worker and model integration
- Hook up SendGrid for real emails
- Add tests and Dockerfile
