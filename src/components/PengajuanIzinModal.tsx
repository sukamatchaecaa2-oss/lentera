import React, { useState } from "react";
import { X, Upload, CheckCircle, AlertCircle, FileImage, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../lib/supabase";

interface PengajuanIzinModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

export default function PengajuanIzinModal({ isOpen, onClose, userId, userName }: PengajuanIzinModalProps) {
  const [type, setType] = useState<"SAKIT" | "IZIN">("SAKIT");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !file) return;

    setIsSubmitting(true);
    setStatus("IDLE");

    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `permintaan_izin/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('permissions')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Storage error:", uploadError);
        // Fallback for demo if bucket doesn't exist
        if (uploadError.message.includes("not found")) {
           console.warn("Bucket 'permissions' not found. Using mock success for demo.");
        } else {
           throw uploadError;
        }
      }

      const fileUrl = uploadData 
        ? supabase.storage.from('permissions').getPublicUrl(filePath).data.publicUrl 
        : "https://via.placeholder.com/400x300?text=Bukti+Izin";

      // 2. Save to Supabase Table (or simulated)
      const { error: dbError } = await supabase
        .from('pengajuan_izin')
        .insert({
          user_id: userId,
          user_name: userName,
          jenis_izin: type,
          alasan: reason,
          bukti_url: fileUrl,
          status: "PENDING",
          tanggal_pengajuan: new Date().toISOString()
        });

      if (dbError) {
         console.error("Database error:", dbError);
         // Simulate success if table doesn't exist yet
         if (dbError.message.includes("not found")) {
            console.warn("Table 'pengajuan_izin' not found. Storing in local memory for demo.");
            const existing = JSON.parse(localStorage.getItem("pending_izin") || "[]");
            existing.push({
               id: Date.now().toString(),
               user_id: userId,
               user_name: userName,
               jenis_izin: type,
               alasan: reason,
               bukti_url: fileUrl,
               status: "PENDING",
               tanggal_pengajuan: new Date().toLocaleDateString('id-ID')
            });
            localStorage.setItem("pending_izin", JSON.stringify(existing));
            window.dispatchEvent(new CustomEvent("newPermissionRequest"));
         } else {
            throw dbError;
         }
      }

      setStatus("SUCCESS");
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (error) {
      console.error("Error submitting request:", error);
      setStatus("ERROR");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setType("SAKIT");
    setReason("");
    setFile(null);
    setStatus("IDLE");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                  <FileImage size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Pengajuan Izin</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Lengkapi form di bawah ini</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                id="close-izin-modal"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {status === "SUCCESS" ? (
                <div className="py-12 flex flex-col items-center text-center animate-in zoom-in">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h4 className="text-2xl font-black text-slate-800">Berhasil Terkirim!</h4>
                  <p className="text-slate-500 mt-2">Pengajuan izin kamu sedang diproses oleh admin.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jenis Izin</label>
                    <div className="grid grid-cols-2 gap-4">
                      {["SAKIT", "IZIN"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setType(opt as any)}
                          className={`py-4 px-6 rounded-2xl font-bold border-2 transition-all ${
                            type === opt 
                              ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" 
                              : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alasan / Keterangan</label>
                    <textarea
                      required
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Jelaskan alasan pengajuan izin secara singkat..."
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unggah Bukti (Gambar)</label>
                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`p-8 border-2 border-dashed rounded-3xl flex flex-col items-center gap-3 transition-all ${
                        file ? "bg-blue-50 border-blue-400" : "bg-slate-50 border-slate-200 group-hover:border-blue-400 group-hover:bg-blue-50"
                      }`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${file ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-500"}`}>
                          {file ? <CheckCircle size={24} /> : <Upload size={24} />}
                        </div>
                        <div className="text-center">
                          <p className={`text-sm font-bold ${file ? "text-blue-600" : "text-slate-600"}`}>
                            {file ? file.name : "Klik atau seret file gambar ke sini"}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">PNG, JPG up to 5MB</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {status === "ERROR" && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-pulse">
                      <AlertCircle size={18} />
                      Terjadi kesalahan saat mengirim. Coba lagi.
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || !reason || !file}
                      className="w-full py-5 bg-slate-900 text-white font-black rounded-[2rem] hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={24} className="animate-spin" />
                          <span>Mengirim...</span>
                        </>
                      ) : (
                        <>
                          <span>Kirim Pengajuan</span>
                          <CheckCircle size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
