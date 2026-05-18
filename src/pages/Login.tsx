import React, { useState } from "react";
import { LogIn, Lock, User, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { USERS_DB } from "../constants";
import { motion } from "motion/react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"SISWA" | "GURU">("SISWA");
  const [rememberMe, setRememberMe] = useState(false);

  const handlePeekPassword = () => {
    setShowPassword(true);
    setTimeout(() => {
      setShowPassword(false);
    }, 500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate network delay
    setTimeout(() => {
      const user = USERS_DB.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        localStorage.setItem("lentera_logged_in", "true");
        localStorage.setItem("lentera_user", JSON.stringify(user));
        window.location.href = "/";
      } else {
        setError("Username atau password salah. Coba lagi!");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-blue-100 overflow-hidden border border-slate-100"
      >
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-4xl font-black text-blue-900 tracking-tighter text-center italic leading-tight">
                SMKN 46<br />JAKARTA
              </h2>
            </div>
            
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Selamat Datang</h1>

            {/* Role Selection */}
            <div className="mt-8 flex p-1.5 bg-slate-100 rounded-2xl w-fit mx-auto">
              <button
                type="button"
                onClick={() => setRole("SISWA")}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  role === "SISWA"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Siswa
              </button>
              <button
                type="button"
                onClick={() => setRole("GURU")}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  role === "GURU"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Guru
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-300 text-slate-800 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-300 text-slate-800 font-medium"
                />
                <button
                  type="button"
                  onClick={handlePeekPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none"
                  title="Lihat Password"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-lg checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                  />
                  <div className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Ingat Saya</span>
              </label>
              <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline transition-all">
                Lupa Password?
              </a>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-bold border border-red-100"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            <button
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Memproses...
                </>
              ) : "Masuk Sekarang"}
            </button>
            <p className="text-center text-xs text-gray-400 mt-6">
              © 2026 Ruang Siswa Lentera - SMKN 46 JAKARTA. All Rights Reserved.
            </p>
          </form>

        </div>
      </motion.div>
    </div>
  );
}
