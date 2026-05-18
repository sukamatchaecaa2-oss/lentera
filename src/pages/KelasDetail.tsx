import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Users, 
  GraduationCap, 
  School, 
  Calendar, 
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { motion } from "motion/react";

export default function KelasDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/manajemen-kelas")}
            className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm active:scale-95"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Detail Kelas {id}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">Aktif - TA 2024/2025</span>
              <span className="text-slate-400 text-xs font-bold flex items-center gap-1">
                <Calendar size={14} /> Terakhir diperbarui: Hari ini, 08:30
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3.5 bg-slate-100 text-slate-600 rounded-[1.2rem] font-black text-sm hover:bg-slate-200 transition-all active:scale-95 uppercase tracking-widest">
            Cetak Laporan
          </button>
          <button className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-[1.2rem] font-black text-sm shadow-xl shadow-blue-100 hover:scale-[1.02] transition-all active:scale-95 uppercase tracking-widest">
            Kelola Siswa
          </button>
        </div>
      </section>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
           <div className="w-40 h-40 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center text-6xl font-black shadow-2xl relative z-10 shrink-0">
             {id?.split('-')[0] || "10"}
             <span className="text-2xl opacity-50 ml-1">-{id?.split('-')[1] || "1"}</span>
           </div>
           
           <div className="space-y-6 relative z-10 w-full">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Informasi Rombel</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Wali Kelas</p>
                    <p className="text-lg font-black text-slate-800">Guru Wali {id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tingkat Pendidikan</p>
                    <p className="text-lg font-black text-slate-800">Kelas {id?.split('-')[0] || "10"}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 grid grid-cols-3 gap-4">
                 {[
                   { label: "Kehadiran", val: "94%", icon: UserCheck, color: "text-emerald-500" },
                   { label: "Rerata Nilai", val: "84.5", icon: TrendingUp, color: "text-blue-500" },
                   { label: "Tugas Selesai", val: "12/15", icon: BookOpen, color: "text-amber-500" },
                 ].map((stat, i) => (
                   <div key={i}>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                       <stat.icon size={12} className={stat.color} /> {stat.label}
                     </p>
                     <p className="text-xl font-black text-slate-900">{stat.val}</p>
                   </div>
                 ))}
              </div>
           </div>

           {/* Background Decoration */}
           <div className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12">
             <School size={240} />
           </div>
        </div>

        <div className="bg-blue-600 rounded-[3rem] shadow-2xl shadow-blue-200 p-8 text-white flex flex-col justify-between relative overflow-hidden group">
           <div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                 <Users size={28} />
              </div>
              <h3 className="text-xl font-black tracking-tight mb-2">Populasi Siswa</h3>
              <p className="text-blue-100 text-sm font-medium leading-relaxed">Saat ini terdapat 32 siswa terdaftar secara resmi di kelas ini.</p>
           </div>

           <div className="mt-8 flex items-end justify-between">
              <div>
                 <p className="text-5xl font-black tracking-tighter">32</p>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Penuh 80% Kapasitas</p>
              </div>
              <button className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                 <ArrowUpRight size={24} />
              </button>
           </div>
           
           <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>
      </div>

      {/* Roster Preview / Empty State placeholder */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-12 text-center space-y-4">
         <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <Users size={40} />
         </div>
         <div>
            <h4 className="text-xl font-black text-slate-900">Daftar Siswa Belum Diunggah</h4>
            <p className="text-slate-500 font-medium max-w-sm mx-auto">Sinkronkan data siswa dari basis data pusat DAPODIK untuk mulai mengelola rombel ini.</p>
         </div>
         <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-200">
            Sinkronisasi Data Sekarang
         </button>
      </div>

    </div>
  );
}
