import { useState, useEffect } from "react";
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle, BarChart3, TrendingUp, Users, Printer, Loader2 } from "lucide-react";
import { MOCK_ABSENSI, MOCK_SISWA_LIST, MOCK_PROFILE } from "../constants";
import { Profile, AbsensiRecord } from "../types";
import { motion, AnimatePresence } from "motion/react";

export default function RekapAbsensi() {
  const [user] = useState<Profile>(() => {
    const saved = localStorage.getItem("lentera_user");
    return saved ? JSON.parse(saved) : MOCK_PROFILE;
  });

  const [isPrinting, setIsPrinting] = useState(false);
  const [showPrintSuccess, setShowPrintSuccess] = useState(false);
  
  // Filters for Guru
  const [filterKelas, setFilterKelas] = useState("Semua");
  const [filterTanggal, setFilterTanggal] = useState("");

  const isGuru = user.role === "GURU";

  const handlePrint = () => {
    setIsPrinting(true);
    // Simulate generation
    setTimeout(() => {
      setIsPrinting(false);
      setShowPrintSuccess(true);
      setTimeout(() => setShowPrintSuccess(false), 3000);
      window.print(); // Actual browser print
    }, 2000);
  };

  // Unique classes for filter
  const classes = ["Semua", ...new Set(MOCK_SISWA_LIST.map(s => s.kelas))];

  // Logic for Siswa: Individual History
  const myAttendance = MOCK_ABSENSI.filter(a => a.siswa_id === user.id);
  const hadirCount = myAttendance.filter(a => a.status === "HADIR").length;
  const totalDays = myAttendance.length || 1;
  const attendanceRate = ((hadirCount / totalDays) * 100).toFixed(1);

  // Logic for Guru: Class Overview & Filtering
  const filteredStudents = MOCK_SISWA_LIST.filter(s => filterKelas === "Semua" || s.kelas === filterKelas);
  
  const classAttendance = filteredStudents.map(s => {
    const sAtt = MOCK_ABSENSI.filter(a => a.siswa_id === s.id);
    const hCount = sAtt.filter(a => a.status === "HADIR").length;
    
    // Status on specific date if filtered
    let statusOnDate = null;
    if (filterTanggal) {
      statusOnDate = MOCK_ABSENSI.find(a => a.siswa_id === s.id && a.tanggal === filterTanggal)?.status || "ALPA";
    }

    return {
      ...s,
      hadir: hCount,
      total: sAtt.length,
      rate: sAtt.length > 0 ? ((hCount / sAtt.length) * 100).toFixed(0) : "0",
      statusOnDate
    };
  });

  // Dynamic Stats for Guru
  const avgRate = classAttendance.length > 0 
    ? (classAttendance.reduce((acc, curr) => acc + Number(curr.rate), 0) / classAttendance.length).toFixed(0)
    : "0";
  
  const totalStatusHadir = filterTanggal 
    ? classAttendance.filter(s => s.statusOnDate === "HADIR").length
    : classAttendance.reduce((acc, curr) => acc + curr.hadir, 0);

  return (
    <div className="space-y-8 print:p-0">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            {isGuru ? "Rekap Kehadiran Siswa" : "Rekap Kehadiranku"}
          </h2>
          <p className="text-slate-500 mt-1">
            {isGuru ? "Pantau tingkat keaktifan siswa di kelas." : "Pantau tingkat kehadiranmu selama semester ini."}
          </p>
        </div>
        <button 
          onClick={handlePrint}
          disabled={isPrinting}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
        >
          {isPrinting ? <Loader2 size={18} className="animate-spin" /> : <Printer size={18} />}
          Cetak Laporan
        </button>
      </section>

      {/* Guru Filters UI */}
      {isGuru && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 print:hidden">
           <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Pilih Kelas</label>
              <div className="flex gap-2">
                 {classes.map(c => (
                   <button 
                    key={c}
                    onClick={() => setFilterKelas(c)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      filterKelas === c ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                   >
                     {c}
                   </button>
                 ))}
              </div>
           </div>
           <div className="min-w-[200px]">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Filter Tanggal Tertentu</label>
              <input 
                type="date"
                value={filterTanggal}
                onChange={(e) => setFilterTanggal(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
              />
           </div>
           {filterTanggal && (
             <button 
                onClick={() => setFilterTanggal("")}
                className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Reset Tanggal"
             >
                <XCircle size={20} />
             </button>
           )}
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl w-fit mb-4 print:bg-white print:border print:border-slate-100">
            <TrendingUp size={24} />
          </div>
          <p className="text-2xl font-bold text-slate-800">{isGuru ? `${avgRate}%` : `${attendanceRate}%`}</p>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            {isGuru && filterKelas !== "Semua" ? `Rata-rata ${filterKelas}` : "Rata-rata Kehadiran"}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="p-3 bg-green-100 text-green-600 rounded-2xl w-fit mb-4 print:bg-white print:border print:border-slate-100">
            <CheckCircle size={24} />
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {isGuru ? totalStatusHadir : hadirCount}
          </p>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            {filterTanggal ? "Hadir pada Tanggal" : "Total Hari Hadir"}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl w-fit mb-4 print:bg-white print:border print:border-slate-100">
            <Users size={24} />
          </div>
          <p className="text-2xl font-bold text-slate-800">{isGuru ? classAttendance.length : "0"}</p>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            {isGuru ? (filterKelas === "Semua" ? "Total Semua Siswa" : `Siswa di ${filterKelas}`) : "Izin/Sakit"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:border-none">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between print:bg-white">
           <h3 className="font-bold text-slate-800">
             {isGuru ? `Daftar Siswa ${filterKelas !== "Semua" ? `- ${filterKelas}` : ""}` : "Riwayat Harian"}
             {filterTanggal && <span className="ml-2 text-blue-600">({new Date(filterTanggal).toLocaleDateString('id-ID')})</span>}
           </h3>
           <span className="hidden print:block text-xs text-slate-400 font-bold">Lentera Educare - {new Date().toLocaleDateString()}</span>
        </div>

        {isGuru ? (
           <div className="overflow-x-auto">
             <table className="w-full">
               <thead>
                 <tr className="bg-slate-50 text-left border-b border-slate-100 print:bg-white">
                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Siswa</th>
                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Kelas</th>
                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">
                     {filterTanggal ? "Status" : "Persentase"}
                   </th>
                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right print:hidden">Aksi</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {classAttendance.map((s, i) => (
                   <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                     <td className="px-6 py-4">
                       <p className="font-bold text-slate-800">{s.nama}</p>
                       <p className="text-xs text-slate-400">NIS: {s.nis}</p>
                     </td>
                     <td className="px-6 py-4 text-sm font-medium text-slate-600">{s.kelas}</td>
                     <td className="px-6 py-4">
                        {filterTanggal ? (
                          <div className="flex justify-center">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${
                              s.statusOnDate === "HADIR" ? "bg-green-100 text-green-600" :
                              s.statusOnDate === "IZIN" ? "bg-blue-100 text-blue-600" :
                              s.statusOnDate === "SAKIT" ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600"
                            }`}>
                              {s.statusOnDate}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-3">
                             <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[100px] print:hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${s.rate}%` }}
                                  className={`h-full ${Number(s.rate) > 80 ? "bg-green-500" : "bg-amber-500"}`}
                                />
                             </div>
                             <span className="text-sm font-bold text-slate-800">{s.rate}%</span>
                          </div>
                        )}
                     </td>
                     <td className="px-6 py-4 text-right print:hidden">
                       <button className="text-blue-600 text-xs font-bold hover:underline">Detail</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {myAttendance.length > 0 ? (
              myAttendance.map((a, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        a.status === "HADIR" ? "bg-green-50 text-green-500" : 
                        a.status === "IZIN" ? "bg-blue-50 text-blue-500" : "bg-red-50 text-red-500"
                      } print:bg-white print:border print:border-slate-100`}>
                         <Calendar size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">Pembelajaran Rutin</h4>
                        <p className="text-xs text-slate-400 font-medium">{new Date(a.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                   </div>
                   <div className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                     a.status === "HADIR" ? "bg-green-100 text-green-600" : 
                     a.status === "IZIN" ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"
                   } print:bg-white print:border print:border-slate-100`}>
                     {a.status}
                   </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center text-slate-400">
                <p>Belum ada data kehadiran.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showPrintSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-800 text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-4 font-bold border border-slate-700"
          >
             <CheckCircle className="text-green-400" size={24} />
             Laporan PDF sedang diproses browser...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
