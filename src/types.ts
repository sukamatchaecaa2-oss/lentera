export type Role = "SISWA" | "GURU" | "ADMIN";

export interface Siswa {
  id: string;
  nama: string;
  kelas: string;
  nis: string;
}

export interface AbsensiRecord {
  id: string;
  siswa_id: string;
  guru_id?: string;
  status: "HADIR" | "IZIN" | "SAKIT" | "ALPA";
  tanggal: string;
}

export interface AsetRecord {
  id: string;
  nama_barang: string;
  kategori: string;
  jumlah: number;
  kondisi: "BAIK" | "RUSAK" | "PERBAIKAN";
  tanggal_masuk: string;
}

export interface Profile {
  id: string;
  nama_lengkap: string;
  username: string;
  password?: string;
  kelas?: string;
  nisn?: string;
  avatar_url: string;
  role: Role;
}

export interface Materi {
  id: string;
  judul: string;
  deskripsi: string;
  link_video: string;
  kategori: string;
  thumbnail_url?: string;
}

export interface Tugas {
  id: string;
  judul: string;
  deadline: string;
  status: boolean;
  kategori: string;
  catatan?: string;
  deskripsi?: string;
  instruksi?: string;
}

export interface AIResponse {
  jawaban: string;
  saran_topik_terkait: string[];
}
