/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Materi from "./pages/Materi";
import Tugas from "./pages/Tugas";
import TanyaAI from "./pages/TanyaAI";
import Login from "./pages/Login";
import Absensi from "./pages/Absensi";
import AbsensiSiswa from "./pages/AbsensiSiswa";
import RekapAbsensi from "./pages/RekapAbsensi";
import RekapGuru from "./pages/RekapGuru";
import RekapSiswa from "./pages/RekapSiswa";
import Profil from "./pages/Profil";
import Administrasi from "./pages/Administrasi";
import KoreksiTugas from "./pages/KoreksiTugas";
import MateriDetail from "./pages/MateriDetail";
import ManajemenKelas from "./pages/ManajemenKelas";
import KelasDetail from "./pages/KelasDetail";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("lentera_logged_in") === "true";
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};

export default function App() {
  const isLoggedIn = localStorage.getItem("lentera_logged_in") === "true";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/materi" element={<Materi />} />
                  <Route path="/tugas" element={<Tugas />} />
                  <Route path="/tanya-ai" element={<TanyaAI />} />
                  <Route path="/absensi" element={<Absensi />} />
                  <Route path="/app/absensi-siswa" element={<AbsensiSiswa />} />
                  <Route path="/rekap-absensi" element={<RekapAbsensi />} />
                  <Route path="/app/rekap/guru" element={<RekapGuru />} />
                  <Route path="/app/rekap/siswa" element={<RekapSiswa />} />
                  <Route path="/profil" element={<Profil />} />
                  <Route path="/administrasi" element={<Administrasi />} />
                  <Route path="/manajemen-kelas" element={<ManajemenKelas />} />
                  <Route path="/kelas/:id" element={<KelasDetail />} />
                  <Route path="/koreksi-tugas" element={<KoreksiTugas />} />
                  <Route path="/materi/:id" element={<MateriDetail />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
