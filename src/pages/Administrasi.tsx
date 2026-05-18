import React, { useState } from "react";
import { Package, Plus, Search, Filter, Trash2, Edit3, ClipboardList, TrendingUp, AlertCircle, FileText, Download } from "lucide-react";
import { MOCK_ASET, MOCK_GURU } from "../constants";
import { AsetRecord, Profile } from "../types";
import { motion, AnimatePresence } from "motion/react";

export default function Administrasi() {
  const [user] = useState<Profile>(() => {
    const saved = localStorage.getItem("lentera_user");
    return saved ? JSON.parse(saved) : MOCK_GURU;
  });

  const [assets, setAssets] = useState<AsetRecord[]>(MOCK_ASET);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newAsset, setNewAsset] = useState<Partial<AsetRecord>>({
    nama_barang: "",
    kategori: "Elektronik",
    jumlah: 1,
    kondisi: "BAIK"
  });

  const isGuru = user.role === "GURU";

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const asset: AsetRecord = {
      id: "as" + (assets.length + 1),
      nama_barang: newAsset.nama_barang || "Baru",
      kategori: newAsset.kategori || "Umum",
      jumlah: newAsset.jumlah || 1,
      kondisi: (newAsset.kondisi as any) || "BAIK",
      tanggal_masuk: new Date().toISOString().split('T')[0]
    };
    setAssets([asset, ...assets]);
    setShowModal(false);
    setNewAsset({ nama_barang: "", kategori: "Elektronik", jumlah: 1, kondisi: "BAIK" });
  };

  const filteredAssets = assets.filter(a => 
    a.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Administrasi & Inventaris</h2>
          <p className="text-slate-500 mt-1">Kelola aset sekolah dan laporan data masuk.</p>
        </div>
        
        {isGuru && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-all active:scale-95"
          >
            <Plus size={20} />
            Input Data Baru
          </button>
        )}
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <Package size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{assets.length}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Inventaris</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{assets.filter(a => a.kondisi === "RUSAK").length}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Barang Rusak</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{assets.reduce((sum, a) => sum + a.jumlah, 0)}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Unit</p>
          </div>
        </div>
      </div>

      {/* Table & Search */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama barang atau kategori..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Filter size={18} />
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
              <Download size={18} />
              Cetak XLS
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aset</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategori</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Jumlah</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Kondisi</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Masuk</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <ClipboardList size={20} />
                      </div>
                      <span className="font-bold text-slate-800">{asset.nama_barang}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase">
                      {asset.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-slate-700">{asset.jumlah}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      asset.kondisi === "BAIK" ? "bg-green-100 text-green-600" : 
                      asset.kondisi === "PERBAIKAN" ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600"
                    }`}>
                      {asset.kondisi}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-xs font-medium text-slate-400">
                    {new Date(asset.tanggal_masuk).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit3 size={16} /></button>
                       <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAssets.length === 0 && (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Search size={32} />
              </div>
              <p className="text-slate-400 font-medium">Tidak ada data aset yang cocok.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Input Baru */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowModal(false)}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
             >
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                   <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                     <FileText size={20} />
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-800">Input Data Masuk</h3>
                     <p className="text-xs text-slate-400">Tambahkan barang ke inventaris sekolah.</p>
                   </div>
                </div>

                <form onSubmit={handleAddAsset} className="p-6 space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Nama Barang</label>
                     <input 
                       required
                       type="text" 
                       value={newAsset.nama_barang}
                       onChange={(e) => setNewAsset({...newAsset, nama_barang: e.target.value})}
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                       placeholder="Contoh: Proyektor Kelas"
                     />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Kategori</label>
                       <select 
                         value={newAsset.kategori}
                         onChange={(e) => setNewAsset({...newAsset, kategori: e.target.value})}
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                       >
                         <option>Elektronik</option>
                         <option>Mebel</option>
                         <option>Buku</option>
                         <option>Olahraga</option>
                         <option>Umum</option>
                       </select>
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Jumlah</label>
                       <input 
                         type="number" 
                         value={newAsset.jumlah}
                         onChange={(e) => setNewAsset({...newAsset, jumlah: parseInt(e.target.value)})}
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                       />
                     </div>
                   </div>

                   <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Kondisi Awal</label>
                     <div className="flex gap-2">
                       {["BAIK", "PERBAIKAN", "RUSAK"].map(k => (
                         <button 
                           key={k}
                           type="button"
                           onClick={() => setNewAsset({...newAsset, kondisi: k as any})}
                           className={`flex-1 py-2 text-[10px] font-bold rounded-xl border transition-all ${
                             newAsset.kondisi === k 
                               ? "bg-blue-600 border-blue-600 text-white" 
                               : "bg-white border-slate-200 text-slate-500"
                           }`}
                         >
                           {k}
                         </button>
                       ))}
                     </div>
                   </div>

                   <div className="pt-4 flex gap-3">
                      <button 
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                      >
                        Batal
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                      >
                        Simpan Data
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
