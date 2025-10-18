# AI-Powered Recruitment Platform (TalentConnect)

This workspace contains a React frontend (Vite + Tailwind) and a minimal FastAPI backend scaffold. The project implements demo flows for candidate and HR dashboards, chatbot integration, and basic API endpoints.

Architecture (high level):

- Frontend: React (Vite) + Tailwind CSS
- Backend: FastAPI (Python) + MongoDB (Motor)
- AI Services: placeholder endpoints for LLM/chatbot and screening
- Email: SendGrid integration hooks (to be configured)

Running locally (quick):

1. Frontend

   npm install
   npm run dev

2. Backend (requires Python)

   python -m venv .venv
   .venv\Scripts\activate
   pip install -r backend/requirements.txt
   copy backend\.env.example backend\.env
   # edit backend\.env to set MONGODB_URI and JWT_SECRET
   python backend/app.py

The frontend expects the backend APIs under `/api/*` on the same host. For local development, run frontend on default Vite port (5173) and backend on 8000. You can configure a proxy in `vite.config.ts` if needed.

Next steps (recommended):

- Implement secure user registration and password hashing
- Add resume upload and parsing pipeline
- Integrate Emergent LLM for chatbot and candidate screening
- Add SendGrid email sending and templates
- Implement role-based access control and STRIDE security checklist
