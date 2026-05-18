import React, { useState } from "react";
import { CheckCircle2, Circle, Clock, Info, Search, X, FileText, User, ArrowLeft, Star, MessageSquare, Download, ExternalLink, Paperclip, Printer, FileSpreadsheet, TrendingUp } from "lucide-react";
import { MOCK_TUGAS, MOCK_SISWA_LIST, MOCK_PROFILE } from "../constants";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  taskId: string;
  taskTitle: string;
  status: "BELUM" | "TERKUMPUL" | "DINILAI";
  submissionDate?: string;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  grade?: number;
  feedback?: string;
}

export default function KoreksiTugas() {
  const navigate = useNavigate();
  const [selectedTaskId, setSelectedTaskId] = useState<string>(MOCK_TUGAS[0].id);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState<number | "">("");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [printMode, setPrintMode] = useState<"ALL" | "INDIVIDUAL">("ALL");

  // Generating mock submissions based on students and tasks
  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const list: Submission[] = [];
    MOCK_TUGAS.forEach(task => {
      MOCK_SISWA_LIST.forEach(student => {
        const isCollected = Math.random() > 0.3;
        const hasAttachment = isCollected && Math.random() > 0.4;
        list.push({
          id: `sub-${task.id}-${student.id}`,
          studentId: student.id,
          studentName: student.nama,
          taskId: task.id,
          taskTitle: task.judul,
          status: isCollected ? (Math.random() > 0.5 ? "DINILAI" : "TERKUMPUL") : "BELUM",
          submissionDate: isCollected ? "2026-04-29 14:30" : undefined,
          content: isCollected ? "Berikut adalah jawaban tugas saya. Saya telah mengerjakan semua soal latihan yang diberikan." : undefined,
          fileUrl: hasAttachment ? "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" : undefined,
          fileName: hasAttachment ? `tugas_${task.judul.toLowerCase().replace(/\s+/g, '_')}_${student.nama.toLowerCase().replace(/\s+/g, '_')}.pdf` : undefined,
          grade: isCollected && Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 80 : undefined,
          feedback: isCollected && Math.random() > 0.5 ? "Bagus, pertahankan!" : undefined
        });
      });
    });
    return list;
  });

  const selectedTask = MOCK_TUGAS.find(t => t.id === selectedTaskId);
  const taskSubmissions = submissions.filter(s => s.taskId === selectedTaskId);

  const stats = {
    total: taskSubmissions.length,
    collected: taskSubmissions.filter(s => s.status !== "BELUM").length,
    graded: taskSubmissions.filter(s => s.status === "DINILAI").length,
    avg: taskSubmissions.filter(s => s.grade).length > 0 
      ? Math.round(taskSubmissions.filter(s => s.grade).reduce((a, b) => a + (b.grade || 0), 0) / taskSubmissions.filter(s => s.grade).length) 
      : 0,
    max: Math.max(...taskSubmissions.map(s => s.grade || 0), 0),
    min: taskSubmissions.filter(s => s.grade).length > 0 ? Math.min(...taskSubmissions.filter(s => s.grade).map(s => s.grade || 0)) : 0
  };

  const handleGradeSubmission = () => {
    if (!selectedSubmission) return;
    
    setSubmissions(prev => prev.map(s => 
      s.id === selectedSubmission.id 
        ? { ...s, status: "DINILAI", grade: Number(grade), feedback } 
        : s
    ));
    
    setSelectedSubmission(null);
    setGrade("");
    setFeedback("");
  };

  const handleExportCSV = () => {
    const headers = ["No", "Nama Siswa", "Tanggal Pengumpulan", "Status", "Nilai", "Feedback"];
    const rows = taskSubmissions.map((s, i) => [
      i + 1,
      s.studentName,
      s.submissionDate || "Belum Mengumpulkan",
      s.status,
      s.grade || "-",
      s.feedback || "-"
    ].join(","));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_${selectedTask?.judul.replace(/\s+/g, '_')}_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportModalOpen(false);
  };

  const handlePrint = (mode: "ALL" | "INDIVIDUAL" = "ALL", sub?: Submission) => {
    setPrintMode(mode);
    if (sub) {
      setSelectedSubmission(sub);
      setGrade(sub.grade || "");
      setFeedback(sub.feedback || "");
    }
    setTimeout(() => {
      window.print();
      setIsExportModalOpen(false);
      // Clean up after print (if needed, but usually print blocks)
    }, 100);
  };

  return (
    <div className="space-y-8 pb-20 relative">
      {/* Hidden Print Content */}
      <div className="hidden print:block fixed inset-0 bg-white z-[999] p-12 text-slate-900 overflow-y-auto w-full h-full">
        <div className="text-center border-b-4 border-double border-slate-900 pb-6 mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-blue-600">Lentera Akademik Modern</h1>
          <p className="text-sm font-bold mt-1">Laporan Hasil Penilaian Tugas Siswa</p>
          <p className="text-[10px] mt-1 font-mono">ID Laporan: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>

        {printMode === "ALL" ? (
          <>
            <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
              <div className="space-y-1 text-xs">
                <p className="flex justify-between border-b pb-1"><span>Mata Pelajaran:</span> <span className="font-bold">{selectedTask?.kategori}</span></p>
                <p className="flex justify-between border-b pb-1"><span>Judul Tugas:</span> <span className="font-bold">{selectedTask?.judul}</span></p>
                <p className="flex justify-between border-b pb-1"><span>Guru Pengampu:</span> <span className="font-bold">{MOCK_PROFILE.nama_lengkap}</span></p>
              </div>
              <div className="space-y-1 text-xs">
                <p className="flex justify-between border-b pb-1"><span>Rata-rata Kelas:</span> <span className="font-bold">{stats.avg}</span></p>
                <p className="flex justify-between border-b pb-1"><span>Nilai Tertinggi:</span> <span className="font-bold">{stats.max}</span></p>
                <p className="flex justify-between border-b pb-1"><span>Nilai Terendah:</span> <span className="font-bold">{stats.min}</span></p>
              </div>
            </div>

            <table className="w-full border-collapse border border-slate-300 text-[10px]">
              <thead>
                <tr className="bg-slate-100 italic">
                  <th className="border border-slate-300 p-2 text-center w-10">No</th>
                  <th className="border border-slate-300 p-2 text-left">Nama Siswa</th>
                  <th className="border border-slate-300 p-2 text-center">Tanggal Kumpul</th>
                  <th className="border border-slate-300 p-2 text-center w-20">Nilai</th>
                  <th className="border border-slate-300 p-2 text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {taskSubmissions.map((s, i) => (
                  <tr key={s.id}>
                    <td className="border border-slate-300 p-2 text-center">{i + 1}</td>
                    <td className="border border-slate-300 p-2 font-bold">{s.studentName}</td>
                    <td className="border border-slate-300 p-2 text-center">{s.submissionDate || "-"}</td>
                    <td className="border border-slate-300 p-2 text-center font-black text-xs">{s.grade || "-"}</td>
                    <td className="border border-slate-300 p-2 italic text-[9px]">{s.feedback || (s.status === "BELUM" ? "Belum Mengumpulkan" : "Menunggu Koreksi")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          /* Individual Student Report */
          selectedSubmission && (
            <div className="space-y-10">
               <div className="bg-slate-50 p-8 rounded-3xl border border-slate-900 border-2">
                  <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-[0.2em] border-b-2 border-slate-900 pb-2 flex justify-between items-center">
                    Hasil Koreksi Individual
                    <span className="text-sm font-mono bg-white px-3 py-1 rounded-lg border border-slate-900">FINAL</span>
                  </h2>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Identitas Siswa</p>
                        <p className="text-xl font-black leading-tight">{selectedSubmission.studentName}</p>
                        <p className="text-xs font-bold text-slate-500">ID Siswa: {selectedSubmission.studentId}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Topik Pembahasan</p>
                        <p className="text-lg font-bold leading-tight">{selectedSubmission.taskTitle}</p>
                        <p className="text-xs font-bold text-slate-500">{selectedTask?.kategori}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status Penyerahan</p>
                        <p className="text-sm font-bold">{selectedSubmission.submissionDate}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Guru Penilai</p>
                        <p className="text-sm font-bold">{MOCK_PROFILE.nama_lengkap}</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="border-l-8 border-slate-900 pl-6 py-4 bg-slate-50/50 rounded-r-3xl">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Jawaban / Materi yang Dikumpulkan</p>
                     <p className="text-md italic text-slate-800 leading-relaxed font-serif">
                        "{selectedSubmission.content}"
                     </p>
                  </div>

                  <div className="grid grid-cols-3 gap-10 items-stretch">
                     <div className="col-span-1 bg-slate-900 text-white p-8 rounded-3xl flex flex-col items-center justify-center text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nilai Akhir</p>
                        <p className="text-7xl font-black">{selectedSubmission.grade || "0"}</p>
                        <p className="text-xs font-bold mt-2 uppercase tracking-tighter text-blue-400">Predikat: {Number(selectedSubmission.grade) >= 90 ? "Sempurna" : "Bagus"}</p>
                     </div>
                     <div className="col-span-2 border-2 border-slate-300 border-dashed p-8 rounded-3xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Catatan Perbaikan & Apresiasi</p>
                        <p className="text-md font-bold text-slate-600 font-serif italic leading-loose">
                           "{selectedSubmission.feedback || "Tidak ada catatan tambahan. Pertahankan kerjamu!"}"
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          )
        )}

        <div className="mt-32 flex justify-between items-end px-4">
          <div className="text-center w-64">
             <div className="h-20 border-b border-slate-300 w-32 mx-auto mb-2" />
             <p className="text-[10px] font-black uppercase text-slate-400">Stempel Sekolah</p>
          </div>
          <div className="text-center w-64 pb-2 border-b-2 border-slate-900">
            <p className="text-sm font-black uppercase mb-1">{MOCK_PROFILE.nama_lengkap}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Guru Pengampu Mata Pelajaran</p>
            <div className="h-16" />
          </div>
        </div>
      </div>

      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-slate-400 hover:text-blue-600 text-sm font-bold mb-2 transition-colors cursor-pointer" onClick={() => navigate("/")}>
            <ArrowLeft size={16} /> Kembali
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Koreksi Tugas Siswa</h2>
          <p className="text-slate-500 mt-1">Periksa, beri nilai, dan berikan balasan pada tugas yang dikumpulkan siswa.</p>
        </div>
        <button 
          onClick={() => setIsExportModalOpen(true)}
          className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-slate-600 font-black text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-sm active:scale-95"
        >
          <Printer size={18} className="text-blue-600" /> Cetak Laporan
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 print:hidden">
        {/* Task List Sidebar */}
        <div className="lg:col-span-1 space-y-4">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Pilih Tugas</h3>
           <div className="space-y-2">
             {MOCK_TUGAS.map(task => (
               <button
                 key={task.id}
                 onClick={() => setSelectedTaskId(task.id)}
                 className={`w-full p-4 rounded-2xl text-left transition-all border-2 ${
                   selectedTaskId === task.id 
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" 
                    : "bg-white border-slate-100 text-slate-600 hover:border-blue-200"
                 }`}
               >
                 <p className={`text-sm font-bold truncate ${selectedTaskId === task.id ? "text-white" : "text-slate-800"}`}>
                   {task.judul}
                 </p>
                 <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${
                      selectedTaskId === task.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                    }`}>
                      {task.kategori}
                    </span>
                    <span className={`text-[10px] font-bold ${selectedTaskId === task.id ? "text-blue-100" : "text-slate-400"}`}>
                      {submissions.filter(s => s.taskId === task.id && s.status !== "BELUM").length} Terkumpul
                    </span>
                 </div>
               </button>
             ))}
           </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
           {/* Task Overview Stats */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                 <p className="text-2xl font-black text-slate-800">{stats.total}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Siswa</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                 <p className="text-2xl font-black text-blue-600">{stats.collected}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Terkumpul</p>
                 <div className="absolute -right-2 -bottom-2 opacity-5 text-blue-600 group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={60} />
                 </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                 <p className="text-2xl font-black text-green-600">{stats.avg}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rerata Nilai</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm bg-gradient-to-br from-amber-50 to-transparent border-amber-100">
                 <p className="text-2xl font-black text-amber-600">{stats.max}</p>
                 <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Nilai Tertinggi</p>
              </div>
           </div>

           {/* Submission List Table */}
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">Status Pengumpulan</h3>
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <input type="text" placeholder="Cari siswa..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                      <th className="px-8 py-4">Siswa</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Nilai</th>
                      <th className="px-8 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {taskSubmissions.map(sub => (
                      <tr key={sub.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                               <User size={20} />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-800">{sub.studentName}</p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{sub.submissionDate || "Belum ada data"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                             sub.status === "DINILAI" ? "bg-green-100 text-green-600" :
                             sub.status === "TERKUMPUL" ? "bg-blue-100 text-blue-600" :
                             "bg-slate-100 text-slate-400"
                           }`}>
                             {sub.status}
                           </span>
                        </td>
                        <td className="px-8 py-5">
                           <p className="font-black text-slate-800">{sub.grade || "-"}</p>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => handlePrint("INDIVIDUAL", sub)}
                               disabled={sub.status === "BELUM"}
                               className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                               title="Cetak Individual"
                             >
                                <Printer size={16} />
                             </button>
                             <button 
                               disabled={sub.status === "BELUM"}
                               onClick={() => {
                                 setSelectedSubmission(sub);
                                 setGrade(sub.grade || "");
                                 setFeedback(sub.feedback || "");
                               }}
                               className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                 sub.status === "BELUM" 
                                  ? "text-slate-300 cursor-not-allowed" 
                                  : "text-blue-600 hover:bg-blue-50 bg-white border border-slate-100"
                               }`}
                             >
                               {sub.status === "DINILAI" ? "Ubah Nilai" : "Koreksi"}
                             </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      </div>

      {/* Export Selection Modal */}
      <AnimatePresence>
        {isExportModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsExportModalOpen(false)}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
             >
                <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-4">
                      <Printer size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-slate-800">Pilih Format Laporan</h3>
                   <p className="text-sm text-slate-500 mt-2">Pilih format pengunduhan atau pencetakan laporan untuk tugas ini.</p>
                   
                   <div className="w-full space-y-3 mt-8">
                      <button 
                        onClick={() => handlePrint("ALL")}
                        className="w-full p-4 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-2xl flex items-center gap-4 transition-all group"
                      >
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                            <Printer size={20} />
                         </div>
                         <div className="text-left">
                            <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600">Cetak PDF</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Format Standar Laporan</p>
                         </div>
                      </button>

                      <button 
                        onClick={handleExportCSV}
                        className="w-full p-4 bg-slate-50 hover:bg-green-50 border border-slate-100 hover:border-green-200 rounded-2xl flex items-center gap-4 transition-all group"
                      >
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm">
                            <FileSpreadsheet size={20} />
                         </div>
                         <div className="text-left">
                            <p className="text-sm font-bold text-slate-800 group-hover:text-green-600">Ekspor Excel/CSV</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Untuk Pengolahan Data</p>
                         </div>
                      </button>
                   </div>

                   <button 
                     onClick={() => setIsExportModalOpen(false)}
                     className="mt-6 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                   >
                     Batal
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grading Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedSubmission(null)}
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
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                         <FileText size={24} />
                      </div>
                      <div>
                         <h3 className="text-xl font-bold text-slate-800">Koreksi Tugas Siswa</h3>
                         <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{selectedSubmission.studentName}</p>
                      </div>
                   </div>
                   <button onClick={() => setSelectedSubmission(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                      <X size={24} />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                   {/* Task Reference */}
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Judul Tugas</p>
                      <p className="text-sm font-bold text-slate-700">{selectedSubmission.taskTitle}</p>
                   </div>

                   {/* Student Content */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <MessageSquare size={12} /> Jawaban Siswa
                        </label>
                        <div className="p-6 bg-blue-50/30 rounded-3xl border border-blue-50 text-slate-700 text-sm leading-relaxed italic h-full">
                          "{selectedSubmission.content}"
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Paperclip size={12} /> Lampiran Berkas
                        </label>
                        {selectedSubmission.fileUrl ? (
                           <div className="p-6 bg-white border-2 border-slate-100 rounded-3xl flex flex-col items-center justify-center gap-4 group hover:border-blue-200 transition-all">
                              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                 <FileText size={32} />
                              </div>
                              <div className="text-center">
                                 <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{selectedSubmission.fileName || "tugas_siswa.pdf"}</p>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">PDF Document (1.2 MB)</p>
                              </div>
                              <div className="flex items-center gap-2 w-full pt-2">
                                 <a 
                                   href={selectedSubmission.fileUrl} 
                                   target="_blank" 
                                   rel="noreferrer"
                                   className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black rounded-xl transition-all uppercase tracking-widest"
                                 >
                                    <ExternalLink size={14} /> Lihat
                                 </a>
                                 <a 
                                   href={selectedSubmission.fileUrl} 
                                   download={selectedSubmission.fileName || "tugas_siswa.pdf"}
                                   className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition-all uppercase tracking-widest shadow-lg shadow-blue-100"
                                 >
                                    <Download size={14} /> Unduh
                                 </a>
                              </div>
                           </div>
                        ) : (
                           <div className="p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-400">
                              <Paperclip size={32} className="opacity-20" />
                              <p className="text-xs font-bold italic">Tidak ada lampiran berkas</p>
                           </div>
                        )}
                      </div>
                   </div>

                   {/* Grading Components */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Star size={12} /> Input Nilai (0-100)
                        </label>
                        <input 
                          type="number"
                          value={grade}
                          onChange={(e) => setGrade(Number(e.target.value))}
                          placeholder="Contoh: 95"
                          className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none transition-all font-black text-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <MessageSquare size={12} /> Feedback Guru
                        </label>
                        <textarea 
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Tuliskan catatan atau masukan..."
                          className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none transition-all text-sm min-h-[120px]"
                        />
                      </div>
                   </div>
                </div>

                <div className="p-8 border-t border-slate-50 flex items-center justify-end gap-3">
                   <button 
                     onClick={() => setSelectedSubmission(null)}
                     className="px-8 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-colors"
                   >
                     Batal
                   </button>
                   <button 
                     onClick={handleGradeSubmission}
                     className="px-10 py-4 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
                   >
                     Simpan Penilaian
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
