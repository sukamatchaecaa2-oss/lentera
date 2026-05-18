import React, { useState } from "react";
import { ArrowLeft, CheckCircle, TrendingUp, BookOpen, Clock, Printer, Star, Award, ChevronRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { MOCK_TUGAS, MOCK_PROFILE } from "../constants";

export default function RekapSiswa() {
  const navigate = useNavigate();
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const rekapNilai = [
    { mapel: "Matematika", nilai: 88, status: "A", guru: "Ibu Sri" },
    { mapel: "Fisika", nilai: 92, status: "A", guru: "Pak Bambang" },
    { mapel: "Kimia", nilai: 75, status: "B", guru: "Ibu Maya" },
    { mapel: "Biologi", nilai: 85, status: "A", guru: "Pak Eko" },
    { mapel: "Sejarah", nilai: 95, status: "A+", guru: "Ibu Rahma" },
  ];

  return (
    <div className="space-y-8 pb-32">
      {/* Print View (Hidden) */}
      <div className="hidden print:block p-12 text-slate-900">
         <div className="text-center border-b-4 border-double border-slate-900 pb-6 mb-10">
            <h1 className="text-3xl font-black uppercase tracking-tighter">Lentera Akademik Modern</h1>
            <p className="text-sm font-bold mt-1">Laporan Hasil Belajar Mandiri (Semester Genap)</p>
         </div>

         <div className="grid grid-cols-2 gap-10 mb-10">
            <div>
               <p className="text-xs uppercase font-black text-slate-400 mb-2">Biodata Siswa</p>
               <div className="space-y-1 text-sm">
                  <p className="flex justify-between border-b pb-1"><span>Nama Lengkap:</span> <span className="font-bold">{MOCK_PROFILE.nama_lengkap}</span></p>
                  <p className="flex justify-between border-b pb-1"><span>Nomor Induk:</span> <span className="font-bold">2024001002</span></p>
                  <p className="flex justify-between border-b pb-1"><span>Kelas:</span> <span className="font-bold">XII - IPA 1</span></p>
               </div>
            </div>
            <div>
               <p className="text-xs uppercase font-black text-slate-400 mb-2">Ringkasan Capaian</p>
               <div className="space-y-1 text-sm">
                  <p className="flex justify-between border-b pb-1"><span>Rata-rata Nilai:</span> <span className="font-bold">87.6</span></p>
                  <p className="flex justify-between border-b pb-1"><span>Kehadiran:</span> <span className="font-bold">98%</span></p>
                  <p className="flex justify-between border-b pb-1"><span>Peringkat:</span> <span className="font-bold">3 dari 32</span></p>
               </div>
            </div>
         </div>

         <table className="w-full border-collapse border border-slate-300 mb-10">
            <thead>
               <tr className="bg-slate-50">
                  <th className="border border-slate-300 p-3 text-left">Mata Pelajaran</th>
                  <th className="border border-slate-300 p-3 text-center">Nilai</th>
                  <th className="border border-slate-300 p-3 text-center">Grade</th>
                  <th className="border border-slate-300 p-3 text-left">Guru Pengampu</th>
               </tr>
            </thead>
            <tbody>
               {rekapNilai.map((item, i) => (
                  <tr key={i}>
                     <td className="border border-slate-300 p-3 font-bold">{item.mapel}</td>
                     <td className="border border-slate-300 p-3 text-center">{item.nilai}</td>
                     <td className="border border-slate-300 p-3 text-center font-black">{item.status}</td>
                     <td className="border border-slate-300 p-3 italic">{item.guru}</td>
                  </tr>
               ))}
            </tbody>
         </table>

         <div className="mt-20 flex justify-end">
            <div className="text-center w-64 border-t border-slate-900 pt-2">
               <p className="text-xs font-black uppercase">Kepala Sekolah</p>
               <div className="h-16" />
               <p className="text-sm font-bold">Drs. H. Ahmad Fauzi, M.Pd</p>
               <p className="text-[10px] text-slate-500">NIP. 19720512 199803 1 004</p>
            </div>
         </div>
      </div>

      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-slate-400 hover:text-blue-600 text-sm font-bold mb-2 transition-colors cursor-pointer" onClick={() => navigate("/")}>
            <ArrowLeft size={16} /> Kembali
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Rekapitulasi Belajar Saya</h2>
          <p className="text-slate-500 mt-1">Pantau grafik kedisiplinan dan capaian akademikmu secara real-time.</p>
        </div>
        <button 
          onClick={handlePrint}
          className="px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-600 font-black text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3 uppercase tracking-widest shadow-sm active:scale-95"
        >
          <Printer size={20} className="text-blue-600" /> Cetak Rapor Digital
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-10">
                     <div>
                        <h3 className="text-3xl font-black mb-1">Status Kehadiran</h3>
                        <p className="text-blue-400 text-xs font-black uppercase tracking-[0.2em]">Kesenangan Belajar Bulan Ini</p>
                     </div>
                     <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                        <TrendingUp size={24} className="text-blue-400" />
                     </div>
                  </div>
                  
                  <div className="flex items-end gap-3 h-48">
                     {[60, 80, 100, 90, 85, 95, 100, 40, 80, 95].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                           <div className="w-full bg-white/5 rounded-[1rem] overflow-hidden relative h-full">
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className={`absolute bottom-0 w-full transition-all duration-1000 ${h >= 90 ? "bg-blue-500" : h >= 70 ? "bg-blue-400/50" : "bg-red-400/30"}`}
                              />
                           </div>
                           <span className="text-[9px] font-black text-slate-500 uppercase">W{i+1}</span>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="absolute top-0 right-0 p-12 opacity-[0.02] rotate-12 -translate-y-8 translate-x-8">
                  <Award size={300} />
               </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Rincian Nilai Per Mata Pelajaran</h3>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Semester 2</span>
               </div>
               <div className="space-y-4">
                  {rekapNilai.map((item, i) => (
                     <div key={i} className="group p-5 bg-slate-50 hover:bg-white rounded-[2rem] border border-transparent hover:border-blue-100 transition-all flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm font-black group-hover:scale-110 transition-transform">
                              {item.nilai}
                           </div>
                           <div>
                              <p className="text-md font-black text-slate-800">{item.mapel}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.guru}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className={`px-4 py-1.5 rounded-xl text-xs font-black ${item.status.includes('A') ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"} uppercase tracking-widest`}>
                              Grade {item.status}
                           </div>
                           <ChevronRight size={18} className="text-slate-300" />
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
               <div className="relative z-10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Penghargaan Terbaru</p>
                  <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
                     <Star size={32} fill="currentColor" className="text-yellow-300 mb-4" />
                     <h4 className="text-xl font-black mb-2">Duta Kedisiplinan</h4>
                     <p className="text-blue-100 text-xs leading-relaxed font-medium">Bulan April 2026</p>
                     <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-6">+500 XP Kolektif</p>
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
               <h3 className="text-lg font-black text-slate-800 mb-8 tracking-tight">Kumpulkan Lencana</h3>
               <div className="grid grid-cols-2 gap-4">
                  {[
                     { name: "Pagi Ceria", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
                     { name: "Master Tugas", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
                     { name: "Bibit Unggul", icon: Star, color: "text-emerald-500", bg: "bg-emerald-50" },
                     { name: "Kutu Buku", icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-50" },
                  ].map((badge, idx) => (
                     <div key={idx} className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-100 transition-all cursor-pointer group">
                        <div className={`w-12 h-12 ${badge.bg} ${badge.color} rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform`}>
                           <badge.icon size={24} />
                        </div>
                        <p className="text-[10px] font-black text-slate-700 uppercase text-center tracking-widest">{badge.name}</p>
                        <div className="mt-3 flex gap-0.5">
                           {[1,2,3].map(i => <div key={i} className={`w-1 h-1 rounded-full ${i <= 2 ? "bg-blue-500" : "bg-slate-200"}`} />)}
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="bg-blue-600 p-8 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl shadow-blue-200">
               <div className="relative z-10">
                  <h4 className="text-xl font-black mb-2 tracking-tight">Butuh Konsultasi?</h4>
                  <p className="text-blue-100 text-xs leading-relaxed mb-6 font-medium">Bicarakan kemajuan belajarmu dengan Guru Wali Kelas atau AI Tutor.</p>
                  <button className="w-full py-4 bg-white text-blue-600 font-extrabold text-sm rounded-2xl hover:bg-blue-50 transition-all active:scale-95 shadow-xl shadow-blue-700/20">
                     Mulai Obrolan
                  </button>
               </div>
               <Award size={140} className="absolute -bottom-10 -right-6 text-white/10 group-hover:rotate-12 transition-transform" />
            </div>
         </div>
      </div>
    </div>
  );
}
