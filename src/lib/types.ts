/**
 * Kontrak data PECAH-IN (sinkron dengan PROPOSAL-PECAH-IN.md §12).
 */

export type Gender = "cowo" | "cewe";
export type Domain = "konsep" | "prinsip" | "verbal";
export type SoalTipe =
  | "bagi_rata"
  | "visual"
  | "arsir"
  | "konsep"
  | "banding"
  | "urut"
  | "senilai"
  | "penjumlahan"
  | "cerita"
  | "kata_kunci"
  | "matching"
  | "tebak_operasi"
  | "susun_langkah";
export type StatusTahap = "terkunci" | "terbuka" | "selesai";
export type StatusMateri = "terkunci" | "terbuka" | "selesai";

export type ObjKind = "semangka" | "jeruk" | "kue-tart" | "pizza" | "roti" | "cokelat" | "keju" | "kue-batang";

/** Visual untuk soal (gambar objek pecahan). */
export interface SoalVisual {
  shapes: Array<{ kind: ObjKind; n: number; k: number }>;
  op?: "+" | "vs" | "";
}

export interface Profil {
  nama: string;
  gender: Gender;
  koin: number;
  streak: number;
  lastAktif: string; // "YYYY-MM-DD"
  suaraOn: boolean;
  volumeMusik?: number; // 0..100, default 70
  volumeSfx?: number;   // 0..100, default 80
}

export interface Materi {
  id: string; // "m1" | "m2" | "m3"
  urutan: number; // 1..3
  judul: string;
  fokus: Domain; // label, bukan sumber diagnosis
}

export interface Miskonsepsi {
  id: string; // "M1A" .. "M3G"
  domain: Domain;
  nama: string;
  deskripsi: string;
}

export interface PilihanVisual {
  kind: ObjKind;
  parts: number;
  equal: boolean;
}

export interface PilihanJawaban {
  id: string;
  teks: string;
  benar: boolean;
  miskonsepsiId?: string; // hanya pada pengecoh; "Belum tahu" tanpa ID
  visual?: PilihanVisual; // untuk jawaban bergambar (mis. bagi sama besar)
}

export interface Soal {
  id: string;
  materiId: string;
  tipe: SoalTipe;
  domain: Domain; // domain konsep utama soal
  teks: string;
  jawabanBenar: string; // teks jawaban benar (tampilan/rapor)
  audioPath?: string; // MP3, untuk "dengarkan soal"
  kataKunci?: string[]; // untuk soal cerita
  interaktif?: boolean; // true untuk soal arsir/geser
  visual?: SoalVisual; // gambar objek pecahan (kue/pizza/dll.)
  pilihan: PilihanJawaban[];
}

export interface ProgressMateri {
  materiId: string;
  tahapBelajar: StatusTahap;
  tahapCoba: StatusTahap;
  tahapLatihan: StatusTahap;
  selesai: boolean;
  percobaanLatihan: number; // maks 3
}

export interface RiwayatJawaban {
  id: string;
  soalId: string;
  benar: boolean;
  domain: Domain; // copy dari Soal.domain
  miskonsepsiId?: string; // terisi bila salah & kena pengecoh
  waktu: string; // ISO datetime
}

export interface MaskotStage {
  level: number;
  nama: string; // "Pelajar" | "Detektif Muda" | "Ahli Pecahan" | "Profesor"
  ambangBintang: number;
}

export interface GameDef {
  id: string; // "g1" | "g2" | "g3" | "gCampuran"
  nama: string;
  materiId?: string; // null untuk Tantangan Campuran
  unlock: "materi_selesai" | "semua_selesai";
}

export interface ProfilGame {
  gameId: string;
  skorTerbaik: number;
  koinDihasilkan: number; // akumulasi, dipakai anti-farming
  terakhirMain: string; // "YYYY-MM-DD"
}

export interface ProfilHarian {
  tanggal: string; // "YYYY-MM-DD"
  soalDijawab: number;
  menitAktif: number;
  misiSelesai: boolean;
  bintangHari: number; // cap 12/hari
  koinHari: number; // cap 30/hari
}

export interface Achievement {
  id: string; // diraih otomatis
  nama: string;
  deskripsi: string;
  ikon: string;
}

export interface ItemToko {
  id: string; // dibeli pakai koin
  nama: string;
  jenis: "buah" | "kue" | "souvenir";
  hargaKoin: number;
  ikon: string;
  deskripsi: string;
}

export interface TerakhirDibuka {
  type: "materi" | "game";
  id: string;
  route: string;
  nama: string;
  sub: string;
  emoji: string;
  waktu: string;
}
