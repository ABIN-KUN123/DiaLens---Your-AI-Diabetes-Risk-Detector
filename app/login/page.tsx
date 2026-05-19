"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../api';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (token) router.push('/dashboard');
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const endpoint = mode === 'login' ? '/health/login' : '/health/register';
      const payload = mode === 'login'
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const response = await api.post(endpoint, payload);
      const token = response.data.token;
      const name = response.data.user?.name || formData.name || 'Pengguna';
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userName', name);
        router.push('/dashboard');
      } else {
        setMessage('Gagal menerima token dari server.');
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Terjadi kesalahan saat auth.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.18),_transparent_18%),linear-gradient(180deg,_#F4F8FC_0%,_#E8F1FC_100%)] px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-[2.25rem] bg-white/95 p-8 shadow-[0_32px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl border border-slate-200/70">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className=\"text-sm uppercase tracking-[0.35em] text-blue-600 font-semibold\">Access</p>
            <h1 className="mt-3 text-4xl font-black text-slate-900">Masuk atau buat akun baru</h1>
            <p className="mt-3 max-w-xl text-slate-500">Jika belum memiliki akun, pilih register. Setelah terdaftar, Anda akan diarahkan ke dashboard pengguna.</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setMode('login')} className={`rounded-3xl px-6 py-3 text-sm font-bold transition ${mode === 'login' ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>Login</button>
            <button type="button" onClick={() => setMode('register')} className={`rounded-3xl px-6 py-3 text-sm font-bold transition ${mode === 'register' ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>Register</button>
          </div>
        </div>

        {message && <div className="mb-6 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{message}</div>}

        <form onSubmit={handleSubmit} className="grid gap-6">
          {mode === 'register' && (
            <label className="space-y-2 text-sm font-semibold text-slate-700">
              Nama Lengkap
              <input type=\"text\" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className=\"w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100\" />
            </label>
          )}
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Email
              <input type=\"email\" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className=\"w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100\" />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Password
              <input type=\"password\" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required className=\"w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100\" />
          </label>

          <button type=\"submit\" disabled={loading} className=\"rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-700 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-70\">{loading ? 'Memproses...' : mode === 'login' ? 'Masuk Sekarang' : 'Daftar Sekarang'}</button>
        </form>
      </div>
    </div>
  );
}
