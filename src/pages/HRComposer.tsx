import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function HRComposer(){
  const [subject,setSubject] = useState('Interview invitation');
  const [body,setBody] = useState('Hi {name},\n\nWe\'d like to invite you to interview for the {job} position. Please reply with your availability.');
  const [recipients,setRecipients] = useState('candidate@example.com');
  const [sending,setSending] = useState(false);
  const { user } = useAuth();

  async function handleSend(){
    setSending(true);
    const emails = recipients.split(/[,;\s]+/).filter(Boolean);
    try{
      const res = await api.sendEmail({ subject, body, emails });
      if(res.success) alert('Emails queued/sent'); else alert('Send failed');
    }catch(e){
      console.error(e); alert('Send error');
    } finally { setSending(false); }
  }

  if(!user || user.role !== 'hr'){
    return <div className="max-w-4xl mx-auto p-8">You must be signed in as HR to access this page.</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Compose email</h2>
      <div className="grid gap-4">
        <input className="form-input" value={subject} onChange={e=>setSubject(e.target.value)} />
        <textarea className="form-input h-40" value={body} onChange={e=>setBody(e.target.value)} />
        <input className="form-input" value={recipients} onChange={e=>setRecipients(e.target.value)} placeholder="comma separated emails" />
        <div className="flex items-center gap-4">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={handleSend} disabled={sending}>{sending? 'Sending...' : 'Send'}</button>
        </div>
      </div>
    </div>
  );
}
