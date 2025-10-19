import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [show,setShow]=useState(false);
  const [remember,setRemember]=useState(false);
  const [loading,setLoading]=useState(false);

  const { login } = useAuth();

  async function handleSubmit(e:any){
    e.preventDefault();
    setLoading(true);
    try{
      const res = await api.login({ email, password });
      if(res.success && res.token){
        // update context
        login(res.token, res.user, remember);
        window.location.href = '/';
      } else {
        alert(res.message || 'Login failed');
      }
    } catch(e){
      console.error(e);
      alert('Login error');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full max-w-md p-6">
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="bg-white/95 rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-2">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to continue to your dashboard.</p>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input type="email" className="mt-1 form-input" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <div className="relative">
                <input type={show? 'text' : 'password'} className="mt-1 form-input pr-10" placeholder="Your password" value={password} onChange={e=>setPassword(e.target.value)} required />
                <button type="button" onClick={()=>setShow(s=>!s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">{show? 'Hide' : 'Show'}</button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" className="form-checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} /> Remember me</label>
              <a className="text-sm text-indigo-600">Forgot?</a>
            </div>

            <button className="mt-2 bg-gradient-to-r from-indigo-600 to-emerald-400 text-white px-4 py-3 rounded-lg font-medium shadow" type="submit" disabled={loading}>{loading? 'Signing in...' : 'Sign in'}</button>

            <div className="text-sm text-center text-gray-500">
              Need an account? <Link to="/signup" className="text-indigo-600 font-medium">Sign up</Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
