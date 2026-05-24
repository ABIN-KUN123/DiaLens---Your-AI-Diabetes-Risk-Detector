"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  LogOut,
  TrendingUp,
  User,
  Zap,
  Clock,
  ArrowUpRight
} from 'lucide-react';

interface SidebarItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const SidebarItem = ({ href, icon: Icon, label, active = false }: SidebarItemProps) => (
  <Link
    href={href}
    className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all font-bold text-sm ${
      active 
        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </Link>
);

interface StatCardProps {
  title: string;
  value: string;
  desc: string;
  icon: React.ElementType;
  iconBg: string;
  gradientBg: string;
}

const StatCard = ({ title, value, desc, icon: Icon, iconBg, gradientBg }: StatCardProps) => (
  <div className={`rounded-[2rem] border border-slate-200/60 bg-gradient-to-b ${gradientBg} p-6 shadow-sm transition-all duration-300 hover:shadow-md`}>
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-white/80 px-2 py-0.5 rounded-md border border-slate-100">
        User Activity
      </span>
      <div className={`p-2.5 rounded-xl ${iconBg} text-white shadow-sm`}>
        <Icon size={16} />
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
      <p className="text-xs font-black uppercase tracking-[0.05em] text-slate-700 mt-1">{title}</p>
      <p className="text-[11px] text-slate-500 font-medium mt-2 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const pathname = usePathname();
  const router = useRouter();
  
  // State Dinamis
  const [displayName, setDisplayName] = useState('Pengguna DiaLens');
  const [totalScreening, setTotalScreening] = useState('0 Kali');
  const [lastBmi, setLastBmi] = useState('- BMI');
  const [lastRisk, setLastRisk] = useState('Belum Ada');
  const [lastLog, setLastLog] = useState<any>(null);

  useEffect(() => {
    // 1. Ambil Nama Pengguna
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setDisplayName(storedName);
    }

    // Default Mockup Data bawaan (disamakan dengan halaman History)
    const defaultData = [
      { id: "DL-9082", date: "2026-05-18", age: "45-49 thn", weight: "78 kg", height: "168 cm", bmi: "27.6", highBP: "Yes", highChol: "Yes", prediction: "Risiko Tinggi (76%)", status: "Danger" },
      { id: "DL-8941", date: "2026-04-12", age: "25-29 thn", weight: "60 kg", height: "165 cm", bmi: "22.0", highBP: "No", highChol: "No", prediction: "Risiko Ringan (12%)", status: "Safe" },
      { id: "DL-8712", date: "2026-03-01", age: "60-64 thn", weight: "72 kg", height: "160 cm", bmi: "28.1", highBP: "Yes", highChol: "No", prediction: "Risiko Sedang (43%)", status: "Warning" }
    ];

    // 2. Ambil data Rekaman Medis dari localStorage
    let history = [];
    const storedHistory = localStorage.getItem('medicalHistory');
    
    if (storedHistory) {
      history = JSON.parse(storedHistory);
    } else {
      // Jika kosong, inisialisasi dengan data mockup default agar sinkron
      localStorage.setItem('medicalHistory', JSON.stringify(defaultData));
      history = defaultData;
    }

    // 3. Hitung dan petakan ke Bento Grid secara dinamis
    if (history.length > 0) {
      setTotalScreening(`${history.length} Kali`);
      
      // Mengambil baris paling atas/paling baru dari riwayat pemeriksaan
      const latest = history[0]; 
      setLastBmi(`${latest.bmi} BMI`);
      
      // Ambil teks label depannya saja (misal: "Risiko Ringan")
      const riskStatus = latest.prediction.split(' (')[0];
      setLastRisk(riskStatus);
      
      // Simpan log paling baru untuk ditampilkan di Activity Logs bawah
      setLastLog(latest);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#F4F8FF] text-slate-900 font-sans selection:bg-blue-100">
      <div className="flex">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-100 p-6 flex flex-col justify-between z-30">
          <div className="space-y-8">
            <div className="flex items-center gap-3 px-2">
              <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md shadow-blue-100">
                <Activity size={20} strokeWidth={3} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Welcome</p>
                <h2 className="text-lg font-black text-slate-900 tracking-tight mt-1">DiaLens</h2>
              </div>
            </div>

            <nav className="space-y-1.5 flex flex-col">
              <SidebarItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" active={pathname === '/dashboard'} />
              <SidebarItem href="/check" icon={Activity} label="Check Kesehatan" active={pathname === '/check'} />
              <SidebarItem href="/history" icon={ShieldCheck} label="History" active={pathname === '/history'} />
              <SidebarItem href="/information" icon={Sparkles} label="Information" active={pathname === '/information'} />
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-rose-600 font-bold text-sm hover:bg-rose-50 transition-all text-left">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* PANEL KONTEN UTAMA */}
        <div className="pl-64 w-full">
          <main className="p-8 max-w-7xl mx-auto space-y-6">
            
            {/* HERO BANNER GRADASI */}
            <div className="rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 shadow-xl shadow-blue-100 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between relative z-10">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-200">User Dashboard</p>
                  <h1 className="mt-1 text-3xl font-black tracking-tight text-white">Selamat Datang, {displayName}!</h1>
                </div>
                <div className="text-blue-100 text-xs sm:text-sm max-w-xl leading-relaxed font-medium">
                  Ini adalah ruang pantau aktivitas kesehatan Anda. Gunakan menu navigasi untuk menguji risiko medis atau melihat kamus eksplanasi indikator klinis.
                </div>
              </div>
            </div>

            {/* BENTO GRID ACTIVITY (SINKRON DENGAN LOCALSTORAGE) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                title="Total Skrining" 
                value={totalScreening} 
                desc="Jumlah akumulasi seluruh pemeriksaan mandiri yang tersimpan di sistem riwayat Anda."
                icon={TrendingUp}
                iconBg="bg-amber-500"
                gradientBg="from-amber-50/60 to-white"
              />
              <StatCard 
                title="Indeks Massa Tubuh" 
                value={lastBmi} 
                desc="Kalkulasi terakhir menunjukkan berat badan Anda berdasarkan hasil entri indikator klinis terbaru."
                icon={User}
                iconBg="bg-sky-500"
                gradientBg="from-sky-50/60 to-white"
              />
              <StatCard 
                title="Status Risiko AI" 
                value={lastRisk} 
                desc="Berdasarkan pengujian data terbaru, algoritma sistem menyimpulkan kategori status risiko tubuh Anda saat ini."
                icon={Zap}
                iconBg={lastRisk === 'Risiko Tinggi' ? 'bg-rose-500' : lastRisk === 'Risiko Sedang' ? 'bg-amber-500' : 'bg-emerald-500'}
                gradientBg="from-purple-50/60 to-white"
              />
            </div>

            {/* LOWER TIMELINE ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2 rounded-[2.5rem] bg-white border border-slate-200/60 p-8 shadow-sm space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Activity Logs</p>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Timeline Aktivitas Terbaru</h3>
                </div>
                <div className="space-y-4">
                  {lastLog ? (
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl mt-0.5">
                        <Clock size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Melakukan Cek Kesehatan Mandiri ({lastLog.id})</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                          Sistem berhasil memprediksi parameter fisik dengan kesimpulan "{lastLog.prediction}".
                        </p>
                        <span className="inline-block text-[9px] font-black text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded mt-2">
                          {lastLog.date}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs font-semibold text-slate-400 italic">Belum ada riwayat aktivitas log medis.</p>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1 rounded-[2.5rem] bg-white border border-slate-200/60 p-6 shadow-sm space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Quick Access</p>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Mulai Tindakan</h3>
                </div>
                <div className="space-y-2.5">
                  <Link href="/check" className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-xs transition-transform hover:scale-[1.02] shadow-sm shadow-blue-100">
                    <span>Luncurkan Skrining Baru</span>
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

          </main>
        </div>

      </div>
    </div>
  );
}