import React, { useState, useEffect } from "react";
import { Users, Save, CheckCircle, AlertCircle, Calendar as CalendarIcon, ArrowLeft, Loader2, BarChart3 } from "lucide-react";
import { MOCK_SISWA_LIST, MOCK_GURU, MOCK_PROFILE } from "../constants";
import { Profile, Siswa } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function Absensi() {
  const navigate = useNavigate();
  const [currentUser] = useState<Profile>(() => {
    const saved = localStorage.getItem("lentera_user");
    return saved ? JSON.parse(saved) : MOCK_PROFILE;
  });

  const [selectedClass, setSelectedClass] = useState("12 IPA 1");
  const [students, setStudents] = useState<Siswa[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasAttendedToday, setHasAttendedToday] = useState(false);

  const classes = [...new Set(MOCK_SISWA_LIST.map(s => s.kelas))];

  useEffect(() => {
    const checkStatus = localStorage.getItem(`absensi_${currentUser.id}_${new Date().toLocaleDateString()}`);
    if (checkStatus) {
      setHasAttendedToday(true);
    }
  }, [currentUser.id]);

  useEffect(() => {
    const filtered = MOCK_SISWA_LIST.filter(s => s.kelas === selectedClass);
    setStudents(filtered);
    
    // Initialize attendance with 'HADIR'
    const initial: Record<string, string> = {};
    filtered.forEach(s => {
      initial[s.id] = "HADIR";
    });
    setAttendance(initial);
  }, [selectedClass]);

  const handleStudentCheckIn = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      localStorage.setItem(`absensi_${currentUser.id}_${new Date().toLocaleDateString()}`, "HADIR");
      setHasAttendedToday(true);
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Dispatch event to update other components if needed
      window.dispatchEvent(new CustomEvent("attendanceUpdate"));
    }, 1500);
  };

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to Supabase/Backend
    setTimeout(() => {
      console.log("Absensi dikirim:", {
        guru_id: currentUser.id,
        tanggal: new Date().toISOString(),
        data: attendance
      });
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const isGuru = currentUser.role === "GURU";

  if (currentUser.role === "SISWA") {
    return (
      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-2 text-slate-400 hover:text-blue-600 text-sm font-bold mb-2 transition-colors cursor-pointer" onClick={() => navigate("/")}>
            <ArrowLeft size={16} /> Kembali
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Presensi Mandiri</h2>
          <p className="text-slate-500 mt-1">Lakukan absen harian secara mandiri sebelum memulai pembelajaran.</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${hasAttendedToday ? "bg-green-50 border-green-200" : "bg-white border-slate-100 shadow-xl shadow-slate-200/50"}`}>
              <div className="flex items-center justify-between mb-8">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${hasAttendedToday ? "bg-green-500 text-white" : "bg-blue-600 text-white"}`}>
                    <CalendarIcon size={28} />
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Tanggal Hari Ini</p>
                    <p className="font-bold text-slate-800">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                 </div>
              </div>

              <div className="space-y-6">
                <div>
                   <h3 className="text-2xl font-black text-slate-800 leading-tight">
                     {hasAttendedToday ? "Kamu Sudah Absen! ✨" : "Waktunya Absen, Jangan Sampai Lupa!"}
                   </h3>
                   <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                     {hasAttendedToday 
                        ? "Terima kasih sudah melakukan presensi tepat waktu. Selamat belajar dan semoga harimu menyenangkan!" 
                        : "Pastikan kamu sudah berada di lingkungan sekolah atau siap memulai sesi belajar daring sebelum melakukan check-in."}
                   </p>
                </div>

                {hasAttendedToday ? (
                   <div className="flex items-center gap-3 p-4 bg-white border border-green-100 rounded-2xl">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                         <CheckCircle size={20} />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Status Kehadiran</p>
                         <p className="text-sm font-black text-green-600 uppercase">Hadir - Sesuai Jadwal</p>
                      </div>
                   </div>
                ) : (
                   <button 
                     onClick={handleStudentCheckIn}
                     disabled={isSubmitting}
                     className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                   >
                     {isSubmitting ? (
                        <Loader2 className="animate-spin" size={24} />
                     ) : (
                        <>
                           <span>Check-in Sekarang</span>
                           <CheckCircle size={20} className="group-hover:scale-125 transition-transform" />
                        </>
                     )}
                   </button>
                )}
              </div>
           </div>

           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10">
                 <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <AlertCircle size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Tips Kehadiran</span>
                 </div>
                 <h4 className="text-xl font-bold leading-tight mb-4">Kenapa Absensi Itu Penting?</h4>
                 <div className="space-y-4">
                    <div className="flex gap-3">
                       <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-blue-400 font-bold text-xs italic">1</div>
                       <p className="text-sm text-slate-400">Membangun disiplin dan kebiasaan belajar yang konsisten setiap kalinya.</p>
                    </div>
                    <div className="flex gap-3">
                       <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-blue-400 font-bold text-xs italic">2</div>
                       <p className="text-sm text-slate-400">Menyinkronkan data poin belajarmu untuk sistem peringkat (Leaderboard).</p>
                    </div>
                 </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Streak Kehadiran</p>
                    <p className="text-2xl font-black text-blue-400">12 Hari 🔥</p>
                 </div>
                 <BarChart3 className="text-white/5 absolute -right-4 -bottom-4 w-32 h-32" />
              </div>
           </div>
        </div>

        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            >
               <motion.div 
                 initial={{ y: 20 }}
                 animate={{ y: 0 }}
                 className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center text-center max-w-sm"
               >
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                     <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800">Check-in Berhasil!</h3>
                  <p className="text-slate-500 mt-2">Data kehadiranmu sudah tercatat di sistem real-time kami.</p>
                  <button 
                    onClick={() => setShowSuccess(false)}
                    className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors"
                  >
                    Lanjutkan Belajar
                  </button>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (currentUser.role !== "GURU" && currentUser.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Akses Dibatalkan</h2>
        <p className="text-slate-500 mt-2">Halaman ini hanya dapat diakses oleh Guru atau Admin.</p>
        <button 
          onClick={() => navigate("/")}
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 text-sm font-bold mb-2 transition-colors"
          >
            <ArrowLeft size={16} /> Kembali
          </button>
          <h2 className="text-3xl font-bold text-slate-800">Absensi Siswa</h2>
          <p className="text-slate-500 mt-1">Lakukan absensi harian untuk setiap kelas.</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 border border-slate-200 rounded-2xl">
           <CalendarIcon className="text-blue-600 ml-2" size={20} />
           <span className="text-sm font-bold text-slate-700 pr-4 border-r border-slate-100">
             {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
           </span>
           <select 
             value={selectedClass}
             onChange={(e) => setSelectedClass(e.target.value)}
             className="bg-transparent text-sm font-bold text-blue-600 outline-none px-2 cursor-pointer"
           >
             {classes.map(c => <option key={c} value={c}>{c}</option>)}
           </select>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Users size={20} />
             </div>
             <div>
                <h3 className="font-bold text-slate-800">Daftar Siswa - {selectedClass}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{students.length} Total Siswa</p>
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">No</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Siswa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Hadir</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Izin</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Sakit</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Alpa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-400">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{s.nama}</p>
                    <p className="text-xs text-slate-400">NIS: {s.nis}</p>
                  </td>
                  {["HADIR", "IZIN", "SAKIT", "ALPA"].map((status) => (
                    <td key={status} className="px-6 py-4 text-center">
                      <label className="relative flex items-center justify-center cursor-pointer group">
                        <input 
                          type="radio" 
                          name={`status-${s.id}`}
                          value={status}
                          checked={attendance[s.id] === status}
                          onChange={() => handleStatusChange(s.id, status)}
                          className="sr-only"
                        />
                        <div className={`
                          w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center
                          ${attendance[s.id] === status 
                            ? (status === "HADIR" ? "bg-green-500 border-green-500" : 
                               status === "IZIN" ? "bg-blue-500 border-blue-500" : 
                               status === "SAKIT" ? "bg-amber-500 border-amber-500" : "bg-red-500 border-red-500") 
                            : "border-slate-200 group-hover:border-slate-300 bg-white"}
                        `}>
                           {attendance[s.id] === status && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </label>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-6">
              {[
                { label: "Hadir", color: "bg-green-500" },
                { label: "Izin", color: "bg-blue-500" },
                { label: "Sakit", color: "bg-amber-500" },
                { label: "Alpa", color: "bg-red-500" },
              ].map(indicator => (
                <div key={indicator.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${indicator.color}`} />
                  <span className="text-xs font-bold text-slate-500">{indicator.label}</span>
                </div>
              ))}
           </div>
           
           <button 
             type="submit"
             disabled={isSubmitting}
             className={`
               px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95
               ${isSubmitting ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700"}
             `}
           >
             {isSubmitting ? (
               <span className="flex items-center gap-2">
                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                   <Save size={18} />
                 </motion.div>
                 Menyimpan...
               </span>
             ) : (
               <>
                 <Save size={18} />
                 Simpan Absensi
               </>
             )}
           </button>
        </div>
      </form>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[100] bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
          >
             <CheckCircle size={24} />
             Berhasil menyimpan absensi hari ini!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
