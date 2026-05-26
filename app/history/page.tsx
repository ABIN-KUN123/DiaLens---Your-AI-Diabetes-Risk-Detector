"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Calendar, Scale, AlertTriangle, CheckCircle2, Eye, X, Download, FileText, Activity } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import Image from 'next/image';

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
  
  // State untuk Modal
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const receiptRef = useRef<HTMLDivElement>(null);

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
      
      setHistoryData(defaultData);
    }
  }, []);

  const filteredData = historyData.filter(item => 
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fungsi Buka Modal
  const openModal = (item: HistoryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Fungsi Download PDF
  const handleDownloadPDF = async () => {
    if (!receiptRef.current || !selectedItem) return;
    
    try {
      setIsDownloading(true);
      const canvas = await html2canvas(receiptRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Medical_Report_${selectedItem.id}.pdf`);
    } catch (error) {
      console.error("Gagal mendownload PDF", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FF] text-slate-900 font-sans selection:bg-blue-100">
      <div className="flex">
        
        <Sidebar />

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
                          <button 
                            onClick={() => openModal(row)}
                            className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100 rounded-xl px-3 py-1.5 text-xs font-bold transition-all shadow-sm"
                          >
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

      {/* MODAL / POPUP RESEP MEDIS */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-500">
                <FileText size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Medical Report</span>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-200/50 hover:bg-rose-100 hover:text-rose-600 rounded-full transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Konten Surat (Yang akan di-Screenshot/PDF-kan) */}
            <div className="overflow-y-auto p-8 bg-slate-100">
              <div ref={receiptRef} className="bg-white p-10 rounded-xl shadow-sm border border-slate-200 mx-auto w-full max-w-[21cm]"> {/* Format ukuran A4 */}
                
                {/* Kop Surat */}
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                       <Image src="/Logo%20Dialens%20AI.png" alt="Logo" width={40} height={40} className="object-contain" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">DiaLens Diagnostics</h2>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">AI Powered Health Screening</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">Doc ID: {selectedItem.id}</p>
                    <p className="text-xs text-slate-500 mt-1">Tanggal: {selectedItem.date}</p>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest border-y border-dashed border-slate-300 py-3 inline-block px-8">Surat Keterangan Medis</h3>
                </div>

                {/* Data Pasien */}
                <div className="mb-8">
                  <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">A. Profil Biometrik Pasien</h4>
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Estimasi Umur</p>
                      <p className="text-sm font-black text-slate-800">{selectedItem.age}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Indeks Massa Tubuh (BMI)</p>
                      <p className="text-sm font-black text-slate-800">{selectedItem.bmi} <span className="text-xs font-normal text-slate-500 ml-1">({selectedItem.weight} / {selectedItem.height})</span></p>
                    </div>
                  </div>
                </div>

                {/* Data Klinis */}
                <div className="mb-8">
                  <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">B. Anamnesis Klinis</h4>
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 text-sm font-bold text-slate-600 w-2/3">Riwayat Hipertensi (Tekanan Darah Tinggi)</td>
                        <td className="py-3 text-right">
                          <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg ${selectedItem.highBP === 'Yes' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>{selectedItem.highBP}</span>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 text-sm font-bold text-slate-600 w-2/3">Riwayat Hiperkolesterolemia (Kolesterol Tinggi)</td>
                        <td className="py-3 text-right">
                          <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg ${selectedItem.highChol === 'Yes' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>{selectedItem.highChol}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Kesimpulan AI */}
                <div className="mb-8">
                  <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">C. Kesimpulan Analisis AI</h4>
                  <div className={`p-6 rounded-2xl border-2 border-dashed ${
                      selectedItem.status === 'Danger' ? 'bg-rose-50 border-rose-200' :
                      selectedItem.status === 'Warning' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
                    }`}>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tingkat Risiko Diabetes</p>
                    <div className="flex items-center gap-3">
                      {selectedItem.status === 'Danger' && <AlertTriangle size={28} className="text-rose-600" />}
                      {selectedItem.status === 'Warning' && <AlertTriangle size={28} className="text-amber-600" />}
                      {selectedItem.status === 'Safe' && <CheckCircle2 size={28} className="text-emerald-600" />}
                      <h2 className={`text-2xl font-black uppercase ${
                        selectedItem.status === 'Danger' ? 'text-rose-700' :
                        selectedItem.status === 'Warning' ? 'text-amber-700' : 'text-emerald-700'
                      }`}>
                        {selectedItem.prediction}
                      </h2>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed mt-4">
                      *Catatan: Dokumen ini dihasilkan secara otomatis oleh sistem Kecerdasan Buatan DiaLens. Hasil ini bersifat prediktif untuk skrining awal dan **bukan** merupakan diagnosis medis definitif. Konsultasikan dengan dokter spesialis untuk pemeriksaan lebih lanjut.
                    </p>
                  </div>
                </div>

                {/* Tanda Tangan */}
                <div className="mt-16 flex justify-end">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-16">DiaLens AI System</p>
                    <div className="flex items-center justify-center gap-2 text-blue-600">
                      <Activity size={16} />
                      <span className="font-black text-xl italic tracking-tighter">Verified by AI</span>
                    </div>
                    <div className="w-48 h-px bg-slate-300 mt-2 mb-2 mx-auto"></div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Signature</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer Modal / Tombol Download */}
            <div className="p-5 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Tutup
              </button>
              <button 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-blue-100 transition-all disabled:opacity-70"
              >
                {isDownloading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <Download size={16} />
                )}
                <span>{isDownloading ? 'Menyimpan...' : 'Download PDF'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}