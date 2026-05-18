import { useState } from "react";
import { User, Mail, Hash, Book, Shield, Calendar, Award, MapPin, TrendingUp, Edit3, Save, X, Camera, Link as LinkIcon, RefreshCw } from "lucide-react";
import { MOCK_PROFILE } from "../constants";
import { Profile } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function Profil() {
  const navigate = useNavigate();
  const [user, setUser] = useState<Profile>(() => {
    const saved = localStorage.getItem("lentera_user");
    return saved ? JSON.parse(saved) : MOCK_PROFILE;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nama_lengkap: user.nama_lengkap,
    username: user.username,
    avatar_url: user.avatar_url,
    kelas: user.role === "SISWA" ? user.kelas : "",
    nisn: user.role === "SISWA" ? user.nisn : ""
  });

  const isSiswa = user.role === "SISWA";
  const isGuru = user.role === "GURU";

  const handleSave = () => {
    const updatedUser = { ...user, ...editForm };
    setUser(updatedUser);
    localStorage.setItem("lentera_user", JSON.stringify(updatedUser));
    setIsEditing(false);
    
    // Trigger sync across components
    window.dispatchEvent(new Event("profileUpdate"));
  };

  const handleCancel = () => {
    setEditForm({
      nama_lengkap: user.nama_lengkap,
      username: user.username,
      avatar_url: user.avatar_url,
      kelas: user.role === "SISWA" ? user.kelas : "",
      nisn: user.role === "SISWA" ? user.nisn : ""
    });
    setIsEditing(false);
  };

  const changeAvatar = () => {
    const seeds = ["Felix", "Anya", "Budi", "Siti", "Andi", "Maya", "Zaky"];
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)];
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
    setEditForm(prev => ({ ...prev, avatar_url: newAvatar }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header Profile */}
      <section className="relative min-h-[260px] bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex items-center p-10 md:p-14">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/40 rounded-full -ml-32 -mb-32 blur-3xl" />
        
        {/* Subtle decorative pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        {/* Edit Button - Balanced padding */}
        <div className="absolute top-10 right-10 z-20">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-xl text-white border border-white/20 rounded-2xl font-bold text-sm hover:bg-white/25 transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              <Edit3 size={16} />
              Edit Profil
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={handleCancel}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl text-white border border-white/20 rounded-2xl font-bold text-sm hover:bg-red-500/40 transition-all active:scale-95"
              >
                <X size={16} />
                Batal
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-7 py-2.5 bg-white text-blue-700 rounded-2xl font-black text-sm shadow-2xl shadow-blue-900/40 hover:scale-105 active:scale-95 transition-all"
              >
                <Save size={16} />
                Simpan
              </button>
            </div>
          )}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-center gap-8 w-full">
          <div className="relative group">
            {/* Avatar - Perfect Circle with Border */}
            <div className={`w-36 h-36 rounded-full bg-white p-1.5 shadow-2xl relative ring-4 transition-all duration-700 ${isGuru ? "ring-emerald-400/50 shadow-emerald-200/50" : "ring-blue-300/50 shadow-blue-200/50"} hover:ring-opacity-100`}>
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 border border-slate-100">
                <img 
                  src={isEditing ? editForm.avatar_url : user.avatar_url} 
                  alt="Avatar" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              {/* Online Indicator */}
              <div className={`absolute bottom-3 right-3 w-7 h-7 rounded-full border-4 border-white shadow-lg ${isGuru ? "bg-emerald-500" : "bg-blue-500"}`}></div>
            </div>
            
            {isEditing && (
              <button 
                onClick={changeAvatar}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 backdrop-blur-sm"
              >
                <Camera size={28} />
                <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Ganti</span>
              </button>
            )}
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left pt-2">
            {isEditing ? (
              <div className="space-y-5 w-full max-w-lg">
                <div className="relative">
                  <input 
                    type="text"
                    value={editForm.nama_lengkap}
                    onChange={(e) => setEditForm({ ...editForm, nama_lengkap: e.target.value })}
                    className="text-4xl font-black text-white tracking-tight bg-white/10 border-b-2 border-white/30 outline-none focus:border-white w-full px-2 py-1 placeholder:text-white/30"
                    placeholder="Nama Lengkap"
                  />
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl border border-white/10">
                      <span className="text-blue-200 font-black">@</span>
                      <input 
                        type="text"
                        value={editForm.username}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        className="bg-transparent text-white text-sm outline-none w-32 placeholder:text-white/30"
                        placeholder="username"
                      />
                    </div>
                    {isSiswa && (
                      <div className="flex items-center gap-3">
                        <input 
                          type="text"
                          value={editForm.kelas}
                          onChange={(e) => setEditForm({ ...editForm, kelas: e.target.value })}
                          className="bg-white/10 text-white rounded-xl px-3 py-2 text-sm outline-none border border-white/10 w-24"
                          placeholder="Kelas"
                        />
                        <input 
                          type="text"
                          value={editForm.nisn}
                          onChange={(e) => setEditForm({ ...editForm, nisn: e.target.value })}
                          className="bg-white/10 text-white rounded-xl px-3 py-2 text-sm outline-none border border-white/10 w-32"
                          placeholder="NISN"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 bg-white/10 rounded-xl p-1 pr-4 border border-white/10">
                    <div className="p-2 bg-white/10 text-white rounded-lg">
                      <LinkIcon size={14} />
                    </div>
                    <input 
                      type="text"
                      value={editForm.avatar_url}
                      onChange={(e) => setEditForm({ ...editForm, avatar_url: e.target.value })}
                      className="bg-transparent text-white text-[11px] outline-none flex-1 placeholder:text-white/30 truncate"
                      placeholder="URL Foto (HTTPS)..."
                    />
                    <button 
                      onClick={changeAvatar}
                      className="p-1.5 hover:bg-white/20 text-white/50 hover:text-white rounded-lg transition-all"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-xl">{user.nama_lengkap}</h2>
                <div className="flex items-center gap-3 mt-3">
                  <span className={`px-5 py-1.5 backdrop-blur-xl text-white text-xs font-black rounded-xl uppercase tracking-widest border-2 shadow-lg ${isGuru ? "bg-emerald-500/40 border-emerald-400" : "bg-white/20 border-white/25"}`}>
                    {user.role}
                  </span>
                  {isSiswa && (
                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/10 shadow-sm">
                      <Shield size={14} className="text-blue-200" />
                      <span className="text-white text-sm font-bold uppercase tracking-tight">Kelas {user.kelas}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Informasi Dasar</h3>
              {isEditing && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold uppercase tracking-tighter">Mode Edit</span>}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Username</p>
                  <p className="text-sm font-bold text-slate-800">@{user.username}</p>
                </div>
              </div>

              {isSiswa && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                    <Hash size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">NISN</p>
                    <p className="text-sm font-bold text-slate-800">{user.nisn}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Status Akun</p>
                  <p className="text-sm font-bold text-green-600">Terverifikasi</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div 
            whileHover={{ y: -5 }}
            className={`${isGuru ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-blue-600"} p-6 rounded-3xl shadow-xl shadow-blue-100 text-white relative overflow-hidden`}
          >
             <div className="absolute -right-4 -bottom-4 opacity-10">
               <Award size={120} />
             </div>
             <h4 className="font-bold mb-1">{isGuru ? "Rank Keaktifan" : "Rank Belajar"}</h4>
             <p className="text-3xl font-black">{isGuru ? "Senior Tutor" : "#12"}</p>
             <p className="text-xs text-blue-100 mt-2 font-medium">
               {isGuru ? "Terus berikan materi terbaik untuk siswa-siswamu!" : "Terus tingkatkan belajarmu untuk naik ke Top 10!"}
             </p>
             {isGuru && (
                <div className="absolute top-4 right-4 animate-bounce">
                  <Award size={24} className="text-yellow-300" />
                </div>
             )}
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Book size={22} className="text-blue-600" />
              Statistik Belajar
            </h3>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: "Materi Selesai", value: "24", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50", path: "/materi" },
                 { label: "Tugas Selesai", value: "18", icon: Award, color: "text-green-600", bg: "bg-green-50", path: "/tugas" },
                 { label: "Kehadiran", value: "98%", icon: Shield, color: "text-purple-600", bg: "bg-purple-50", path: "/absensi" },
                 { label: "Point", value: "1.250", icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
               ].map((stat, i) => (
                 <motion.button 
                   key={i} 
                   whileHover={stat.path ? { scale: 1.02 } : {}}
                   whileTap={stat.path ? { scale: 0.98 } : {}}
                   onClick={() => stat.path && navigate(stat.path)}
                   className={`p-6 rounded-2xl ${stat.bg} border border-white shadow-sm text-left transition-all ${stat.path ? "cursor-pointer hover:shadow-md" : "cursor-default"}`}
                 >
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${stat.color} mb-1`}>{stat.label}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-3xl font-black text-slate-800">{stat.value}</p>
                      {stat.path && <TrendingUp size={16} className={`${stat.color} opacity-40`} />}
                    </div>
                 </motion.button>
               ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Pengaturan Akun</h3>
            <div className="space-y-4">
               <button className="w-full p-4 flex items-center justify-between border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-slate-400" size={20} />
                    <span className="text-sm font-bold text-slate-600">Ubah Lokasi & Instansi</span>
                  </div>
                  <TrendingUp size={16} className="text-slate-200 group-hover:text-blue-600" />
               </button>
               <button className="w-full p-4 flex items-center justify-between border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Mail className="text-slate-400" size={20} />
                    <span className="text-sm font-bold text-slate-600">Ganti Email Utama</span>
                  </div>
                  <TrendingUp size={16} className="text-slate-200 group-hover:text-blue-600" />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
