import React from "react";
import { ArrowLeft, BarChart3, TrendingUp, Users, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RekapGuru() {
  const navigate = useNavigate();
  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center gap-2 text-slate-400 hover:text-blue-600 text-sm font-bold mb-2 transition-colors cursor-pointer" onClick={() => navigate("/")}>
          <ArrowLeft size={16} /> Kembali
        </div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Rekapitulasi Kehadiran (Guru)</h2>
        <p className="text-slate-500 mt-1">Laporan menyeluruh performa kehadiran siswa di kelas Anda.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl w-fit mb-4">
            <TrendingUp size={24} />
          </div>
          <p className="text-2xl font-black text-slate-800">94%</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Rata-rata Kelas</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="p-3 bg-green-100 text-green-600 rounded-2xl w-fit mb-4">
            <Users size={24} />
          </div>
          <p className="text-2xl font-black text-slate-800">32</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Siswa Aktif</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl w-fit mb-4">
            <Calendar size={24} />
          </div>
          <p className="text-2xl font-black text-slate-800">20/22</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Sesi Selesai</p>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm text-center">
         <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 size={40} />
         </div>
         <h3 className="text-xl font-bold text-slate-800">Visualisasi Data Grafik</h3>
         <p className="text-slate-400 mt-2 text-sm max-w-sm mx-auto tracking-wide">Grafik perkembangan harian akan tampil di sini untuk memudahkan pemantauan tren kehadiran.</p>
      </div>
    </div>
  );
}
