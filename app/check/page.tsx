"use client";

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Calendar,
  Scale,
  HeartPulse,
  Droplets,
  Eye,
  Dumbbell,
  Cigarette,
  Wine,
  CheckCircle2,
  Info
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

// --- COMPONENT: COLORFUL FORM CARD (BENTO GRID) ---
interface FormCardProps {
  label: string;
  alias: string;
  icon: React.ElementType;
  iconBg: string;
  gradientBg: string;
  children: React.ReactNode;
}

const FormCard = ({ label, alias, icon: Icon, iconBg, gradientBg, children }: FormCardProps) => (
  <div className={`rounded-[2rem] border border-slate-200/50 bg-gradient-to-b ${gradientBg} p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between`}>
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className={`p-2.5 rounded-xl ${iconBg} text-white shadow-sm`}>
          <Icon size={16} />
        </div>
        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 bg-white/80 px-2 py-0.5 rounded-md border border-slate-100">
          {alias}
        </span>
      </div>
      <label className="text-xs font-black uppercase tracking-[0.05em] text-slate-700 block px-0.5">
        {label}
      </label>
    </div>
    <div className="mt-3">
      {children}
    </div>
  </div>
);

// --- HALAMAN UTAMA ---
export default function CheckKesehatanPage() {
  // State Input Form menggunakan standar biner numerik (1/0) untuk model AI
  const [form, setForm] = useState({
    Age: '1',
    Weight: '60',
    Height: '165',
    HighBP: '0',
    HighChol: '0',
    CholCheck: '1',
    PhysActivity: '1',
    Smoker: '0',
    HvyAlcoholConsump: '0'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ prediction: string; computedBmi: string } | null>(null);

  // Kalkulasi Skor BMI Real-time
  const currentBmi = useMemo(() => {
    const w = parseFloat(form.Weight);
    const h = parseFloat(form.Height) / 100;
    if (w > 0 && h > 0) {
      return (w / (h * h)).toFixed(1);
    }
    return '0.0';
  }, [form.Weight, form.Height]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const ageLabels: { [key: string]: string } = {
      "1": "18-24 thn", "2": "25-29 thn", "3": "30-34 thn", "4": "35-39 thn",
      "5": "40-44 thn", "6": "45-49 thn", "7": "50-54 thn", "8": "55-59 thn",
      "9": "60-64 thn", "10": "65-69 thn", "11": "70-74 thn", "12": "75-79 thn", "13": "80+ thn"
    };

    const bmiValue = parseFloat(currentBmi);
    let predictionText = "Risiko Ringan (12%)";
    let statusText = "Safe";

    if (form.HighBP === "1" || bmiValue >= 27) {
      predictionText = "Risiko Tinggi (76%)";
      statusText = "Danger";
    } else if (form.HighChol === "1" || bmiValue >= 24) {
      predictionText = "Risiko Sedang (43%)";
      statusText = "Warning";
    }

    // Simulasi jeda loading AI
    setTimeout(() => {
      // 1. Siapkan data log baru
      const newHistoryItem = {
        id: `DL-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        age: ageLabels[form.Age] || "18-24 thn",
        weight: `${form.Weight} kg`,
        height: `${form.Height} cm`,
        bmi: currentBmi,
        highBP: form.HighBP === "1" ? "Yes" : "No",
        highChol: form.HighChol === "1" ? "Yes" : "No",
        prediction: predictionText,
        status: statusText
      };

      // 2. Ambil history lama dari local storage
      const existingHistoryRaw = localStorage.getItem('medicalHistory');
      let currentHistory = [];
      if (existingHistoryRaw) {
        currentHistory = JSON.parse(existingHistoryRaw);
      }

      // 3. Gabungkan dan simpan kembali
      const updatedHistory = [newHistoryItem, ...currentHistory];
      localStorage.setItem('medicalHistory', JSON.stringify(updatedHistory));

      // 4. Update UI hasil
      setResult({
        prediction: predictionText,
        computedBmi: currentBmi
      });
      setLoading(false);
      
      alert("Analisis AI Berhasil! Data telah disimpan.");
    }, 1200);
  };

  const inputStyle = "w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white shadow-inner text-black cursor-pointer";

  return (
    <div className="min-h-screen bg-[#F4F8FF] text-slate-900 font-sans selection:bg-blue-100">
      <div className="flex">
        
        {/* Panggil komponen Sidebar terpusat */}
        <Sidebar />

        {/* UTAMA PANEL AREA */}
        <div className="md:pl-64 pt-20 md:pt-0 w-full">
          <main className="p-8 max-w-7xl mx-auto space-y-6">
            
            <div className="rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 shadow-xl shadow-blue-100 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between relative z-10">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-200">AI Medical Screener</p>
                  <h1 className="mt-1 text-3xl font-black tracking-tight text-white">Kalkulator Prediksi Risiko Diabetes</h1>
                </div>
                <div className="text-blue-100 text-xs sm:text-sm max-w-xl leading-relaxed font-medium">
                  Isi parameter tubuh Anda di bawah ini. Grid kartu interaktif kami dirancang berwarna agar proses skrining Anda menjadi lebih mudah dipahami dan menyenangkan.
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* SISI KIRI: INPUT FORM (BENTO GRID) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* BAGIAN 1: BIOMETRIK FISIK */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                    Step 1: Patient Biometrics
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormCard label="Kategori Umur" alias="_AGEG5YR" icon={Calendar} iconBg="bg-amber-500" gradientBg="from-amber-50/60 to-white">
                      <select value={form.Age} onChange={e => handleChange('Age', e.target.value)} className={inputStyle}>
                        <option value="1">1 = 18 - 24 tahun</option>
                        <option value="2">2 = 25 - 29 tahun</option>
                        <option value="3">3 = 30 - 34 tahun</option>
                        <option value="4">4 = 35 - 39 tahun</option>
                        <option value="5">5 = 40 - 44 tahun</option>
                        <option value="6">6 = 45 - 49 tahun</option>
                        <option value="7">7 = 50 - 54 tahun</option>
                        <option value="8">8 = 55 - 59 tahun</option>
                        <option value="9">9 = 60 - 64 tahun</option>
                        <option value="10">10 = 65 - 69 tahun</option>
                        <option value="11">11 = 70 - 74 tahun</option>
                        <option value="12">12 = 75 - 79 tahun</option>
                        <option value="13">13 = 80 tahun atau lebih</option>
                      </select>
                    </FormCard>

                    <FormCard label="Berat Badan (kg)" alias="Weight" icon={Scale} iconBg="bg-sky-500" gradientBg="from-sky-50/60 to-white">
                      <input type="number" value={form.Weight} onChange={e => handleChange('Weight', e.target.value)} placeholder="Contoh: 60" className={inputStyle} required />
                    </FormCard>

                    <FormCard label="Tinggi Badan (cm)" alias="Height" icon={Activity} iconBg="bg-blue-600" gradientBg="from-blue-50/60 to-white">
                      <input type="number" value={form.Height} onChange={e => handleChange('Height', e.target.value)} placeholder="Contoh: 165" className={inputStyle} required />
                    </FormCard>
                    
                    
                  </div>
                </div>

                {/* BAGIAN 2: DATA DIAGNOSTIK & GAYA HIDUP */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                    Step 2: Diagnostic & Lifestyle Data
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormCard label="Tekanan Darah Tinggi" alias="HighBP" icon={HeartPulse} iconBg="bg-rose-500" gradientBg="from-rose-50/60 to-white">
                      <select value={form.HighBP} onChange={e => handleChange('HighBP', e.target.value)} className={inputStyle}>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </select>
                    </FormCard>

                    <FormCard label="Kolesterol Tinggi" alias="HighChol" icon={Droplets} iconBg="bg-orange-500" gradientBg="from-orange-50/60 to-white">
                      <select value={form.HighChol} onChange={e => handleChange('HighChol', e.target.value)} className={inputStyle}>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </select>
                    </FormCard>

                    <FormCard label="Pemeriksaan Kolesterol (5 Thn)" alias="CholCheck" icon={Eye} iconBg="bg-emerald-500" gradientBg="from-emerald-50/60 to-white">
                      <select value={form.CholCheck} onChange={e => handleChange('CholCheck', e.target.value)} className={inputStyle}>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                    </FormCard>

                    <FormCard label="Aktif Berolahraga" alias="PhysActivity" icon={Dumbbell} iconBg="bg-purple-500" gradientBg="from-purple-50/60 to-white">
                      <select value={form.PhysActivity} onChange={e => handleChange('PhysActivity', e.target.value)} className={inputStyle}>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                    </FormCard>

                    <FormCard label="Status Perokok" alias="Smoker" icon={Cigarette} iconBg="bg-indigo-500" gradientBg="from-indigo-50/60 to-white">
                      <select value={form.Smoker} onChange={e => handleChange('Smoker', e.target.value)} className={inputStyle}>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </select>
                    </FormCard>

                    <FormCard label="Konsumsi Alkohol Berat" alias="HvyAlcoholConsump" icon={Wine} iconBg="bg-cyan-500" gradientBg="from-cyan-50/60 to-white">
                      <select value={form.HvyAlcoholConsump} onChange={e => handleChange('HvyAlcoholConsump', e.target.value)} className={inputStyle}>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </select>
                    </FormCard>
                  </div>
                </div>
<div className="sm:col-span-2 mt-2">
                      <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-100 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-600 text-white p-2 rounded-xl text-xs font-black">BMI</div>
                          <span className="text-xs font-bold text-slate-700">Hasil Konversi Otomatis Indeks Massa Tubuh Anda:</span>
                        </div>
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-xl font-black text-sm shadow-md">{currentBmi}</span>
                      </div>
                    </div>
                     <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-200 border border-blue-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/20 p-2 rounded-lg"><Info size={20} /></div>
                    <h3 className="font-bold text-sm uppercase tracking-wide">AI Guidelines</h3>
                  </div>
                  <p className="text-xs text-blue-100 leading-relaxed mb-6">
                    Gunakan data medis terbaru. Pastikan parameter tubuh seperti berat dan tinggi badan diisi dengan benar karena akan digunakan sebagai perhitungan indeks utama.
                  </p>
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 font-black py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider active:scale-[0.98]"
                  >
                    {loading ? 'Menganalisis...' : 'Mulai Analisis AI'}
                  </button>
                </div>
              </div>

              {/* SISI KANAN: PANEL OUTPUT & SUBMIT */}
              <div className="space-y-6 lg:col-span-1 sticky top-6">
                
                {/* Kotak Petunjuk & Tombol Submit */}
               

                {/* Panel Hasil Diagnosis */}
                <div className="rounded-[2.5rem] bg-white border border-slate-200/60 p-6 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Analysis Output</p>
                  <h3 className="mt-1 text-xl font-black text-slate-900 tracking-tight">Hasil Deteksi AI</h3>
                  
                  {result ? (
                    <div className={`mt-4 p-5 rounded-3xl flex items-start gap-3 shadow-inner border ${
                      result.prediction.includes('Tinggi') 
                        ? 'bg-rose-50 border-rose-100 text-rose-800' 
                        : result.prediction.includes('Sedang') 
                          ? 'bg-amber-50 border-amber-100 text-amber-800'
                          : 'bg-emerald-50 border-emerald-100 text-emerald-800'
                    }`}>
                      <CheckCircle2 size={22} className={`shrink-0 mt-0.5 ${
                        result.prediction.includes('Tinggi') ? 'text-rose-500' : result.prediction.includes('Sedang') ? 'text-amber-500' : 'text-emerald-500'
                      }`} />
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-wider ${
                          result.prediction.includes('Tinggi') ? 'text-rose-600' : result.prediction.includes('Sedang') ? 'text-amber-600' : 'text-emerald-600'
                        }`}>Status Prediksi</p>
                        <p className="text-base font-black mt-1 text-slate-900">{result.prediction}</p>
                        <p className="text-[11px] text-slate-500 font-medium mt-1">
                          Skor BMI Terkirim: <span className="font-bold text-slate-800">{result.computedBmi}</span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-5 bg-slate-50 text-slate-400 border border-slate-100 rounded-3xl flex items-start gap-3">
                      <Info size={18} className="text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-xs font-medium leading-relaxed">Silakan lengkapi parameter data di sebelah kiri, kemudian luncurkan analisis untuk melihat kalkulasi risiko kesehatan Anda.</p>
                    </div>
                  )}
                  
                </div>

              </div>
            </form>

          </main>
        </div>

      </div>
    </div>
  );
}