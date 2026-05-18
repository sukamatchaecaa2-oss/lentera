import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  PlayCircle, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  Share2,
  TrendingUp,
  Edit,
  Save,
  X,
  Maximize2,
  Minimize2,
  FileText,
  Download,
  Printer,
  History,
  Send,
  Star,
  Award
} from "lucide-react";
import { MOCK_MATERI, MOCK_PROFILE } from "../constants";
import { Profile } from "../types";
import { motion, AnimatePresence } from "motion/react";

const SUB_TOPICS = [
  { id: 1, title: "Konsep Dasar Turunan", duration: "03:45", active: true },
  { id: 2, title: "Aturan Rantai", duration: "05:20", active: false },
  { id: 3, title: "Turunan Fungsi Trigonometri", duration: "04:15", active: false },
  { id: 4, title: "Latihan Soal & Pembahasan", duration: "08:10", active: false },
];

const RECENT_COMMENTS = [
  { id: 1, user: "Budi", bodi: "Pak, di menit 04:20 rumusnya kenapa bisa gitu ya?", time: "2m ago" },
  { id: 2, user: "Siti", bodi: "Materi yang sangat jelas, terima kasih!", time: "15m ago" },
];

export default function MateriDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUser] = useState<Profile>(() => {
    const saved = localStorage.getItem("lentera_user");
    return saved ? JSON.parse(saved) : MOCK_PROFILE;
  });

  const [materi, setMateri] = useState(MOCK_MATERI.find(m => m.id === id));
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [privateNotes, setPrivateNotes] = useState(localStorage.getItem(`notes_${id}`) || "");
  const [showNotes, setShowNotes] = useState(false);

  // Teacher Specific States
  const [isPublished, setIsPublished] = useState(true);
  const [selectedClass, setSelectedClass] = useState("XII - IPA 1");
  const [pinnedCommentId, setPinnedCommentId] = useState<number | null>(null);
  
  const [editForm, setEditForm] = useState({
    judul: materi?.judul || "",
    deskripsi: materi?.deskripsi || "",
    link_video: materi?.link_video || "",
    kategori: materi?.kategori || ""
  });

  const isTeacher = currentUser.role === "GURU" || currentUser.role === "ADMIN";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    localStorage.setItem(`notes_${id}`, privateNotes);
  }, [privateNotes, id]);

  const handleSaveEdit = () => {
    if (!materi) return;
    const updatedMateri = {
      ...materi,
      ...editForm
    };
    setMateri(updatedMateri);
    setIsEditMode(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!materi) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Materi tidak ditemukan</h2>
        <button 
          onClick={() => navigate("/materi")}
          className="mt-4 text-blue-600 font-bold hover:underline"
        >
          Kembali ke Daftar Materi
        </button>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto space-y-8 pb-32 transition-all duration-500 ${isFocusMode ? "pt-10" : ""}`}>
      {/* Print View Header (Hidden in Web) */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-8 mb-8 text-center">
         <h1 className="text-3xl font-black">{materi.judul}</h1>
         <p className="text-sm font-bold mt-2 uppercase tracking-widest text-slate-500">{materi.kategori} • Rangkuman Materi</p>
         <p className="text-xs italic mt-4">Dicetak oleh {currentUser.nama_lengkap} pada {new Date().toLocaleDateString()}</p>
      </div>

      {/* Breadcrumbs & Actions */}
      {!isFocusMode && (
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
            <button 
              onClick={() => navigate("/materi")}
              className="hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              Materi
            </button>
            <ChevronRight size={14} />
            <span className="text-slate-800 font-bold truncate max-w-[200px] md:max-w-none">{materi.judul}</span>
          </div>
          
          <div className="flex items-center gap-3">
             {isTeacher && (
               <>
                 <div className="flex items-center bg-white border border-slate-100 rounded-2xl p-1 shadow-sm mr-2">
                    {["XII - IPA 1", "XII - IPA 2"].map((cls) => (
                       <button
                          key={cls}
                          onClick={() => setSelectedClass(cls)}
                          className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${selectedClass === cls ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
                       >
                          {cls}
                       </button>
                    ))}
                 </div>
                 <button 
                   onClick={() => setIsPublished(!isPublished)}
                   className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm border ${isPublished ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}
                 >
                    <div className={`w-2 h-2 rounded-full animate-pulse ${isPublished ? "bg-emerald-500" : "bg-amber-500"}`} />
                    {isPublished ? "PUBLISHED" : "DRAFT"}
                 </button>
                 <button 
                   onClick={() => setIsEditMode(true)}
                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                 >
                    <Edit size={16} /> Edit
                 </button>
               </>
             )}
             <button 
                onClick={handlePrint}
                className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-sm"
                title="Cetak Rangkuman"
             >
                <Printer size={20} />
             </button>
             <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-sm">
                <Share2 size={20} />
             </button>
             <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-sm">
                <ThumbsUp size={20} />
             </button>
          </div>
        </section>
      )}

      <div className={`grid grid-cols-1 ${isFocusMode ? "" : "lg:grid-cols-12"} gap-10`}>
        {/* Main Content Area */}
        <div className={`${isFocusMode ? "max-w-5xl mx-auto" : "lg:col-span-8"} space-y-8`}>
          {/* Video Section with Focus Toggle */}
          <div className="space-y-4">
             <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                      <PlayCircle size={20} />
                   </div>
                   <h2 className="font-black text-slate-800 tracking-tight">Sedang Diputar</h2>
                </div>
                <button 
                  onClick={() => setIsFocusMode(!isFocusMode)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                >
                  {isFocusMode ? <><Minimize2 size={12} /> Exit Focus</> : <><Maximize2 size={12} /> Focus Mode</>}
                </button>
             </div>

             <div className="aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative group border-4 border-white print:hidden">
                <iframe
                   src={materi.link_video.replace("watch?v=", "embed/")}
                   title={materi.judul}
                   className="w-full h-full"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                ></iframe>
             </div>
          </div>

          <div className="space-y-10">
             <div className="flex flex-wrap items-center gap-4 print:hidden">
                <span className="px-4 py-1.5 bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-xl">
                   {materi.kategori}
                </span>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-black uppercase tracking-widest">
                   <Clock size={16} className="text-blue-500" /> 12 Menit Tonton
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-black uppercase tracking-widest">
                   <BookOpen size={16} className="text-emerald-500" /> 5 Min Baca
                </div>
                <div className="flex items-center gap-1.5 text-amber-500 text-xs font-black uppercase tracking-widest">
                   <Star size={16} fill="currentColor" /> +150 XP
                </div>
             </div>

             <h1 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter hover:text-blue-600 transition-colors cursor-default">
               {materi.judul}
             </h1>

             <div className="prose prose-slate max-w-none">
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  {materi.deskripsi}
                </p>
                {isTeacher && (
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50 w-fit px-3 py-1 rounded-lg border border-blue-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" /> Status: Admin View Mode
                  </div>
                )}
                
                <div className="print:block space-y-6 mt-10">
                  <p className="text-slate-500 leading-relaxed text-lg">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10 print:grid-cols-2">
                     <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100/50">
                        <h4 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                          <CheckCircle size={20} className="text-blue-500" /> Key Concepts
                        </h4>
                        <ul className="space-y-4">
                           {["Fundamental calculus rules", "Power rule application", "Chain rule logic"].map((item, i) => (
                             <li key={i} className="flex items-center gap-3 text-slate-600 text-sm font-bold">
                                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" /> {item}
                             </li>
                           ))}
                        </ul>
                     </div>
                     <div className="p-8 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-100/50">
                        <h4 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                          <TrendingUp size={20} className="text-emerald-500" /> Real-world Use
                        </h4>
                        <ul className="space-y-4">
                           {["Physics motion analysis", "Economic rate of change", "Engineering optimization"].map((item, i) => (
                             <li key={i} className="flex items-center gap-3 text-slate-600 text-sm font-bold">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" /> {item}
                             </li>
                           ))}
                        </ul>
                     </div>
                  </div>
                </div>

                <div className="p-10 bg-slate-900 rounded-[3rem] text-white my-12 relative overflow-hidden print:bg-slate-100 print:text-slate-900 print:border-2">
                   <div className="relative z-10">
                      <h4 className="text-2xl font-black mb-6 flex items-center gap-3 tracking-tight">
                        <BookOpen size={28} className="text-blue-400" />
                        Rangkuman Inti
                      </h4>
                      <p className="text-slate-400 text-lg leading-relaxed mb-8 font-medium italic">
                        "Turunan adalah pengukuran bagaimana suatu fungsi berubah seiring perubahan nilai inputnya. Dalam kacamata geometri, turunan di suatu titik adalah gradien garis singgung pada kurva fungsi tersebut."
                      </p>
                      <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em]">
                         <span className="px-4 py-2 bg-white/10 rounded-full print:bg-slate-200">Gradient</span>
                         <span className="px-4 py-2 bg-white/10 rounded-full print:bg-slate-200">Rate of Change</span>
                         <span className="px-4 py-2 bg-white/10 rounded-full print:bg-slate-200">Calculus</span>
                      </div>
                   </div>
                   <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                      <BookOpen size={300} />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar */}
        {!isFocusMode && (
          <div className="lg:col-span-4 space-y-8 print:hidden">
            {/* Outline / Playlist */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Outline Materi</h3>
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase">4 Topics</span>
               </div>
               <div className="space-y-3">
                  {SUB_TOPICS.map((topic) => (
                     <div 
                        key={topic.id}
                        className={`group p-4 rounded-2xl flex items-center justify-between transition-all cursor-pointer border ${topic.active ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-50 border-transparent hover:bg-blue-50 hover:border-blue-100"}`}
                     >
                        <div className="flex items-center gap-4">
                           <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-[10px] ${topic.active ? "bg-white/20" : "bg-white text-blue-600 shadow-sm"}`}>
                              {topic.id}
                           </div>
                           <span className={`text-sm font-bold truncate max-w-[150px] ${topic.active ? "text-white" : "text-slate-600"}`}>{topic.title}</span>
                        </div>
                        <div className={`flex items-center gap-1.5 text-[10px] font-black ${topic.active ? "text-blue-100" : "text-slate-400"}`}>
                           <Clock size={12} /> {topic.duration}
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Learning Progress & Status (Dynamic based on Role) */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
               <div className="flex items-center justify-between mb-8">
                 <h3 className="text-lg font-black text-slate-800 tracking-tight">
                   {isTeacher ? `Progress Kelas (${selectedClass})` : "Progress Kamu"}
                 </h3>
                 <span className="text-[10px] font-black text-emerald-600">
                    {isTeacher ? "78%" : (isCompleted ? "100%" : "25%")}
                 </span>
               </div>

               <div className="mb-8">
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: isTeacher ? "78%" : (isCompleted ? "100%" : "25%") }}
                        className={`h-full ${isTeacher || isCompleted ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"} transition-all duration-1000`}
                     />
                  </div>
                  {isTeacher && (
                    <p className="text-[10px] text-slate-400 font-bold mt-3 italic">
                      25 dari 32 siswa telah menyelesaikan materi.
                    </p>
                  )}
               </div>

               <div className="space-y-6">
                  {!isTeacher ? (
                    !isCompleted ? (
                      <button 
                        onClick={() => setIsCompleted(true)}
                        className="w-full py-5 bg-slate-900 text-white text-sm font-black rounded-[2rem] hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-slate-200 uppercase tracking-widest"
                      >
                        Tandai Selesai
                        <CheckCircle size={20} />
                      </button>
                    ) : (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="p-6 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] flex flex-col items-center text-center"
                      >
                         <div className="w-16 h-16 bg-emerald-500 text-white rounded-[1.5rem] flex items-center justify-center mb-4 shadow-xl shadow-emerald-200 rotate-3 animate-bounce">
                            <Star size={32} fill="currentColor" />
                         </div>
                         <p className="text-lg font-black text-emerald-900 leading-tight">Materi Tuntas!</p>
                         <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-[0.2em] mt-2">+150 XP Ditambahkan</p>
                      </motion.div>
                    )
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                       <button className="py-4 bg-blue-600 text-white text-[10px] font-black rounded-2xl hover:bg-blue-700 transition-all uppercase tracking-widest shadow-lg shadow-blue-100">
                          Analisis Kuis
                       </button>
                       <button className="py-4 bg-slate-900 text-white text-[10px] font-black rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-widest">
                          Hubungkan Tugas
                       </button>
                    </div>
                  )}

                  <div className="pt-8 border-t border-slate-50 space-y-5">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Link & Lampiran</p>
                     
                     <div className="flex items-center justify-between group cursor-pointer p-4 hover:bg-blue-50 rounded-2xl transition-all border border-transparent hover:border-blue-100">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                              <Download size={20} />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-700">Rangkuman PDF</span>
                              <span className="text-[9px] text-slate-400 font-bold">1.2 MB • PDF</span>
                           </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                     </div>

                     {isTeacher && (
                        <div className="flex items-center justify-between group cursor-pointer p-4 bg-amber-50/30 hover:bg-amber-50 rounded-2xl transition-all border border-amber-100/50">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                                 <Award size={20} />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-sm font-bold text-slate-700">Kunci Jawaban</span>
                                 <span className="text-[9px] text-amber-600 font-black uppercase tracking-widest">Guru Only</span>
                              </div>
                           </div>
                           <ChevronRight size={16} className="text-slate-300" />
                        </div>
                     )}

                     <div className="flex items-center justify-between group cursor-pointer p-4 hover:bg-emerald-50 rounded-2xl transition-all border border-transparent hover:border-emerald-100">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                              <FileText size={20} />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-700">Latihan Soal</span>
                              <span className="text-[9px] text-slate-400 font-bold">DOCX • 15 Soal</span>
                           </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                     </div>
                  </div>
               </div>
            </div>

            {/* Quick Discussion Preview */}
            <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-black text-slate-800 tracking-tight">Diskusi Terkini</h3>
                 <button className="text-[10px] font-black text-blue-600 hover:underline uppercase">Lihat Semua</button>
               </div>
               <div className="space-y-4">
                  {RECENT_COMMENTS.map((comm) => (
                    <div 
                      key={comm.id} 
                      className={`bg-white p-4 rounded-2xl shadow-sm border transition-all ${pinnedCommentId === comm.id ? "border-amber-300 ring-2 ring-amber-100" : "border-slate-100"}`}
                    >
                       <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 text-[9px] font-black flex items-center justify-center uppercase">
                             {comm.user[0]}
                          </div>
                          <span className="text-[11px] font-black text-slate-700">{comm.user}</span>
                          {pinnedCommentId === comm.id && (
                            <span className="flex items-center gap-1 text-amber-500 font-black text-[8px] uppercase tracking-widest bg-amber-50 px-1.5 py-0.5 rounded-md">
                              <Star size={8} fill="currentColor" /> Pinned
                            </span>
                          )}
                          {isTeacher && (
                             <button 
                               onClick={() => setPinnedCommentId(pinnedCommentId === comm.id ? null : comm.id)}
                               className={`ml-auto p-1 rounded-md transition-colors ${pinnedCommentId === comm.id ? "text-amber-500" : "text-slate-300 hover:text-blue-500"}`}
                             >
                                <Star size={10} fill={pinnedCommentId === comm.id ? "currentColor" : "none"} />
                             </button>
                          )}
                          <span className="text-[9px] font-bold text-slate-400 ml-1">{comm.time}</span>
                       </div>
                       <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-2">"{comm.bodi}"</p>
                    </div>
                  ))}
               </div>
               <button 
                  onClick={() => navigate("/tanya-ai")}
                  className="w-full mt-6 py-4 bg-white border border-blue-100 text-blue-600 text-xs font-black rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-sm"
               >
                  Tanya AI Tutor <Send size={14} />
               </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Notes Toggle */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowNotes(!showNotes)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] shadow-2xl flex items-center justify-center z-[150] group hover:bg-blue-600 transition-colors cursor-pointer print:hidden"
      >
        {showNotes ? <X size={28} /> : <History size={28} />}
        <div className="absolute -top-12 right-0 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
           Buka Catatan Belajar
        </div>
      </motion.button>

      {/* Floating Notes Panel */}
      <AnimatePresence>
         {showNotes && (
           <motion.div 
             initial={{ opacity: 0, x: 100, scale: 0.9 }}
             animate={{ opacity: 1, x: 0, scale: 1 }}
             exit={{ opacity: 0, x: 100, scale: 0.9 }}
             className="fixed bottom-28 right-10 w-80 bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden flex flex-col z-[150] print:hidden"
           >
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <History size={18} className="text-blue-400" />
                    <h4 className="text-sm font-black uppercase tracking-widest">Catatan Pribadi</h4>
                 </div>
                 <button onClick={() => setShowNotes(false)}>
                    <X size={18} className="text-slate-500 hover:text-white" />
                 </button>
              </div>
              <div className="p-6 space-y-4">
                 <p className="text-[10px] text-slate-400 font-bold leading-relaxed italic">
                    Ketik poin-poin penting yang kamu dapatkan hari ini. Catatan akan tersimpan otomatis.
                 </p>
                 <textarea 
                    value={privateNotes}
                    onChange={(e) => setPrivateNotes(e.target.value)}
                    placeholder="Tulis catatanmu di sini..."
                    className="w-full h-64 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                 />
                 <button 
                   onClick={() => setShowNotes(false)}
                   className="w-full py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                 >
                    Selesai & Simpan
                 </button>
              </div>
           </motion.div>
         )}
      </AnimatePresence>

      {/* Edit Modal (Existing) */}
      <AnimatePresence>
        {isEditMode && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsEditMode(false)}
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
                         <Edit size={24} />
                      </div>
                      <div>
                         <h3 className="text-xl font-bold text-slate-800 tracking-tight">Edit Materi Pembelajaran</h3>
                         <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Update konten dan video untuk siswa</p>
                      </div>
                   </div>
                   <button onClick={() => setIsEditMode(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                      <X size={24} />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul Materi</label>
                      <input 
                        type="text" 
                        value={editForm.judul}
                        onChange={(e) => setEditForm(prev => ({ ...prev, judul: e.target.value }))}
                        className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-black"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Link Video YouTube</label>
                      <input 
                        type="text" 
                        value={editForm.link_video}
                        onChange={(e) => setEditForm(prev => ({ ...prev, link_video: e.target.value }))}
                        className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm font-mono"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi Singkat</label>
                      <textarea 
                        value={editForm.deskripsi}
                        onChange={(e) => setEditForm(prev => ({ ...prev, deskripsi: e.target.value }))}
                        className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm min-h-[120px] leading-relaxed font-medium"
                      />
                   </div>
                </div>

                <div className="p-8 border-t border-slate-50 flex items-center justify-end gap-3 bg-slate-50/50">
                   <button 
                     onClick={() => setIsEditMode(false)}
                     className="px-8 py-3 text-sm font-black text-slate-500 hover:bg-slate-100 rounded-2xl transition-colors uppercase tracking-widest"
                   >
                     Batal
                   </button>
                   <button 
                     onClick={handleSaveEdit}
                     className="px-10 py-5 bg-blue-600 text-white font-black rounded-[2rem] shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-widest"
                   >
                     <Save size={18} />
                     Simpan Perubahan
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

