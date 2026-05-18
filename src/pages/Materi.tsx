import { PlayCircle, Search, Filter, MoreVertical, Plus, Trash2, Edit, Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { MOCK_MATERI, MOCK_PROFILE } from "../constants";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Materi as MateriType, Profile } from "../types";
import { supabase } from "../lib/supabase";

export default function Materi() {
  const navigate = useNavigate();
  const [user, setUser] = useState<Profile>(() => {
    const saved = localStorage.getItem("lentera_user");
    return saved ? JSON.parse(saved) : MOCK_PROFILE;
  });
  const [materiList, setMateriList] = useState<MateriType[]>(MOCK_MATERI);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  
  const isGuru = user.role === "GURU";

  // CRUD States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMateri, setEditingMateri] = useState<MateriType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    kategori: "Matematika",
    link_video: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ["Semua", "Matematika", "Fisika", "Kimia", "Biologi", "Sejarah", "Bahasa"];

  const filteredMateri = materiList.filter(m => {
    const matchesSearch = m.judul.toLowerCase().includes(search.toLowerCase()) || 
                         m.deskripsi.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "Semua" || m.kategori === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = (materi?: MateriType) => {
    if (!isGuru) return; // Protection
    if (materi) {
      setEditingMateri(materi);
      setFormData({
        judul: materi.judul,
        deskripsi: materi.deskripsi,
        kategori: materi.kategori,
        link_video: materi.link_video
      });
      setPreviewUrl(materi.thumbnail_url || null);
    } else {
      setEditingMateri(null);
      setFormData({
        judul: "",
        deskripsi: "",
        kategori: "Matematika",
        link_video: ""
      });
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setIsModalOpen(true);
    setMenuOpenId(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGuru) return; // Protection
    setIsSubmitting(true);

    try {
      let finalThumbnailUrl = previewUrl || "";

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `materi_assets/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('materi-assets')
          .upload(filePath, selectedFile);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          // Fallback if bucket not created or key missing
          finalThumbnailUrl = "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop";
        } else {
          const { data } = supabase.storage.from('materi-assets').getPublicUrl(filePath);
          finalThumbnailUrl = data.publicUrl;
        }
      }

      if (editingMateri) {
        setMateriList(prev => prev.map(m => m.id === editingMateri.id ? {
          ...m,
          ...formData,
          thumbnail_url: finalThumbnailUrl
        } : m));
      } else {
        const newMateri: MateriType = {
          id: `m-${Date.now()}`,
          ...formData,
          thumbnail_url: finalThumbnailUrl || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop"
        };
        setMateriList(prev => [newMateri, ...prev]);
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving materi:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!isGuru) return; // Role check security
    if (window.confirm("Apakah Anda yakin ingin menghapus materi ini?")) {
      setMateriList(prev => prev.filter(m => m.id !== id));
      setMenuOpenId(null);
    }
  };

  return (
    <div className="space-y-8 min-h-screen">
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            {isGuru ? "Kelola Materi" : "Eksplor Materi"}
          </h2>
          <p className="text-slate-500 mt-1 font-medium italic">
            {isGuru ? "Tambahkan dan perbarui materi pembelajaran untuk siswa." : "Berbagai materi pilihan untuk menunjang belajarmu."}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari materi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all w-full md:w-64 font-medium"
            />
          </div>
          {isGuru && (
            <button 
              onClick={() => handleOpenModal()}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 font-black uppercase tracking-widest active:scale-95"
            >
              <Plus size={20} /> Tambah Materi
            </button>
          )}
        </div>
      </section>

      {/* Category Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`
              px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border
              ${activeCategory === cat 
                ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200" 
                : "bg-white text-slate-500 border-slate-100 hover:border-blue-200 hover:bg-blue-50"}
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Materi Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
        <AnimatePresence mode="popLayout">
          {filteredMateri.length > 0 ? (
            filteredMateri.map((m, idx) => (
              <motion.div 
                layout
                key={m.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col relative"
              >
                {/* Options Menu - Only for Guru */}
                {isGuru && (
                  <div className="absolute top-4 right-4 z-20">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === m.id ? null : m.id);
                      }}
                      className="p-2 bg-white/50 backdrop-blur-md rounded-xl text-slate-700 hover:bg-white transition-all shadow-sm"
                    >
                      <MoreVertical size={20} />
                    </button>
                    
                    <AnimatePresence>
                      {menuOpenId === m.id && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -10 }}
                          className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                        >
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleOpenModal(m); }}
                            className="w-full px-4 py-3 text-left text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                          >
                            <Edit size={16} className="text-blue-500" /> Ubah
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }}
                            className="w-full px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                          >
                            <Trash2 size={16} /> Hapus
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <div 
                  className="aspect-[4/3] bg-slate-100 relative overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/materi/${m.id}`)}
                >
                  <img 
                    src={m.thumbnail_url || `https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop`} 
                    alt={m.judul}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-all duration-500 flex items-center justify-center">
                    <PlayCircle className="text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 drop-shadow-2xl" size={80} />
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-xl">
                    {m.kategori}
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <h4 className="text-2xl font-black text-slate-800 leading-tight mb-4 group-hover:text-blue-600 transition-colors tracking-tight">
                    {m.judul}
                  </h4>
                  <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed flex-1 font-medium">
                    {m.deskripsi}
                  </p>
                  <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <PlayCircle size={20} />
                       </div>
                       <span className="text-xs font-black text-slate-400 uppercase tracking-widest">12 Min Belajar</span>
                    </div>
                    <div 
                      onClick={() => navigate(`/materi/${m.id}`)}
                      className="text-xs font-black text-blue-600 uppercase tracking-widest group-hover:translate-x-2 transition-transform cursor-pointer flex items-center gap-2"
                    >
                      Pelajari <span className="text-lg">→</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-32 text-center"
            >
              <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Search className="text-slate-200" size={64} />
              </div>
              <h4 className="text-2xl font-black text-slate-800 tracking-tight">Materi tidak ditemukan</h4>
              <p className="text-slate-400 mt-2 font-medium italic">Coba gunakan kata kunci atau kategori yang berbeda.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CRUD Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Plus size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">{editingMateri ? "Ubah Materi" : "Tambah Materi Baru"}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Lengkapi detail materi di bawah ini</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                >
                  <X size={28} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cover Materi</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      aspect-video rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all overflow-hidden relative group
                      ${previewUrl ? "border-transparent bg-slate-900" : "border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50"}
                    `}
                  >
                    {previewUrl ? (
                      <>
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                           <Upload size={40} className="mb-2" />
                           <p className="text-sm font-black uppercase tracking-widest">Ganti Gambar</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all">
                          <ImageIcon size={32} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-black text-slate-600 uppercase tracking-widest">Klik untuk unggah cover</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1">Format: JPG, PNG (Max. 5MB)</p>
                        </div>
                      </>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul Materi</label>
                    <input 
                      type="text"
                      required
                      value={formData.judul}
                      onChange={e => setFormData({...formData, judul: e.target.value})}
                      placeholder="Contoh: Integral Tak Tentu"
                      className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                    <select 
                      value={formData.kategori}
                      onChange={e => setFormData({...formData, kategori: e.target.value})}
                      className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium appearance-none"
                    >
                      {categories.filter(c => c !== "Semua").map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi Singkat</label>
                  <textarea 
                    required
                    value={formData.deskripsi}
                    onChange={e => setFormData({...formData, deskripsi: e.target.value})}
                    placeholder="Jelaskan isi materi ini..."
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium min-h-[120px]"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Link Video Pembelajaran (URL)</label>
                  <input 
                    type="url"
                    value={formData.link_video}
                    onChange={e => setFormData({...formData, link_video: e.target.value})}
                    placeholder="https://youtube.com/..."
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                  />
                </div>
              </form>

              <div className="p-8 border-t border-slate-100 flex items-center justify-end gap-4 bg-slate-50/50">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-8 py-4 text-sm font-black text-slate-500 hover:bg-slate-200 rounded-2xl transition-all uppercase tracking-widest"
                >
                  Batal
                </button>
                <button 
                   onClick={handleSubmit}
                   disabled={isSubmitting}
                   className="px-12 py-4 bg-blue-600 text-white text-sm font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 uppercase tracking-widest"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      {editingMateri ? "Simpan Perubahan" : "Publikasikan Materi"}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
