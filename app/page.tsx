"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  BrainCircuit
} from 'lucide-react';

export default function LandingPage() {
  // --- ANIMASI MENGETIK (TYPEWRITER) ---
  const words = ["Diabetes Risk.", "Your Health.", "Clinical Data."];
  const [typedText, setTypedText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typeSpeed, setTypeSpeed] = useState(150);

  useEffect(() => {
    const currentWord = words[wordIdx];
    const timer = setTimeout(() => {
      if (!isDeleting) {
        setTypedText(currentWord.substring(0, typedText.length + 1));
        setTypeSpeed(120);
        if (typedText === currentWord) {
          setTypeSpeed(2000); 
          setIsDeleting(true);
        }
      } else {
        setTypedText(currentWord.substring(0, typedText.length - 1));
        setTypeSpeed(60);
        if (typedText === "") {
          setIsDeleting(false);
          setWordIdx((prev) => (prev + 1) % words.length);
          setTypeSpeed(300);
        }
      }
    }, typeSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, wordIdx, typeSpeed]);

  // --- SMOOTH SCROLL ---
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- STATE SCREENING INTERAKTIF ---
  const [form, setForm] = useState({ HighBP: 'No', HighChol: 'No', Weight: '65', Height: '170' });
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [prediction, setPrediction] = useState("");

  const bmiVal = useMemo(() => {
    const w = parseFloat(form.Weight);
    const h = parseFloat(form.Height) / 100;
    return w > 0 && h > 0 ? Math.round(w / (h * h)) : 0;
  }, [form.Weight, form.Height]);

  const handleFormChange = (field: string, val: string) => {
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowResult(false);

    setTimeout(() => {
      let res = "Low Risk (Tingkat Risiko Rendah)";
      if (form.HighBP === 'Yes' || bmiVal > 25) res = "Medium Risk (Tingkat Risiko Sedang)";
      if (form.HighBP === 'Yes' && form.HighChol === 'Yes' && bmiVal > 27) res = "High Risk (Tingkat Risiko Tinggi)";
      
      setPrediction(res);
      setLoading(false);
      setShowResult(true);
    }, 1000);
  };

  // --- DATA 6 ANGGOTA TIM (2 DS, 2 AI, 2 FS) ---
  const teamMembers = [
    { name: "Djibrani Yuda", role: "Lead AI Engineer", initials: "DY", bg: "from-blue-100 to-indigo-100", text: "text-indigo-600", desc: "Mengembangkan arsitektur deep learning dan mengoptimalkan akurasi model neural network DiaLens." },
    { name: "Jonathan Alfa", role: "AI Engineer", initials: "JA", bg: "from-purple-100 to-indigo-100", text: "text-purple-600", desc: "Fokus pada integrasi pipeline model kecerdasan buatan dan fine-tuning inferensi data klinis." },
    { name: "Reza Maulana", role: "Senior Data Scientist", initials: "RM", bg: "from-emerald-100 to-teal-100", text: "text-emerald-600", desc: "Melakukan analisis prediktif, eksplorasi fitur medis, dan memastikan validitas statistik dataset." },
    { name: "Farih Kamil", role: "Data Scientist", initials: "FK", bg: "from-teal-100 to-cyan-100", text: "text-teal-600", desc: "Bertanggung jawab atas pembersihan big data kesehatan, pemrosesan korelasi indikator, dan visualisasi tren." },
    { name: "Edwin Fadhilah", role: "Lead Fullstack Developer", initials: "EF", bg: "from-sky-100 to-blue-100", text: "text-blue-600", desc: "Merancang arsitektur aplikasi Next.js, manajemen state dashboard, serta interkoneksi RESTful API backend." },
    { name: "Abinaya Azhar", role: "Fullstack Developer", initials: "AA", bg: "from-slate-100 to-blue-100", text: "text-slate-600", desc: "Mengimplementasikan desain antarmuka responsif, manajemen database riwayat pemeriksaan, dan performa web." },
  ];

  return (
    <div className="min-h-screen bg-[#F4F8FF] text-slate-900 font-sans selection:bg-blue-100 relative overflow-x-hidden">
      
      {/* BACKGROUND WATERMARK */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none z-0 opacity-[0.03] w-full max-w-7xl flex items-center justify-center scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" className="w-full text-blue-600">
          <path fill="currentColor" d="M400,100 C250,100 150,200 150,350 C150,450 200,550 300,650 L400,750 L500,650 C600,550 650,450 650,350 C650,200 550,100 400,100 Z" />
        </svg>
      </div>

      {/* NAV BAR */}
      <header className="w-full fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-md border-b border-slate-200/40 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-3.5 py-1.5 rounded-xl font-black text-sm shadow-md shadow-blue-200">DL</div>
            <span className="font-black text-sm text-slate-900 tracking-tight">DIALENS AI</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-bold text-xs text-slate-500 uppercase tracking-wider">
            <a href="#home" onClick={(e) => handleSmoothScroll(e, 'home')} className="hover:text-blue-600 py-1.5 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#screening" onClick={(e) => handleSmoothScroll(e, 'screening')} className="hover:text-blue-600 py-1.5 relative group">
              Screening
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} className="hover:text-blue-600 py-1.5 relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          <div>
            <Link href="/login" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-blue-100 flex items-center gap-1.5 hover:scale-[1.03] transition-all">
              <span>Login Account</span>
              <ChevronRight size={13} strokeWidth={3} />
            </Link>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section id="home" className="min-h-screen flex flex-col items-center justify-center px-4 pt-28 text-center relative z-10 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Clinical Grade AI Detector
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl">
          The Clinical Curator <br />
          for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 border-r-4 border-indigo-600 pr-2">{typedText}</span>
        </h1>

        <p className="mt-8 text-sm sm:text-base text-slate-500 font-medium leading-relaxed max-w-2xl">
          DiaLens leverages state-of-the-art neural networks to analyze patient data, providing clinicians and individuals with high-fidelity, instantaneous risk assessments.
        </p>

        <div className="mt-10">
          <a href="#screening" onClick={(e) => handleSmoothScroll(e, 'screening')} className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2">
            <span>Coba Skrining Gratis</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* JEMBATAN VISUAL */}
      <div className="w-full rotate-180 -mb-1 pointer-events-none bg-white">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full text-[#F4F8FF]">
          <path d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z" fill="currentColor"></path>
        </svg>
      </div>

      {/* 2. INTERACTIVE SCREENING SECTION */}
      <section id="screening" className="bg-white py-24 px-4 relative z-10 border-b border-slate-100">
        <div className="max-w-3xl mx-auto w-full space-y-3 text-center mb-12">
          <div className="inline-flex p-2 bg-blue-50 text-blue-600 rounded-2xl mb-1">
            <Activity size={20} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Kalkulator Demo Instan</h2>
          <p className="text-slate-400 text-xs font-medium max-w-md mx-auto">
            Rasakan kecepatan algoritma kami memetakan risiko kesehatan dasar Anda secara langsung sebelum mendaftar.
          </p>
        </div>

        <div className="max-w-2xl mx-auto w-full bg-[#F4F8FF] rounded-[2.5rem] border border-slate-200/50 p-8 shadow-inner relative">
          <form onSubmit={handleTestSubmit} className="space-y-5 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/40 space-y-1.5 shadow-sm">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Tekanan Darah Tinggi?</label>
                <select value={form.HighBP} onChange={e => handleFormChange('HighBP', e.target.value)} className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-xs font-bold text-black outline-none">
                  <option value="No">No (Normal)</option>
                  <option value="Yes">Yes (Ada Riwayat)</option>
                </select>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/40 space-y-1.5 shadow-sm">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Kolesterol Tinggi?</label>
                <select value={form.HighChol} onChange={e => handleFormChange('HighChol', e.target.value)} className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-xs font-bold text-black outline-none">
                  <option value="No">No (Normal)</option>
                  <option value="Yes">Yes (Ada Riwayat)</option>
                </select>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/40 space-y-1.5 shadow-sm">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Tinggi Badan (cm)</label>
                <input type="number" value={form.Height} onChange={e => handleFormChange('Height', e.target.value)} className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-xs font-bold text-black outline-none" />
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/40 space-y-1.5 shadow-sm">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Berat Badan (kg)</label>
                <input type="number" value={form.Weight} onChange={e => handleFormChange('Weight', e.target.value)} className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-xs font-bold text-black outline-none" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2">
              <BrainCircuit size={16} />
              {loading ? "Menghitung Parameter..." : "Analisis Risiko AI Sekarang"}
            </button>
          </form>

          {showResult && (
            <div className="mt-6 p-6 bg-white rounded-3xl border-2 border-dashed border-blue-200 text-center space-y-5 shadow-xl shadow-blue-100/50 relative z-10">
              <div>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Kalkulasi AI Sementara</p>
                <h4 className="text-xl font-black text-blue-600 mt-1">{prediction}</h4>
                <div className="inline-block bg-sky-50 text-sky-700 text-[10px] font-black px-2.5 py-1 rounded-md mt-2 border border-sky-100">
                  Body Mass Index: {bmiVal} BMI
                </div>
              </div>
              <hr className="border-slate-100" />
              <div className="space-y-4">
                <p className="text-xs text-slate-500 font-semibold leading-relaxed px-4">
                  Sistem AI mendeteksi kecenderungan data Anda. Daftarkan diri Anda sekarang untuk membuka fitur rekam medis lengkap dan menyimpan seluruh hasil ini!
                </p>
                <Link href="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs uppercase tracking-wider px-8 py-3.5 rounded-2xl shadow-lg transition-all">
                  <ShieldCheck size={14} />
                  <span>Simpan Hasil ke Riwayat Akun Resmi</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. ABOUT US SECTION (6 ANGGOTA: 2 DS, 2 AI, 2 FS) */}
      <section id="about" className="bg-slate-50/60 py-24 px-4 relative z-10">
        <div className="max-w-5xl mx-auto space-y-16">
          
          <div className="text-center space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600">The Innovators</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Meet Our Special Team</h2>
            <p className="text-slate-400 text-xs font-medium max-w-sm mx-auto">
              Kolaborasi lintas keahlian dari para spesialis data, kecerdasan buatan, dan insinyur piranti lunak DiaLens.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white border border-slate-200/50 rounded-[2rem] p-6 shadow-sm flex flex-col items-center text-center space-y-4 hover:-translate-y-1 transition-all duration-200 group">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${member.bg} border-4 border-white shadow-md flex items-center justify-center overflow-hidden relative`}>
                  <span className={`font-black text-xl ${member.text} group-hover:scale-110 transition-transform`}>{member.initials}</span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">{member.name}</h4>
                  <p className="text-[11px] text-blue-600 font-bold uppercase tracking-wider mt-0.5">{member.role}</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-2 px-2 leading-relaxed">
                    {member.desc}
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <a href="#" className="p-2 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-colors">
                    <svg className="w-[15px] h-[15px] fill-currentColor" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                  </a>
                  <a href="#" className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors">
                    <svg className="w-[15px] h-[15px] fill-currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.0.069-.608 1.003.705 1.531 1.033 1.531 1.033.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}