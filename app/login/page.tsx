"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../lib/api'; // Pastikan path import ini sesuai dengan struktur project Anda

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/health/login', { email, password });
      const token = res.data.token;
      const userName = res.data.user?.name || 'Pengguna';
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userName', userName);
        router.push('/dashboard');
      } else {
        setError('Login gagal. Silakan registrasi terlebih dahulu.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal. Pastikan akun terdaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
          
          {/* LOGO & JUDUL (Tampilan Di Dalam Kotak Putih) */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 flex items-center justify-center text-white font-black text-2xl shadow-md">
              DL
            </div>
            <h2 className="mt-4 text-2xl font-black text-slate-800">Masuk ke DiaLens</h2>
            <p className="text-xs text-slate-400 font-medium mt-2">
              Silakan masuk. Jika belum punya akun, daftar dulu.
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-4 text-xs font-bold bg-rose-50 border border-rose-100 text-rose-600 px-4 py-2 rounded-xl">
              {error}
            </div>
          )}

          {/* FORM LOGIN */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 px-1">Email Address</label>
              <input 
                type="email" 
                placeholder="brucad@gmail.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50 text-black" 
              />
            </div>

            <div className="text-left">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 px-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50 text-black" 
              />
            </div>

            <button 
              type="submit"
              disabled={loading} 
              className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-sky-100 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          {/* LINK MENUJU DAFTAR */}
          <p className="text-xs font-medium text-slate-400 mt-6">
            Belum punya akun?{' '}
            <Link href="/register" className="text-sky-500 font-bold hover:underline">
              Daftar sekarang
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}