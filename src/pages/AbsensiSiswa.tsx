import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Save,
  ArrowLeft,
  LayoutGrid,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Profile } from "../types";
import { MOCK_PROFILE, MOCK_SISWA_LIST } from "../constants";
import { supabase } from "../lib/supabase";

type AttendanceStatus = "HADIR" | "IZIN" | "SAKIT" | "ALPA";

interface StudentAttendance {
  id: string;
  nama_lengkap: string;
  kelas: string;
  status: AttendanceStatus;
}

export default function AbsensiSiswa() {
  const navigate = useNavigate();
  const [user, setUser] = useState<Profile>(() => {
    const saved = localStorage.getItem("lentera_user");
    return saved ? JSON.parse(saved) : MOCK_PROFILE;
  });

  const [selectedClass, setSelectedClass] = useState("12 IPA 1");
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceData, setAttendanceData] = useState<StudentAttendance[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const classes = ["12 IPA 1", "12 IPA 2", "12 IPS 1", "12 IPS 2"];

  useEffect(() => {
    // Load initial data for the selected class
    // In real app, fetch from Supabase table 'data_siswa'
    const filtered = MOCK_SISWA_LIST
      .filter(s => s.kelas === selectedClass)
      .map(s => ({
        id: s.id,
        nama_lengkap: s.nama,
        kelas: s.kelas,
        status: "HADIR" as AttendanceStatus
      }));
    setAttendanceData(filtered);
  }, [selectedClass]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => 
      prev.map(s => s.id === studentId ? { ...s, status } : s)
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Simulate saving to Supabase
      // const { error } = await supabase.from('absensi').insert(
      //   attendanceData.map(s => ({
      //     siswa_id: s.id,
      //     guru_id: user.id,
      //     tanggal: new Date().toISOString().split('T')[0],
      //     status: s.status,
      //     kelas: s.kelas
      //   }))
      // );

      // Mock success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage({ type: "success", text: "Data absensi berhasil disimpan!" });
      setTimeout(() => navigate("/app/rekap/guru"), 2000);
    } catch (err) {
      setMessage({ type: "error", text: "Terjadi kesalahan saat menyimpan data." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = attendanceData.filter(s => 
    s.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-400 hover:text-blue-600 text-sm font-bold mb-2 transition-colors cursor-pointer" onClick={() => navigate("/")}>
            <ArrowLeft size={16} /> Dashboard
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Presensi Kehadiran Siswa</h2>
          <p className="text-slate-500 mt-1">Kelola kehadiran harian untuk kelas yang Anda ampu.</p>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => navigate("/app/rekap/guru")}
             className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
           >
             Riwayat Recap
           </button>
           <button 
             onClick={() => navigate("/app/rekap/siswa")}
             className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
           >
             Lihat Progress Siswa
           </button>
        </div>
      </section>

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-wrap items-center gap-6">
        <div className="flex-1 min-w-[240px]">
           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Cari Nama Siswa</label>
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Masukkan nama siswa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
              />
           </div>
        </div>

        <div className="min-w-[200px]">
           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Pilih Unit/Kelas</label>
           <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
             {classes.map(c => (
               <button 
                 key={c}
                 onClick={() => setSelectedClass(c)}
                 className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                   selectedClass === c ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                 }`}
               >
                 {c}
               </button>
             ))}
           </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Daftar Siswa {selectedClass}</h3>
            <p className="text-xs font-bold text-slate-400 mt-0.5">{filteredStudents.length} Siswa Terdaftar</p>
          </div>
          <div className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2">
             <Clock size={14} />
             {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th className="px-8 py-4">Siswa</th>
                <th className="px-8 py-4 text-center">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                        {student.nama_lengkap[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{student.nama_lengkap}</p>
                        <p className="text-[10px] font-bold text-slate-400">NISN: {student.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-3">
                      {(["HADIR", "IZIN", "SAKIT", "ALPA"] as AttendanceStatus[]).map((status) => (
                        <label 
                          key={status}
                          className={`
                            flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all border-2
                            ${student.status === status 
                              ? status === "HADIR" ? "bg-green-50 border-green-500 text-green-600" :
                                status === "IZIN" ? "bg-blue-50 border-blue-500 text-blue-600" :
                                status === "SAKIT" ? "bg-amber-50 border-amber-500 text-amber-600" :
                                "bg-red-50 border-red-500 text-red-600"
                              : "bg-white border-transparent text-slate-400 hover:border-slate-200"}
                          `}
                        >
                          <input 
                            type="radio"
                            name={`status-${student.id}`}
                            className="hidden"
                            checked={student.status === status}
                            onChange={() => handleStatusChange(student.id, status)}
                          />
                          <span className="text-[10px] font-black uppercase tracking-tighter">{status}</span>
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="p-20 text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-200" size={32} />
             </div>
             <p className="text-slate-400 font-bold">Siswa tidak ditemukan</p>
          </div>
        )}
      </div>

      {/* Floating Submit Action */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-4"
      >
        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center justify-between gap-6">
           <div className="flex items-center gap-4 pl-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                 <CheckCircle size={20} />
              </div>
              <div>
                 <p className="text-white text-sm font-bold">Simpan Kehadiran Hari Ini</p>
                 <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{filteredStudents.length} Siswa Diverifikasi</p>
              </div>
           </div>
           <button 
             onClick={handleSubmit}
             disabled={isSubmitting}
             className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-3xl transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-900/40 disabled:opacity-50"
           >
             {isSubmitting ? "Menyimpan..." : "Posting Presensi"}
             <Save size={18} />
           </button>
        </div>
      </motion.div>

      {/* Overlay Status Messages */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
             <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center text-center max-w-sm">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${message.type === "success" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"}`}>
                   {message.type === "success" ? <CheckCircle size={40} /> : <XCircle size={40} />}
                </div>
                <h3 className="text-2xl font-black text-slate-800">{message.type === "success" ? "Berhasil!" : "Gagal!"}</h3>
                <p className="text-slate-500 mt-2">{message.text}</p>
                <div className="mt-8 flex items-center gap-2 text-slate-400 font-bold text-xs">
                   <Clock size={14} className="animate-spin" /> Mengalihkan Halaman...
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
