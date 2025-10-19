import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

export default function Signup(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [show,setShow]=useState(false);
  const [loading,setLoading]=useState(false);

  async function handleSubmit(e:any){
    e.preventDefault();
    setLoading(true);
    try{
      const res = await api.register({ name, email, password });
      if(res.success){
        window.location.href = '/login';
      } else {
        alert(res.message || 'Registration failed');
      }
    } catch(e){
      console.error(e);
      alert('Registration error');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full max-w-lg p-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="bg-white/90 rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-400 text-white flex items-center justify-center font-bold">TC</div>
            <div>
              <h2 className="text-xl font-bold">Create your account</h2>
              <p className="text-sm text-gray-500">Start hiring smarter with AI-assisted screening.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label className="text-sm text-gray-600">Full name</label>
              <input className="mt-1 form-input" placeholder="Jane Doe" value={name} onChange={e=>setName(e.target.value)} required />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input type="email" className="mt-1 form-input" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <div className="relative">
                <input type={show? 'text' : 'password'} className="mt-1 form-input pr-10" placeholder="Create a strong password" value={password} onChange={e=>setPassword(e.target.value)} required />
                <button type="button" onClick={()=>setShow(s=>!s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">{show? 'Hide' : 'Show'}</button>
              </div>
            </div>

            <button className="mt-2 bg-gradient-to-r from-indigo-600 to-emerald-400 text-white px-4 py-3 rounded-lg font-medium shadow" type="submit" disabled={loading}>{loading? 'Creating...' : 'Create account'}</button>

            <div className="text-sm text-center text-gray-500">
              Already have an account? <Link to="/login" className="text-indigo-600 font-medium">Sign in</Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
