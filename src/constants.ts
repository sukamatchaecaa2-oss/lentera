import { Profile, Materi, Tugas, Siswa, AbsensiRecord, AsetRecord } from "./types";

export const MOCK_PROFILE: Profile = {
  id: "1",
  nama_lengkap: "Siswa Berprestasi",
  username: "siswa123",
  password: "password123",
  kelas: "12 IPA 1",
  nisn: "1234567890",
  avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  role: "SISWA",
};

export const MOCK_GURU: Profile = {
  id: "g1",
  nama_lengkap: "Pak Budi, S.Pd",
  username: "guru123",
  password: "password123",
  avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
  role: "GURU",
};

export const USERS_DB: Profile[] = [
  MOCK_PROFILE,
  MOCK_GURU,
  {
    id: "3",
    nama_lengkap: "Andi Saputra",
    username: "andi",
    password: "password123",
    kelas: "12 IPA 1",
    nisn: "1001",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andi",
    role: "SISWA",
  },
  {
    id: "4",
    nama_lengkap: "Siti Aminah",
    username: "siti",
    password: "password123",
    kelas: "12 IPA 2",
    nisn: "1002",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
    role: "SISWA",
  }
];

export const MOCK_SISWA_LIST: Siswa[] = [
  { id: "s1", nama: "Andi Saputra", kelas: "12 IPA 1", nis: "1001" },
  { id: "s2", nama: "Budi Cahyo", kelas: "12 IPA 1", nis: "1002" },
  { id: "s3", nama: "Citra Lestari", kelas: "12 IPA 1", nis: "1003" },
  { id: "s4", nama: "Dedi Irawan", kelas: "12 IPA 2", nis: "1004" },
  { id: "s5", nama: "Eka Putri", kelas: "12 IPA 2", nis: "1005" },
];

export const MOCK_ABSENSI: AbsensiRecord[] = [
  { id: "a1", siswa_id: "1", status: "HADIR", tanggal: "2026-04-28" },
  { id: "a2", siswa_id: "1", status: "HADIR", tanggal: "2026-04-29" },
  { id: "a3", siswa_id: "1", status: "HADIR", tanggal: "2026-04-30" },
  { id: "a4", siswa_id: "3", status: "HADIR", tanggal: "2026-04-30" },
  { id: "a5", siswa_id: "4", status: "IZIN", tanggal: "2026-04-30" },
];

export const MOCK_MATERI: Materi[] = [
  {
    id: "m1",
    judul: "Pengenalan Turunan Fungsi",
    deskripsi: "Belajar konsep dasar turunan dan aplikasinya dalam kehidupan sehari-hari.",
    link_video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    kategori: "Matematika",
  },
  {
    id: "m2",
    judul: "Hukum Newton II",
    deskripsi: "Memahami hubungan antara gaya, massa, dan percepatan.",
    link_video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    kategori: "Fisika",
  },
  {
    id: "m3",
    judul: "Struktur Atom",
    deskripsi: "Menjelajahi penyusun dasar materi dan model atom Dalton hingga Modern.",
    link_video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    kategori: "Kimia",
  },
];

export const MOCK_TUGAS: Tugas[] = [
  {
    id: "t1",
    judul: "Latihan Soal Integral",
    deadline: "2026-05-02",
    status: false,
    kategori: "Matematika",
    catatan: "",
    deskripsi: "Latihan pemahaman konsep integral tak tentu dan integral tentu beserta aplikasinya pada luas daerah.",
    instruksi: "1. Kerjakan soal nomor 1-10 di buku paket halaman 89.\n2. Foto hasil pekerjaanmu.\n3. Unggah dalam format PDF atau JPG."
  },
  {
    id: "t2",
    judul: "Laporan Praktikum Titrasi",
    deadline: "2026-05-05",
    status: false,
    kategori: "Kimia",
    catatan: "",
    deskripsi: "Penyusunan laporan hasil praktikum titrasi asam basa yang telah dilakukan di laboratorium.",
    instruksi: "1. Susun laporan sesuai format (Judul, Tujuan, Alat & Bahan, Langkah, Data, Analisis, Kesimpulan).\n2. Cantumkan foto dokumentasi saat praktikum.\n3. Kumpulkan paling lambat jam 23:59 WIB."
  },
  {
    id: "t3",
    judul: "Esai Sejarah Kemerdekaan",
    deadline: "2026-04-28", // Overdue
    status: true,
    kategori: "Sejarah",
    catatan: "Selesai tepat waktu.",
    deskripsi: "Penulisan esai kritis mengenai peristiwa Rengasdengklok dan maknanya bagi proklamasi kemerdekaan.",
    instruksi: "1. Esai minimal 500 kata.\n2. Gunakan minimal 3 referensi buku atau jurnal.\n3. Format penulisan Times New Roman 12pt, Spasi 1.5."
  },
];

export const MOCK_ASET: AsetRecord[] = [
  { id: "as1", nama_barang: "Proyektor Epson", kategori: "Elektronik", jumlah: 5, kondisi: "BAIK", tanggal_masuk: "2026-01-10" },
  { id: "as2", nama_barang: "Kursi Siswa", kategori: "Mebel", jumlah: 120, kondisi: "BAIK", tanggal_masuk: "2026-02-15" },
  { id: "as3", nama_barang: "Laptop Acer", kategori: "Elektronik", jumlah: 10, kondisi: "RUSAK", tanggal_masuk: "2026-03-05" },
];
