import { BookOpen, CheckSquare, Clock, GraduationCap, Users, FileText, TrendingUp, Zap, Circle, ShieldCheck, MessageSquare, Calendar, FileImage, Bell, Quote, Download } from "lucide-react";
import { MOCK_TUGAS, MOCK_PROFILE } from "../constants";
import { motion, AnimatePresence } from "motion/react";
import { Profile } from "../types";
import { useState, useEffect } from "react";
import PengajuanIzinModal from "../components/PengajuanIzinModal";
import { getDailyQuote } from "../services/geminiService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ATTENDANCE_DATA = [
  { day: 'Sen', hours: 6, status: 'Hadir' },
  { day: 'Sel', hours: 7, status: 'Hadir' },
  { day: 'Rab', hours: 5, status: 'Hadir' },
  { day: 'Kam', hours: 8, status: 'Hadir' },
  { day: 'Jum', hours: 4, status: 'Izin' },
  { day: 'Sab', hours: 6, status: 'Hadir' },
  { day: 'Min', hours: 0, status: 'Libur' },
];

export default function Home() {
  const [user, setUser] = useState<Profile>(() => {
    const saved = localStorage.getItem("lentera_user");
    return saved ? JSON.parse(saved) : MOCK_PROFILE;
  });

  const exportAttendanceCSV = () => {
    const headers = ["Hari", "Jam Belajar", "Status"];
    const rows = ATTENDANCE_DATA.map(d => [d.day, d.hours, d.status].join(","));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kehadiran_${user.nama_lengkap.replace(/\s+/g, '_')}_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [liveActivities, setLiveActivities] = useState([
    { id: 1, user: "Andi Saputra", action: "mengumpulkan tugas Matematika", time: "Baru saja", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andi" },
    { id: 2, user: "Siti Aminah", action: "online di Tanya AI", time: "2 menit yang lalu", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti" },
    { id: 3, user: "Budi Cahyo", action: "menyelesaikan kuis Kimia", time: "15 menit yang lalu", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi" },
  ]);

  const [hasAttendedToday, setHasAttendedToday] = useState(false);
  const [isIzinModalOpen, setIsIzinModalOpen] = useState(false);
  const [pendingIzin, setPendingIzin] = useState<any[]>([]);
  const [dailyQuote, setDailyQuote] = useState("");
  const [isQuoteLoading, setIsQuoteLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      if (user.role !== "SISWA") return;
      
      const isDiligent = MOCK_TUGAS.filter(t => t.status).length >= 2;
      // Simulate "late" if they haven't attended yet and it's past 8 AM (for demo purposes)
      const now = new Date();
      const isOftenLate = now.getHours() >= 8 && !hasAttendedToday;

      try {
        const quote = await getDailyQuote(isDiligent, isOftenLate);
        setDailyQuote(quote);
      } catch (err) {
        console.error("Fetch quote error:", err);
      } finally {
        setIsQuoteLoading(false);
      }
    };

    fetchQuote();
  }, [user.role, user.id, hasAttendedToday]);

  useEffect(() => {
    const loadPendingIzin = () => {
      const data = localStorage.getItem("pending_izin");
      if (data) setPendingIzin(JSON.parse(data));
    };

    if (user.role === "ADMIN") {
      loadPendingIzin();
      window.addEventListener("newPermissionRequest", loadPendingIzin);
    }

    return () => window.removeEventListener("newPermissionRequest", loadPendingIzin);
  }, [user.role]);

  useEffect(() => {
    const checkStatus = localStorage.getItem(`absensi_${user.id}_${new Date().toLocaleDateString()}`);
    if (checkStatus) {
      setHasAttendedToday(true);
    }

    const handleAttendanceUpdate = () => {
      const updatedStatus = localStorage.getItem(`absensi_${user.id}_${new Date().toLocaleDateString()}`);
      if (updatedStatus) setHasAttendedToday(true);
    };

    window.addEventListener("attendanceUpdate", handleAttendanceUpdate);
    return () => window.removeEventListener("attendanceUpdate", handleAttendanceUpdate);
  }, [user.id]);

  useEffect(() => {
    const names = ["Zaky", "Maya", "Felix", "Anya", "Rizky", "Putri", "Dandi"];
    const actions = [
      "baru saja masuk ke kelas",
      "menyelesaikan materi Sejarah",
      "bertanya ke AI Tutor",
      "mengumpulkan tugas Seni Budaya",
      "mendapatkan poin tambahan",
      "sedang membaca e-book Biologi"
    ];

    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        user: names[Math.floor(Math.random() * names.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        time: "Baru saja",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
      };
      setLiveActivities(prev => [newActivity, ...prev].slice(0, 5));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const tugasMendatang = MOCK_TUGAS.filter(t => !t.status);
  const tugasSelesai = MOCK_TUGAS.filter(t => t.status).length;

  if (user.role === "ADMIN") {
    return (
      <div className="space-y-8">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">System Administration</h2>
            <p className="text-slate-500 mt-1">Kelola seluruh ekosistem Lentera dalam satu panel kendali.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full w-fit">
            <ShieldCheck size={14} className="text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-widest">Admin Mode</span>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Pengguna", value: "156", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Umpan Balik AI", value: "1.2k", icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Stabilitas Sistem", value: "99.9%", icon: Circle, color: "text-green-600", bg: "bg-green-50" },
            { label: "Storage", value: "4.2GB", icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
            >
              <div className={`p-3 rounded-2xl ${item.bg} ${item.color} w-fit mb-4`}>
                <item.icon size={24} />
              </div>
              <p className="text-2xl font-black text-slate-800">{item.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{item.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Bell size={20} className="text-blue-600" />
                    Notifikasi Pengajuan Izin
                 </div>
                 {pendingIzin.length > 0 && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                       {pendingIzin.length} Permintaan Baru
                    </span>
                 )}
              </h3>
              <div className="space-y-4">
                 {pendingIzin.length > 0 ? (
                    pendingIzin.map((u, i) => (
                       <div key={u.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all group">
                          <div className="flex items-center justify-between mb-3">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold group-hover:scale-110 transition-transform">
                                   {u.user_name[0]}
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-slate-800">{u.user_name}</p>
                                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{u.jenis_izin} - {u.tanggal_pengajuan}</p>
                                </div>
                             </div>
                             <span className="px-3 py-1 bg-amber-500 text-white text-[9px] font-black rounded-lg uppercase tracking-widest">
                                PENDING
                             </span>
                          </div>
                          <p className="text-xs text-slate-600 mb-4 px-1 leading-relaxed">
                             "{u.alasan}"
                          </p>
                          <div className="flex items-center gap-2">
                             <a 
                                href={u.bukti_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-center text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all uppercase tracking-widest"
                             >
                                Lihat Bukti Gambar
                             </a>
                             <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                                Update Status
                             </button>
                          </div>
                       </div>
                    ))
                 ) : (
                    <div className="py-12 text-center">
                       <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Bell size={24} className="text-slate-200" />
                       </div>
                       <p className="text-slate-400 font-bold text-sm italic">Belum ada pengajuan izin masuk.</p>
                    </div>
                 )}
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <Users size={20} className="text-blue-600" />
                 Registrasi Pengguna Baru
              </h3>
              <div className="space-y-4">
                 {[
                    { name: "Doni Pratama", email: "doni@school.id", role: "SISWA", time: "Baru saja" },
                    { name: "Ibu Rahma", email: "rahma@school.id", role: "GURU", time: "10 menit lalu" },
                    { name: "Eko Susanto", email: "eko@school.id", role: "SISWA", time: "1 jam lalu" },
                 ].map((u, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                             {u.name[0]}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-800">{u.name}</p>
                             <p className="text-[10px] text-slate-500 font-medium">{u.email}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${u.role === "GURU" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>
                             {u.role}
                          </span>
                          <p className="text-[9px] text-slate-400 font-bold mt-1">{u.time}</p>
                       </div>
                    </div>
                 ))}
                 <button className="w-full py-4 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors rounded-2xl border-2 border-dashed border-slate-200 mt-2">
                    Lihat Seluruh Database User
                 </button>
              </div>
           </div>

           <div className="bg-slate-900 p-8 rounded-[2rem] text-white overflow-hidden relative group">
              <div className="relative z-10">
                 <h3 className="text-2xl font-bold mb-2">Logs Keamanan</h3>
                 <p className="text-slate-400 text-sm mb-8">Pemantauan RLS and Auth event secara real-time.</p>
                 <div className="space-y-3 font-mono text-[10px]">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-green-400">
                       [10:32:01] Auth Trigger: handle_new_user() executed successfully. Role assigned: SISWA
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-blue-400">
                       [10:30:15] RLS Policy: "Admins can view all profiles" granted for user_id: {user.id.slice(0,8)}...
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-amber-400">
                       [10:28:44] System: Cron check for storage limits completed.
                    </div>
                 </div>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                 <ShieldCheck size={120} />
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (user.role === "GURU") {
    return (
      <div className="space-y-8">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Selamat Datang, {user.nama_lengkap}! 🍎</h2>
            <p className="text-slate-500 mt-1">Pantau perkembangan siswa dan kelola kelas Anda dalam waktu nyata.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full w-fit">
            <Circle size={8} fill="currentColor" className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">Sistem Online & Stabil</span>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Siswa", value: "42", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
            { label: "Tugas Masuk", value: "18", icon: FileText, color: "text-amber-600", bg: "bg-amber-100" },
            { label: "Kehadiran Hari Ini", value: "95%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
            { label: "Materi Aktif", value: "8", icon: BookOpen, color: "text-purple-600", bg: "bg-purple-100" },
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
            >
                <div className={`p-3 rounded-xl ${item.bg} ${item.color} w-fit mb-4`}>
                <item.icon size={24} />
              </div>
              <p className="text-2xl font-bold text-slate-800">{item.value}</p>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{item.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Zap size={20} className="text-blue-600" />
                  Aktivitas Terbaru Kelas (Real-time)
                </h3>
                <span className="text-[10px] font-bold text-blue-600 px-2 py-1 bg-blue-50 rounded-lg">Auto-refresh aktif</span>
              </div>
              
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {liveActivities.map((act) => (
                      <motion.div 
                        key={act.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center gap-4 group p-2 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 group-hover:scale-110 transition-transform">
                             <img src={act.avatar} alt={act.user} className="w-full h-full object-cover" />
                          </div>
                          <div>
                              <p className="text-sm text-slate-800"><span className="font-extrabold">{act.user}</span> {act.action}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{act.time}</p>
                          </div>
                      </motion.div>
                  ))}
                </AnimatePresence>
              </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl flex flex-col justify-between">
             <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                   <TrendingUp size={24} />
                </div>
                <h4 className="text-2xl font-bold leading-tight">Ringkasan Efektivitas Belajar</h4>
                <p className="text-slate-400 text-sm">Minggu ini, tingkat kehadiran siswa naik 5.2% dibanding minggu sebelumnya.</p>
             </div>
             <div className="mt-8 pt-8 border-t border-slate-800">
                <button className="w-full py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-blue-50 transition-all active:scale-95">
                   Lihat Laporan Detail
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Halo, {user.nama_lengkap}! 👋</h2>
          <p className="text-slate-500 mt-1">Siap untuk belajar hal baru hari ini?</p>
          
          <button 
            onClick={() => setIsIzinModalOpen(true)}
            className="mt-4 px-6 py-3 bg-white border-2 border-dashed border-blue-200 text-blue-600 rounded-2xl text-xs font-bold hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center gap-2"
          >
             <FileImage size={16} /> Pengajuan Izin / Sakit
          </button>
        </div>
        <div className="flex items-center gap-3 bg-blue-50 p-2 pr-4 rounded-2xl">
           <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
             <Zap size={20} className="animate-pulse" />
           </div>
           <div>
             <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none mb-1">Status Belajar</p>
             <p className="text-sm font-black text-blue-600 uppercase leading-none tracking-tighter">Aktif & Real-time</p>
           </div>
        </div>
      </section>

      {/* Daily Quote AI Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center ring-1 ring-white/30 group-hover:rotate-12 transition-transform">
              <Quote size={28} className="text-yellow-300" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-black tracking-tight">Kutipan Harian AI</h3>
              <span className="px-2 py-0.5 bg-white/10 rounded-md text-[8px] font-black uppercase tracking-widest border border-white/20">Generated by Gemini</span>
            </div>
            
            {isQuoteLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-white/20 rounded-full w-3/4"></div>
                <div className="h-4 bg-white/20 rounded-full w-1/2"></div>
              </div>
            ) : (
              <p className="text-xl font-medium leading-relaxed italic">
                "{dailyQuote}"
              </p>
            )}
          </div>
        </div>
        
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
          <GraduationCap size={160} />
        </div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Tugas Selesai", value: tugasSelesai, icon: CheckSquare, color: "text-green-600", bg: "bg-green-100" },
          { 
            label: "Kehadiran", 
            value: "98%", 
            icon: Calendar, 
            color: "text-blue-600", 
            bg: "bg-blue-100",
            path: "/absensi",
            subValue: "Status: Hadir ✨"
          },
          { label: "Poin Belajar", value: "450", icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Waktu Belajar", value: "24j", icon: Clock, color: "text-purple-600", bg: "bg-purple-100", subValue: "Minggu ini" },
        ].map((item, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => item.path && (window.location.href = item.path)}
            className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 relative group ${item.path ? "cursor-pointer" : ""}`}
          >
            <div className={`p-3 rounded-2xl ${item.bg} ${item.color} w-fit mb-4 group-hover:scale-110 transition-transform`}>
              <item.icon size={24} />
            </div>
            <p className={`text-2xl font-black text-slate-800 ${item.path && !hasAttendedToday ? "animate-pulse" : ""}`}>{item.value}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">{item.label}</p>
            {item.subValue && <p className="text-[9px] font-bold text-slate-400 mt-2 italic">{item.subValue}</p>}
            {item.path && !hasAttendedToday && (
               <div className="absolute top-4 right-4 flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
               </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div id="attendance-details" className="lg:col-span-2 space-y-4">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-600" />
                  Status Kehadiran Mingguan
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Estimasi Jam Belajar Mandiri</p>
              </div>
              <button 
                onClick={exportAttendanceCSV}
                className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl transition-all flex items-center gap-2 text-xs font-bold ring-1 ring-slate-100"
              >
                <Download size={14} /> Export CSV
              </button>
            </div>

            <div className="h-[250px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ATTENDANCE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 outline-none">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{payload[0].payload.day}</p>
                            <p className="text-sm font-black text-blue-600">{payload[0].value} Jam Belajar</p>
                            <p className="text-[10px] font-bold text-slate-500 italic mt-1">Status: {payload[0].payload.status}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="hours" radius={[8, 8, 8, 8]} barSize={40}>
                    {ATTENDANCE_DATA.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.status === 'Hadir' ? '#3b82f6' : entry.status === 'Izin' ? '#f59e0b' : '#e2e8f0'} 
                        fillOpacity={0.8}
                        className="hover:fill-opacity-100 transition-all cursor-pointer"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] -translate-y-4 translate-x-4">
              <TrendingUp size={200} />
            </div>
          </div>

          <div id="upcoming-tasks" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">Tugas Mendatang</h3>
            <button className="text-sm font-semibold text-blue-600 hover:underline">Lihat Semua</button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <AnimatePresence mode="popLayout">
              {tugasMendatang.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {tugasMendatang.map((t) => (
                     <motion.div 
                        key={t.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                     >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <CheckSquare size={18} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">{t.judul}</h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock size={12} /> Deadline: {t.deadline}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => (window.location.href = "/tugas")}
                        className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        Kerjakan
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400">
                  <p>Tidak ada tugas mendatang. Santai dulu yuk!</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
             <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                   <Circle size={8} fill="#3b82f6" className="animate-pulse" />
                   Aktivitas Teman
                </h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Live</span>
             </div>
             <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {liveActivities.slice(0, 4).map((act) => (
                    <motion.div 
                      key={act.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex gap-3"
                    >
                       <img src={act.avatar} className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 shrink-0" alt="" />
                       <div>
                          <p className="text-[11px] text-slate-700 leading-tight">
                             <span className="font-bold">{act.user}</span> {act.action}
                          </p>
                          <p className="text-[9px] text-blue-500 font-bold mt-0.5 uppercase">{act.time}</p>
                       </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>
          </div>

          <div id="ai-quick-tip" className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
             <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 ring-1 ring-white/30 group-hover:rotate-12 transition-transform">
                  <GraduationCap size={20} />
                </div>
                <h4 className="text-lg font-bold tracking-tight">Butuh Bantuan AI?</h4>
                <p className="text-blue-100 text-xs mt-1 leading-relaxed opacity-90">
                  Tanya Tutor AI untuk penjelasan materi yang sulit dipahami secara real-time!
                </p>
                <button 
                  onClick={() => (window.location.href = "/tanya-ai")}
                  className="mt-6 w-full py-3 bg-white text-blue-600 rounded-xl text-sm font-bold shadow-lg hover:bg-blue-50 transition-all active:scale-95"
                >
                  Coba Sekarang
                </button>
             </div>
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
             <div className="absolute right-8 top-0 w-12 h-12 bg-white/10 rounded-full blur-xl animate-pulse" />
          </div>
        </div>
      </div>
      <PengajuanIzinModal 
        isOpen={isIzinModalOpen}
        onClose={() => setIsIzinModalOpen(false)}
        userId={user.id}
        userName={user.nama_lengkap}
      />
    </div>
  );
}
