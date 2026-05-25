"use client";

import React, { useState, useEffect } from 'react';
import { Search, Calendar, Scale, AlertTriangle, CheckCircle2, Eye } from 'lucide-react';
// Sesuaikan path import Sidebar ini jika berbeda letaknya
import Sidebar from '../components/Sidebar'; 

interface HistoryItem {
  id: string;
  date: string;
  age: string;
  weight: string;
  height: string;
  bmi: string;
  highBP: string;
  highChol: string;
  prediction: string;
  status: string;
}

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const defaultData: HistoryItem[] = [
      { id: "DL-9082", date: "2026-05-18", age: "45-49 thn", weight: "78 kg", height: "168 cm", bmi: "27.6", highBP: "Yes", highChol: "Yes", prediction: "Risiko Tinggi (76%)", status: "Danger" },
      { id: "DL-8941", date: "2026-04-12", age: "25-29 thn", weight: "60 kg", height: "165 cm", bmi: "22.0", highBP: "No", highChol: "No", prediction: "Risiko Ringan (12%)", status: "Safe" },
      { id: "DL-8712", date: "2026-03-01", age: "60-64 thn", weight: "72 kg", height: "160 cm", bmi: "28.1", highBP: "Yes", highChol: "No", prediction: "Risiko Sedang (43%)", status: "Warning" }
    ];

    const stored = localStorage.getItem('medicalHistory');
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHistoryData(JSON.parse(stored));
    } else {
      localStorage.setItem('medicalHistory', JSON.stringify(defaultData));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHistoryData(defaultData);
    }
  }, []);

  const filteredData = historyData.filter(item => 
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F8FF] text-slate-900 font-sans selection:bg-blue-100">
      <div className="flex">
        
        {/* Panggil komponen Sidebar di sini */}
        <Sidebar />

        {/* AREA PANEL KANAN */}
        <div className="md:pl-64 pt-20 md:pt-0 w-full">
          <main className="p-8 max-w-7xl mx-auto space-y-6">
            
            <div className="rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 shadow-xl shadow-blue-100 text-white relative overflow-hidden">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between relative z-10">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-200">Screening Logs</p>
                  <h1 className="mt-1 text-3xl font-black tracking-tight text-white">Riwayat Pemeriksaan Medis</h1>
                </div>
                <div className="text-blue-100 text-xs sm:text-sm max-w-xl leading-relaxed font-medium">
                  Pantau dan tinjau kembali hasil kalkulasi risiko diabetes dari pemeriksaan yang telah Anda lakukan sebelumnya dalam satu rekapan tabel terpadu.
                </div>
              </div>
            </div>

            {/* SEARCH & UTILITY */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200/60 shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari ID Pemeriksaan..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white text-black"
                />
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Rekaman: <span className="text-blue-600 font-black">{filteredData.length} Data</span>
              </div>
            </div>

            {/* TABEL RIWAYAT */}
            <div className="rounded-[2.5rem] bg-white border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100">
                      <th className="p-5 text-[10px] font-black uppercase tracking-wider text-slate-400">ID / Tanggal</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-wider text-slate-400">Profil Fisik</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-wider text-slate-400">Hasil BMI</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-wider text-slate-400">Hipertensi</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-wider text-slate-400">Kolesterol</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-wider text-slate-400">Prediksi AI</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredData.map((row, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-5">
                          <div className="font-black text-xs text-slate-900">{row.id}</div>
                          <div className="text-[10px] font-bold text-slate-400 mt-0.5 flex items-center gap-1">
                            <Calendar size={11} /> {row.date}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="text-xs font-bold text-slate-800">Umur: {row.age}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 font-semibold">{row.weight} / {row.height}</div>
                        </td>
                        <td className="p-5">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 text-xs font-black">
                            <Scale size={12} /> {row.bmi}
                          </div>
                        </td>
                        <td className="p-5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase ${row.highBP === 'Yes' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-100 text-slate-500'}`}>{row.highBP}</span>
                        </td>
                        <td className="p-5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase ${row.highChol === 'Yes' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-slate-100 text-slate-500'}`}>{row.highChol}</span>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            {row.status === 'Danger' && <AlertTriangle size={14} className="text-rose-500" />}
                            {row.status === 'Warning' && <AlertTriangle size={14} className="text-amber-500" />}
                            {row.status === 'Safe' && <CheckCircle2 size={14} className="text-emerald-500" />}
                            <span className={`text-xs font-black ${row.status === 'Danger' ? 'text-rose-600' : row.status === 'Warning' ? 'text-amber-600' : 'text-emerald-600'}`}>{row.prediction}</span>
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          <button className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100 rounded-xl px-3 py-1.5 text-xs font-bold transition-all shadow-sm">
                            <Eye size={12} /> <span>Detail</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}