"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../api';

export default function RegisterPage(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try{
      const res = await api.post('/health/register', { name, email, password });
      const token = res.data.token;
      const userName = res.data.user?.name || name;
      if(token){
        localStorage.setItem('token', token);
        localStorage.setItem('userName', userName);
        router.push('/dashboard');
      } else {
        setError('Token tidak diterima');
      }
    }catch(err: any){
      setError(err.response?.data?.message || 'Register gagal');
    }finally{setLoading(false)}
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),_transparent_20%),_linear-gradient(180deg,_#f8fbff_0%,_#eef6ff_100%)] p-6">
      <div className="w-full max-w-md bg-white/95 p-8 rounded-[2rem] shadow-[0_32px_80px_rgba(15,23,42,0.08)] border border-slate-200/70">
        <div className="mb-6">
          <h2 className="text-3xl font-black mb-2 text-slate-900">Register</h2>
          <p className="text-sm text-slate-500">Buat akun baru untuk menyimpan riwayat kesehatan dan melihat hasil skrining AI.</p>
        </div>
        {error && <div className="mb-4 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-3xl bg-gradient-to-r from-sky-600 to-cyan-500 text-white px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] shadow-lg shadow-sky-500/20 transition hover:from-sky-700 hover:to-cyan-600">{loading ? 'Loading...' : 'Create account'}</button>
        </form>
      </div>
    </div>
  )
}
