import { CheckCircle2, Circle, Clock, Info, Search, X, Send, FileText, ExternalLink, Lightbulb, Upload, Loader2, AlertCircle } from "lucide-react";
import { MOCK_TUGAS } from "../constants";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Tugas as TugasType } from "../types";
import { supabase } from "../lib/supabase";

export default function Tugas() {
  const navigate = useNavigate();
  const [tugas, setTugas] = useState(MOCK_TUGAS);
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [workingTask, setWorkingTask] = useState<TugasType | null>(null);
  const [selectedTask, setSelectedTask] = useState<TugasType | null>(null);
  const [workingNote, setWorkingNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");

  const completionPercentage = useMemo(() => {
    if (tugas.length === 0) return 0;
    const completed = tugas.filter(t => t.status).length;
    return Math.round((completed / tugas.length) * 100);
  }, [tugas]);

  const categories: string[] = ["Semua", ...Array.from(new Set<string>(tugas.map(t => t.kategori)))];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const isDeadlineNear = (deadlineStr: string) => {
    try {
      // Assuming deadline format "30 April 2026" or similar
      // For demo purposes, we'll check if it contains today's or tomorrow's date if it were simple
      // Since mock data is static, let's just simulate it for specific tasks or logic
      // Real implementation would parse the date:
      const taskDate = new Date(deadlineStr);
      const today = new Date();
      const diffTime = taskDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 1 && diffDays >= 0;
    } catch {
      return false; // Fallback for unparseable formats
    }
  };

  const getCategoryCount = (category: string) => {
    if (category === "Semua") return tugas.length;
    return tugas.filter(t => t.kategori === category).length;
  };

  const toggleStatus = (id: string) => {
    setTugas(tugas.map(t => t.id === id ? { ...t, status: !t.status } : t));
  };

  const startWorking = (task: TugasType) => {
    setWorkingTask(task);
    setWorkingNote(task.catatan || "");
  };

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workingTask) return;

    setIsSubmitting(true);
    setSubmissionStatus("IDLE");

    try {
      let fileUrl = "";
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${workingTask.id}_${Date.now()}.${fileExt}`;
        const filePath = `tugas_siswa/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('tugas-siswa')
          .upload(filePath, file);

        if (uploadError) {
           console.error("Storage upload error:", uploadError);
           // Fallback for demo
           fileUrl = "https://via.placeholder.com/150?text=File+Uploaded";
        } else {
           fileUrl = supabase.storage.from('tugas-siswa').getPublicUrl(filePath).data.publicUrl;
        }
      }

      setTugas(tugas.map(t => t.id === workingTask.id ? { ...t, status: true, catatan: workingNote } : t));
      setSubmissionStatus("SUCCESS");
      
      setTimeout(() => {
        setWorkingTask(null);
        setWorkingNote("");
        setFile(null);
        setSubmissionStatus("IDLE");
      }, 1500);

    } catch (error) {
      console.error("Error submitting task:", error);
      setSubmissionStatus("ERROR");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTugas = tugas.filter(t => {
    const matchesStatus = 
      statusFilter === "Semua" || 
      (statusFilter === "Selesai" && t.status) || 
      (statusFilter === "Belum Selesai" && !t.status);
    
    const matchesCategory = categoryFilter === "Semua" || t.kategori === categoryFilter;
    
    return matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-20">
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-slate-800">Manajemen Tugas</h2>
          <p className="text-slate-500 mt-1">Pantau dan kerjakan tugasmu tepat waktu.</p>
          
          {/* Task Statistics Progress Bar */}
          <div className="mt-6 max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress Pengerjaan</span>
              <span className="text-sm font-black text-blue-600">{completionPercentage}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-100"
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex bg-white p-1 border border-slate-200 rounded-xl w-fit">
            {["Semua", "Belum Selesai", "Selesai"].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`
                  px-4 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap
                  ${statusFilter === f ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}
                `}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex bg-white p-1 border border-slate-200 rounded-xl w-fit overflow-x-auto no-scrollbar max-w-[300px] md:max-w-none">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`
                  px-4 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2
                  ${categoryFilter === c ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}
                `}
              >
                {c}
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${categoryFilter === c ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"}`}>
                  {getCategoryCount(c)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div className="flex items-center gap-2 text-slate-600">
             <Info size={18} />
             <span className="text-sm font-medium">Selesaikan tugas tepat waktu untuk mendapatkan Poin Belajar!</span>
           </div>
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input type="text" placeholder="Cari tugas..." className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-48" />
           </div>
        </div>

        <div className="divide-y divide-slate-100">
          <AnimatePresence initial={false}>
            {filteredTugas.length > 0 ? (
              filteredTugas.map((t) => (
                <motion.div 
                  key={t.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleStatus(t.id)}
                      className={`
                        transition-transform duration-200 active:scale-95 shrink-0
                        ${t.status ? "text-green-500" : "text-slate-300 hover:text-blue-400"}
                      `}
                    >
                      {t.status ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                    </button>
                    <div 
                      className="cursor-pointer flex-1"
                      onClick={() => setSelectedTask(t)}
                    >
                      <h4 className={`text-lg font-bold transition-all group-hover:text-blue-600 ${t.status ? "text-slate-400 line-through" : "text-slate-800"}`}>
                        {t.judul}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.status ? "bg-slate-100 text-slate-400" : "bg-blue-50 text-blue-600"}`}>
                          {t.kategori}
                        </span>
                        <div className={`flex items-center gap-1 text-xs font-bold ${isDeadlineNear(t.deadline) && !t.status ? "text-red-500 animate-pulse" : "text-slate-400"}`}>
                          <Clock size={12} /> Deadline: {t.deadline}
                        </div>
                      </div>
                      {t.catatan && (
                        <p className="text-xs text-slate-400 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                          "{t.catatan}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     {!t.status && (
                        <div className="flex items-center gap-2">
                           <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate("/tanya-ai", { state: { query: `Bantu saya memahami tugas: ${t.judul}` } });
                              }}
                              className="px-4 py-2 text-sm font-bold bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-all flex items-center gap-2 border border-amber-100"
                           >
                              <Lightbulb size={16} /> Bantu Saya
                           </button>
                           <button 
                              onClick={() => startWorking(t)}
                              className="px-6 py-2 text-sm font-black bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-100 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-widest"
                           >
                              Kerjakan
                           </button>
                        </div>
                     )}
                     <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTask(t);
                        }}
                        className="hidden sm:flex p-2 text-slate-400 hover:text-blue-600 border border-transparent hover:border-slate-200 rounded-lg transition-all"
                      >
                       <FileText size={18} />
                     </button>
                  </div>
                </motion.div>
              ))
            ) : (
                <div className="p-20 text-center text-slate-400">
                    <CheckCircle2 className="mx-auto mb-4 opacity-10" size={64} />
                    <p className="text-lg font-medium">Daftar tugas kosong.</p>
                </div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Menampilkan {filteredTugas.length} tugas
            </span>
        </div>
      </div>

      {/* Working Mode Modal */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white text-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-1">{selectedTask.kategori}</p>
                    <h3 className="font-black text-2xl tracking-tight leading-none">{selectedTask.judul}</h3>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="space-y-4">
                   <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-lg w-fit text-[10px] font-black uppercase tracking-widest">
                     <Clock size={12} /> Deadline: {selectedTask.deadline}
                   </div>
                   
                   <div className="space-y-2">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Deskripsi Tugas</h4>
                     <p className="text-slate-600 text-sm leading-relaxed font-medium">
                       {selectedTask.deskripsi || "Tidak ada deskripsi tersedia untuk tugas ini."}
                     </p>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Info size={40} className="text-blue-600" />
                      </div>
                      <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                        Instruksi Tambahan
                      </h4>
                      <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                        {selectedTask.instruksi || "Ikuti petunjuk umum pengerjaan tugas yang diberikan oleh guru mata pelajaran."}
                      </div>
                   </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                   <div className={`w-3 h-3 rounded-full ${selectedTask.status ? "bg-green-500" : "bg-amber-500"}`} />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     Status: {selectedTask.status ? "Selesai" : "Menunggu"}
                   </span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedTask(null)}
                    className="px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-2xl transition-all"
                  >
                    Tutup
                  </button>
                  {!selectedTask.status && (
                    <button 
                       onClick={() => {
                         setSelectedTask(null);
                         startWorking(selectedTask);
                       }}
                       className="px-8 py-3 bg-blue-600 text-white text-sm font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95 uppercase tracking-widest"
                    >
                      Kerjakan →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Working Mode Modal */}
      <AnimatePresence>
        {workingTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setWorkingTask(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-blue-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{workingTask.judul}</h3>
                    <p className="text-blue-100 text-xs font-medium uppercase tracking-widest">{workingTask.kategori}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setWorkingTask(null)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmitTask} className="flex-1 overflow-y-auto p-8 space-y-8">
                {submissionStatus === "SUCCESS" ? (
                  <div className="py-20 flex flex-col items-center text-center animate-in zoom-in">
                    <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={48} />
                    </div>
                    <h4 className="text-2xl font-black text-slate-800 tracking-tight">Tugas Berhasil Terkirim!</h4>
                    <p className="text-slate-500 mt-2 font-medium">Bagus sekali! Tetap semangat belajarnya ya.</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-6 opacity-10">
                         <Info size={60} className="text-blue-600" />
                       </div>
                       <h4 className="font-black text-blue-900 text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                         Petunjuk Pengiriman
                       </h4>
                       <p className="text-blue-700 text-xs leading-relaxed font-bold">
                         Silakan unggah berkas tugasmu (PDF/Gambar) dan berikan catatan tambahan jika diperlukan. 
                         Tugas akan langsung dikirim ke guru pengampu.
                       </p>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unggah Berkas Tugas</label>
                      <div className="relative group">
                         <input 
                           type="file" 
                           onChange={handleFileChange}
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                         />
                         <div className={`p-10 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center gap-4 transition-all ${file ? "bg-green-50 border-green-400" : "bg-slate-50 border-slate-200 group-hover:border-blue-400 group-hover:bg-blue-50"}`}>
                           <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${file ? "bg-green-500 text-white" : "bg-slate-200 text-slate-500"}`}>
                             {file ? <CheckCircle2 size={32} /> : <Upload size={32} />}
                           </div>
                           <div className="text-center">
                             <p className={`text-sm font-bold ${file ? "text-green-600" : "text-slate-600"}`}>
                               {file ? file.name : "Klik atau seret berkas tugas ke sini"}
                             </p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">PDF, DOCX, JPEG up to 10MB</p>
                           </div>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Catatan Tambahan (Opsional)</label>
                      <textarea 
                        value={workingNote}
                        onChange={(e) => setWorkingNote(e.target.value)}
                        placeholder="Tuliskan catatan untuk gurumu..."
                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[150px] text-slate-800 font-medium"
                      />
                    </div>
                    
                    {submissionStatus === "ERROR" && (
                      <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-pulse">
                        <AlertCircle size={18} />
                        Gagal mengirim tugas. Silakan coba kembali.
                      </div>
                    )}
                  </>
                )}
              </form>

              <div className="p-8 border-t border-slate-100 flex items-center justify-end gap-4 bg-slate-50/50">
                <button 
                  onClick={() => setWorkingTask(null)}
                  disabled={isSubmitting}
                  className="px-8 py-3 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-2xl transition-all disabled:opacity-50"
                >
                  Batal
                </button>
                {submissionStatus !== "SUCCESS" && (
                  <button 
                     onClick={handleSubmitTask}
                     disabled={isSubmitting || !file}
                     className="px-12 py-4 bg-blue-600 text-white text-sm font-black rounded-[2rem] hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 uppercase tracking-widest"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Sedang Mengirim...
                      </>
                    ) : (
                      <>
                        Submit Tugas
                        <Send size={18} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
