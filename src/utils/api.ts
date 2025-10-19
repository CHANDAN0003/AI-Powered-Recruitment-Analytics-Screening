const BASE = '';

function getAuthHeaders(){
  const token = localStorage.getItem('authToken');
  const headers: Record<string,string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function post(path:string, body:any, auth = false){
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: auth ? getAuthHeaders() : { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  try { return await res.json(); } catch(e){ return { ok: res.ok }; }
}

async function get(path:string, auth=false){
  const res = await fetch(BASE + path, { method: 'GET', headers: auth ? getAuthHeaders() : { 'Content-Type': 'application/json' } });
  try { return await res.json(); } catch(e){ return { ok: res.ok }; }
}

export default {
  register: (data:{name:string,email:string,password:string}) => post('/register', data),
  login: (data:{email:string,password:string}) => post('/login', data),
  sendEmail: (payload:any) => post('/api/send_email', payload, true),
  getJobs: () => get('/api/jobs', true),
  getApplicants: () => get('/api/applicants', true)
};
