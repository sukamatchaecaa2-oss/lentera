import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Plus, 
  Search, 
  MoreVertical, 
  LayoutGrid, 
  List, 
  ChevronRight, 
  GraduationCap,
  School,
  ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Kelas {
  id: string;
  nama: string;
  tingkat: number;
  jumlahSiswa: number;
  siswaAktif: number;
  waliKelas: string;
}

export default function ManajemenKelas() {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<"GRID" | "LIST">("GRID");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);
  const [editFormNama, setEditFormNama] = useState("");
  const [editFormWali, setEditFormWali] = useState("");
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

  // Initial data generation
  const generateInitialClasses = () => {
    const classes: Kelas[] = [];
    [10, 11, 12].forEach((tingkat) => {
      for (let i = 1; i <= 7; i++) {
        classes.push({
          id: `${tingkat}-${i}`,
          nama: `${tingkat}-${i}`,
          tingkat: tingkat,
          jumlahSiswa: Math.floor(Math.random() * 10) + 25, // 25-35 students
          siswaAktif: Math.floor(Math.random() * 15), // 0-15 active students
          waliKelas: `Guru Wali ${tingkat}-${i}`
        });
      }
    });
    return classes;
  };

  const [classes, setClasses] = useState<Kelas[]>(generateInitialClasses());
  const [newKelas, setNewKelas] = useState({ tingkat: 10, nomor: "" });

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `${newKelas.tingkat}-${newKelas.nomor}`;
    if (classes.find(k => k.id === id)) {
      alert("Kelas sudah ada!");
      return;
    }
    const created: Kelas = {
      id,
      nama: id,
      tingkat: newKelas.tingkat,
      jumlahSiswa: 0,
      siswaAktif: 0,
      waliKelas: "Belum Ditentukan"
    };
    setClasses([...classes, created].sort((a,b) => {
        if (a.tingkat !== b.tingkat) return a.tingkat - b.tingkat;
        return a.nama.localeCompare(b.nama);
    }));
    setIsModalOpen(false);
    setNewKelas({ tingkat: 10, nomor: "" });
  };

  const handleUpdateKelas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKelas) return;

    setClasses(classes.map(k => 
      k.id === editingKelas.id ? { ...k, nama: editFormNama, waliKelas: editFormWali } : k
    ));
    setIsEditModalOpen(false);
    setEditingKelas(null);
  };

  const filteredClasses = classes.filter(k => 
    k.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: classes.length,
    totalSiswa: classes.reduce((sum, k) => sum + k.jumlahSiswa, 0),
    k10: classes.filter(k => k.tingkat === 10).length,
    k11: classes.filter(k => k.tingkat === 11).length,
    k12: classes.filter(k => k.tingkat === 12).length,
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Manajemen Kelas</h2>
          <p className="text-slate-500 font-medium">Atur distribusi kelas dan pantau kapasitas belajar mengajar.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
             <button 
               onClick={() => setViewType("GRID")}
               className={`p-2 rounded-xl transition-all ${viewType === "GRID" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
             >
                <LayoutGrid size={20} />
             </button>
             <button 
               onClick={() => setViewType("LIST")}
               className={`p-2 rounded-xl transition-all ${viewType === "LIST" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
             >
                <List size={20} />
             </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-[1.2rem] font-black text-sm shadow-xl shadow-blue-100 hover:scale-[1.02] transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={20} />
            Tambah Kelas
          </button>
        </div>
      </section>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Total Kelas", val: stats.total, icon: School, color: "bg-indigo-50 text-indigo-600" },
          { label: "Total Siswa", val: stats.totalSiswa, icon: Users, color: "bg-emerald-50 text-emerald-600" },
          { label: "Kelas 10", val: stats.k10, icon: GraduationCap, color: "bg-blue-50 text-blue-600" },
          { label: "Kelas 11 & 12", val: stats.k11 + stats.k12, icon: GraduationCap, color: "bg-purple-50 text-purple-600" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-blue-100 transition-all">
            <div className={`w-12 h-12 ${s.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{s.val}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Tabs */}
      <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
         <div className="relative flex-1 w-full md:w-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama kelas..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent focus:border-blue-100 focus:bg-white rounded-2xl text-sm font-bold outline-none transition-all shadow-inner"
            />
         </div>
         <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
            {["SEMUA", "KELAS 10", "KELAS 11", "KELAS 12"].map(tab => (
              <button 
                key={tab}
                className="px-5 py-2.5 whitespace-nowrap text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 text-slate-400 transition-all border border-transparent hover:border-slate-100"
              >
                {tab}
              </button>
            ))}
         </div>
      </div>

      {/* Classes Content */}
      <div className="space-y-10">
        {[10, 11, 12].map((tingkat) => {
          const levelClasses = filteredClasses.filter(k => k.tingkat === tingkat);
          if (levelClasses.length === 0 && searchTerm) return null;

          return (
            <div key={tingkat}>
              <div className="flex items-center gap-4 mb-6">
                 <div className="h-px bg-slate-100 flex-1" />
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                   <GraduationCap size={16} /> Tingkat {tingkat}
                 </h3>
                 <div className="h-px bg-slate-100 flex-1" />
              </div>

              {viewType === "GRID" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {levelClasses.map((kelas) => (
                    <motion.div 
                      key={kelas.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-100 transition-all group relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-black group-hover:scale-110 transition-transform">
                          {kelas.nama}
                        </div>
                        <div className="relative">
                           <button 
                             onClick={() => setDropdownOpenId(dropdownOpenId === kelas.id ? null : kelas.id)}
                             className="p-2 text-slate-300 hover:text-slate-600 transition-colors"
                           >
                              <MoreVertical size={20} />
                           </button>
                           
                           <AnimatePresence>
                             {dropdownOpenId === kelas.id && (
                               <>
                                 <div 
                                   className="fixed inset-0 z-[60]" 
                                   onClick={() => setDropdownOpenId(null)}
                                 />
                                 <motion.div 
                                   initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                   animate={{ opacity: 1, scale: 1, y: 0 }}
                                   exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                   className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 z-[70] overflow-hidden"
                                 >
                                    <button 
                                      onClick={() => {
                                        setEditingKelas(kelas);
                                        setEditFormNama(kelas.nama);
                                        setEditFormWali(kelas.waliKelas);
                                        setIsEditModalOpen(true);
                                        setDropdownOpenId(null);
                                      }}
                                      className="w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
                                    >
                                       Edit Kelas
                                    </button>
                                    <button className="w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-colors flex items-center gap-2">
                                       Hapus
                                    </button>
                                 </motion.div>
                               </>
                             )}
                           </AnimatePresence>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Wali Kelas</p>
                            <p className="text-sm font-bold text-slate-800">{kelas.waliKelas}</p>
                         </div>
                         <div className="flex items-center justify-between">
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Siswa Terdaftar</p>
                               <div className="flex items-center gap-2">
                                  <Users size={14} className="text-blue-500" />
                                  <span className="text-sm font-black text-slate-900">{kelas.jumlahSiswa} Siswa</span>
                               </div>
                            </div>
                            <div className="h-8 w-px bg-slate-100" />
                            <div className="text-right">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                               <div className="flex flex-col items-end gap-1">
                                  <span className="text-[10px] font-black text-emerald-500 uppercase">Aktif</span>
                                  {kelas.siswaAktif > 0 && (
                                    <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                       <span className="text-[8px] font-black text-emerald-600 uppercase">{kelas.siswaAktif} Online</span>
                                    </div>
                                  )}
                               </div>
                            </div>
                         </div>
                      </div>

                      <button 
                        onClick={() => navigate(`/kelas/${kelas.id}`)}
                        className="w-full py-3 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                         Lihat Detail <ArrowUpRight size={14} />
                      </button>

                      {/* Decoration */}
                      <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity rotate-12">
                         <School size={120} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                  {levelClasses.map((kelas, idx) => (
                    <div key={kelas.id} className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0`}>
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center font-black">
                            {kelas.nama}
                         </div>
                         <div>
                            <p className="font-black text-slate-800">{kelas.waliKelas}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">ID: {kelas.id}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-10">
                         <div className="hidden md:block">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Status Siswa</p>
                            <div className="flex items-center justify-center gap-2">
                               <div className={`w-2 h-2 rounded-full ${kelas.siswaAktif > 0 ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                               <p className="text-sm font-black text-slate-800">{kelas.siswaAktif} Aktif</p>
                            </div>
                         </div>
                         <div className="hidden md:block">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Ratio</p>
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-500 w-[70%]" />
                            </div>
                         </div>
                         <button 
                           onClick={() => navigate(`/kelas/${kelas.id}`)}
                           className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-blue-400 hover:text-blue-600 transition-all active:scale-95"
                         >
                            Detail
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Class Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10"
             >
                <div className="flex items-start justify-between mb-8">
                   <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-200 rotate-3">
                      <Plus size={32} />
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-600">
                      <ChevronRight size={24} className="rotate-45" />
                   </button>
                </div>

                <div className="mb-10">
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">Tambah Kelas Baru</h3>
                   <p className="text-slate-500 font-medium">Lengkapi data untuk membuka rombongan belajar baru.</p>
                </div>

                <form onSubmit={handleAddClass} className="space-y-6">
                   <div className="space-y-4">
                      <div>
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Pilih Tingkat</label>
                         <div className="grid grid-cols-3 gap-3">
                            {[10, 11, 12].map(lvl => (
                              <button 
                                key={lvl}
                                type="button"
                                onClick={() => setNewKelas({...newKelas, tingkat: lvl})}
                                className={`py-4 rounded-2xl font-black text-lg transition-all border-2 ${newKelas.tingkat === lvl ? "bg-slate-900 text-white border-slate-900 shadow-xl" : "bg-slate-50 text-slate-400 border-transparent"}`}
                              >
                                {lvl}
                              </button>
                            ))}
                         </div>
                      </div>
                      <div>
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Nomor Kelas (1-20)</label>
                         <input 
                           required
                           type="text" 
                           placeholder="Contoh: 1, 2, atau A"
                           value={newKelas.nomor}
                           onChange={(e) => setNewKelas({...newKelas, nomor: e.target.value})}
                           className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl text-lg font-black outline-none transition-all shadow-inner placeholder:text-slate-300"
                         />
                      </div>
                   </div>

                   <button 
                     type="submit"
                     className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95"
                   >
                      Konfirmasi & Simpan <ArrowUpRight size={20} />
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Class Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsEditModalOpen(false)}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10"
             >
                <div className="flex items-start justify-between mb-8">
                   <div className="w-16 h-16 bg-amber-500 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-200 rotate-3">
                      <School size={32} />
                   </div>
                   <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-600">
                      <ChevronRight size={24} className="rotate-45" />
                   </button>
                </div>

                <div className="mb-10">
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">Edit Detail Kelas</h3>
                   <p className="text-slate-500 font-medium">Ubah identitas kelas dan jurusan rombongan belajar.</p>
                </div>

                <form onSubmit={handleUpdateKelas} className="space-y-6">
                   <div className="space-y-4">
                      <div>
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Nama Kelas & Jurusan</label>
                         <input 
                           required
                           type="text" 
                           placeholder="Contoh: 10-1 AKL atau 10-2 Otomotif"
                           value={editFormNama}
                           onChange={(e) => setEditFormNama(e.target.value)}
                           className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl text-lg font-black outline-none transition-all shadow-inner placeholder:text-slate-300"
                         />
                      </div>
                      <div>
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Nama Wali Kelas</label>
                         <input 
                           required
                           type="text" 
                           placeholder="Contoh: Budi, S.Pd"
                           value={editFormWali}
                           onChange={(e) => setEditFormWali(e.target.value)}
                           className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl text-lg font-black outline-none transition-all shadow-inner placeholder:text-slate-300"
                         />
                      </div>
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                         <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Informasi</p>
                         <p className="text-[11px] text-blue-500 font-medium leading-relaxed">
                            Pastikan format nama kelas sesuai dengan standar administrasi sekolah untuk memudahkan sinkronisasi data.
                         </p>
                      </div>
                   </div>

                   <div className="flex gap-3">
                      <button 
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
                      >
                         Batal
                      </button>
                      <button 
                        type="submit"
                        className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                      >
                         Simpan Perubahan
                      </button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
