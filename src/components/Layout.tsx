import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, CheckSquare, MessageSquare, Menu, X, LogOut, ShieldCheck, UserCircle, Settings, Users, BarChart3, ClipboardList, Bell, Clock, Circle, School } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MOCK_PROFILE, MOCK_GURU } from "../constants";
import { Profile } from "../types";

interface Notification {
  id: string;
  text: string;
  time: string;
  type: "info" | "success" | "warning";
}

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", text: "Selamat pagi! Jangan lupa absen hari ini.", time: "07:30", type: "info" },
    { id: "2", text: "Tugas Matematika baru telah diposting.", time: "08:15", type: "warning" },
  ]);

  const [user, setUser] = useState<Profile>(() => {
    const saved = localStorage.getItem("lentera_user");
    return saved ? JSON.parse(saved) : MOCK_PROFILE;
  });

  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate real-time notifications
    const randomNotes = [
      "Budi baru saja mengunggah tugas.",
      "Siti sedang online di Tanya AI.",
      "Materi Fisika telah diperbarui.",
      "Pesan baru dari Guru Wali Kelas.",
      "Absensi kelas IPA 1 telah lengkap.",
    ];

    const notificationInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newNote: Notification = {
          id: Date.now().toString(),
          text: randomNotes[Math.floor(Math.random() * randomNotes.length)],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "info"
        };
        setNotifications(prev => [newNote, ...prev].slice(0, 5));
      }
    }, 15000);

    return () => clearInterval(notificationInterval);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("lentera_user");
      if (saved) setUser(JSON.parse(saved));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("profileUpdate", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profileUpdate", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("lentera_user", JSON.stringify(user));
  }, [user]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const handleLogout = () => {
    localStorage.removeItem("lentera_logged_in");
    localStorage.removeItem("lentera_user");
    window.location.href = "/login";
  };

  const sisNavItems = [
    { path: "/", name: "Beranda", icon: Home },
    { path: "/materi", name: "Eksplor Materi", icon: BookOpen },
    { path: "/tugas", name: "Tugas", icon: CheckSquare },
    { path: "/app/rekap/siswa", name: "Rekap Saya", icon: BarChart3 },
    { path: "/tanya-ai", name: "Tanya AI", icon: MessageSquare },
    { path: "/profil", name: "Profil Saya", icon: UserCircle },
  ];

  const guruNavItems = [
    { path: "/", name: "Dashboard Guru", icon: ShieldCheck },
    { path: "/app/absensi-siswa", name: "Absensi Siswa", icon: Users },
    { path: "/koreksi-tugas", name: "Koreksi Tugas", icon: CheckSquare },
    { path: "/manajemen-kelas", name: "Manajemen Kelas", icon: School },
    { path: "/administrasi", name: "Administrasi", icon: ClipboardList },
    { path: "/materi", name: "Kelola Materi", icon: Settings },
    { path: "/profil", name: "Profil Saya", icon: UserCircle },
  ];

  const adminNavItems = [
    { path: "/", name: "Panel Admin", icon: ShieldCheck },
    { path: "/app/absensi-siswa", name: "Absensi Siswa", icon: Users },
    { path: "/manajemen-kelas", name: "Manajemen Kelas", icon: School },
    { path: "/app/rekap/guru", name: "Rekap Guru", icon: BarChart3 },
    { path: "/kelola-pengguna", name: "Data Siswa", icon: Users },
    { path: "/materi", name: "Kelola Materi", icon: BookOpen },
    { path: "/tugas", name: "Kelola Tugas", icon: CheckSquare },
    { path: "/profil", name: "Profil Saya", icon: UserCircle },
  ];

  const getNavItems = () => {
    if (user.role === "ADMIN") return adminNavItems;
    if (user.role === "GURU") return guruNavItems;
    return sisNavItems;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-bottom border-slate-200 sticky top-0 z-50">
        <h1 className="text-xl font-bold text-blue-600 tracking-tight">Lentera</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400"><Bell size={20} /></button>
          <button 
            onClick={toggleSidebar}
            id="mobile-menu-toggle"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`
          fixed md:relative inset-y-0 left-0 z-50 w-72 bg-white border-right border-slate-200 
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-6 hidden md:block border-b border-slate-50">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-bold text-blue-600 tracking-tight">Lentera</h1>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 text-green-600 rounded-full">
              <Circle size={8} fill="currentColor" className="animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
            {user.role === "ADMIN" ? "Admin Control Panel" : user.role === "GURU" ? "Portal Guru" : "Ruang Siswa"}
          </p>
        </div>

        {/* Real-time Clock Widget */}
        <div className="mx-6 mt-6 p-4 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200">
           <div className="flex items-center gap-2 text-slate-400 mb-1">
             <Clock size={14} />
             <span className="text-[10px] font-bold uppercase tracking-tighter">Waktu Saat Ini</span>
           </div>
           <p className="text-2xl font-black tracking-widest tabular-nums">
             {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             <span className="text-blue-500 text-sm ml-1">:{(currentTime.getSeconds() < 10 ? "0" : "") + currentTime.getSeconds()}</span>
           </p>
           <p className="text-[10px] text-slate-500 font-bold mt-1">
             {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
           </p>
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-[1.02]" 
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"}
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Real-time Activity Feed Sidebar */}
        <div className="px-6 py-4 border-t border-slate-50">
           <div className="flex items-center justify-between mb-4">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aktivitas Real-time</h4>
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
             </span>
           </div>
           <div className="space-y-3">
             <AnimatePresence initial={false}>
               {notifications.map((note) => (
                 <motion.div 
                   key={note.id}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex gap-2 items-start"
                 >
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                   <div>
                     <p className="text-[11px] text-slate-700 leading-tight font-medium">{note.text}</p>
                     <p className="text-[9px] text-slate-400 mt-1 font-bold">{note.time}</p>
                   </div>
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex flex-col gap-4 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden border-2 border-white shadow-sm transition-transform hover:scale-110 active:scale-95 cursor-pointer" onClick={() => (window.location.href = "/profil")}>
                  <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-800 truncate max-w-[120px]">{user.nama_lengkap}</p>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                   <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest">{user.role}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-lg shadow-sm border border-slate-100"
              title="Keluar"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden relative">
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
