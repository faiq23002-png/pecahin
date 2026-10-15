/**
 * Konten PECAH-IN: materi, miskonsepsi, bank soal, tahap maskot,
 * achievement & item toko (sinkron dengan PROPOSAL-PECAH-IN.md §10, §15).
 */
import type {
  Domain,
  Materi,
  Miskonsepsi,
  PilihanJawaban,
  PilihanVisual,
  Soal,
  SoalTipe,
  MaskotStage,
  Achievement,
  ItemToko,
  GameDef,
} from "./types";

/* ============================================================ MATERI */
export const MATERI: Materi[] = [
  { id: "m1", urutan: 1, judul: "Kenal Pecahan & Bagi Rata", fokus: "konsep" },
  { id: "m2", urutan: 2, judul: "Banding, Urut & Senilai", fokus: "prinsip" },
  { id: "m3", urutan: 3, judul: "Jumlah & Cerita", fokus: "verbal" },
];

/* ====================================================== MISKONSEPSI */
export const MISKONSEPSI: Miskonsepsi[] = [
  { id: "M1A", domain: "konsep", nama: "Salah menghitung bagian terarsir", deskripsi: "Menghitung bagian yang tidak diarsir / salah jumlah" },
  { id: "M1B", domain: "konsep", nama: "Tertukar pembilang & penyebut", deskripsi: "Menulis penyebut di atas garis" },
  { id: "M1C", domain: "konsep", nama: "Dibagi = pasti sama besar", deskripsi: "Tidak memeriksa kesamaan ukuran bagian" },
  { id: "M1D", domain: "konsep", nama: "Bagian tidak sama besar tetap pecahan", deskripsi: "Menganggap bagian tak sama besar = pecahan sah" },
  { id: "M1E", domain: "verbal", nama: "Salah membaca pecahan pada cerita", deskripsi: "Tertukar pembilang/penyebut saat membaca kalimat" },
  { id: "M2A", domain: "konsep", nama: "Penyebut besar = pecahan besar", deskripsi: "Menganggap 1/8 > 1/4 karena 8 > 4" },
  { id: "M2B", domain: "konsep", nama: "Menolak membandingkan penyebut berbeda", deskripsi: "Menganggap pecahan beda penyebut tak bisa dibandingkan" },
  { id: "M2C", domain: "prinsip", nama: "Menyamakan penyebut dengan cara keliru", deskripsi: "Hanya mengali pembilang / langsung jadi 1" },
  { id: "M2D", domain: "prinsip", nama: "Pecahan senilai dianggap beda nilai", deskripsi: "1/2 ≠ 2/4 karena angkanya beda" },
  { id: "M2E", domain: "prinsip", nama: "Salah mengurutkan pecahan", deskripsi: "Mengurut tanpa memperhatikan besar bagian" },
  { id: "M2F", domain: "konsep", nama: "Pembilang sama = nilai sama", deskripsi: "Mengabaikan penyebut bila pembilang sama" },
  { id: "M2G", domain: "konsep", nama: "Salah arah membandingkan", deskripsi: "Memilih yang lebih kecil saat diminta lebih besar" },
  { id: "M3A", domain: "prinsip", nama: "Penyebut ikut dijumlah (silang semua)", deskripsi: "(a+c)/(b+b)" },
  { id: "M3B", domain: "prinsip", nama: "Penyebut disamakan sendiri ke pembilang", deskripsi: "(a+c)/(a+c)" },
  { id: "M3C", domain: "verbal", nama: "Salah baca kata kunci", deskripsi: "“sisa” dibaca tambah, dll." },
  { id: "M3D", domain: "prinsip", nama: "Mengabaikan / menyalin satu suku", deskripsi: "a/b + c/b → a/b atau c/b" },
  { id: "M3E", domain: "prinsip", nama: "Mengurangi, bukan menjumlah", deskripsi: "a/b − c/b" },
  { id: "M3F", domain: "verbal", nama: "Salah menghitung bagian dari kalimat", deskripsi: "Mengambil angka salah dari cerita" },
];

/* ============================================================= SOAL */
let seq = 0;
function opt(teks: string, miskonsepsiId?: string, visual?: PilihanVisual): { teks: string; miskonsepsiId?: string; visual?: PilihanVisual } {
  return { teks, miskonsepsiId, visual };
}

function soal(
  id: string,
  materiId: string,
  tipe: SoalTipe,
  domain: Domain,
  teks: string,
  jawabanBenar: string,
  opts: Array<{ teks: string; miskonsepsiId?: string; visual?: PilihanVisual }>,
  extra?: Partial<Soal>,
): Soal {
  const pilihan: PilihanJawaban[] = opts.map((o) => ({
    id: `${id}-${++seq}`,
    teks: o.teks,
    benar: o.teks === jawabanBenar,
    miskonsepsiId: o.miskonsepsiId,
    visual: o.visual,
  }));
  return { id, materiId, tipe, domain, teks, jawabanBenar, pilihan, ...extra };
}

/** Generator penjumlahan M3 (template a/b + c/b), lihat §10.4. */
function genPenjumlahan(id: string, a: number, c: number, b: number): Soal {
  const benar = `${a + c}/${b}`;
  const selisih = Math.abs(a - c);
  const pakaiM3E = a !== c && selisih !== a && selisih !== c;
  return soal(id, "m3", "penjumlahan", "prinsip", `${a}/${b} + ${c}/${b} = …?`, benar, [
    opt(benar),
    opt(`${a + c}/${b + b}`, "M3A"),
    opt(`${a + c}/${a + c}`, "M3B"),
    pakaiM3E ? opt(`${selisih}/${b}`, "M3E") : opt(`${a}/${b}`, "M3D"),
  ], { visual: { shapes: [{ kind: "kue-batang", n: b, k: a }, { kind: "kue-batang", n: b, k: c }], op: "+" } });
}

const BELUM_TAHU = () => opt("🤔 Belum tahu");

export const SOAL: Soal[] = [
  /* ============ M1 — Kenal Pecahan & Bagi Rata (Tema: Buah-Buahan 🍉🍊) ============ */
  soal("m1q1", "m1", "visual", "konsep", "Buah semangka segar dipotong 4 bagian sama besar, 3 bagian diarsir. Pecahannya?", "3/4", [
    opt("3/4"), opt("1/4", "M1A"), opt("4/3", "M1B"), opt("3/3", "M1C"),
  ], { visual: { shapes: [{ kind: "semangka", n: 4, k: 3 }] } }),
  soal("m1q2", "m1", "visual", "konsep", "Buah jeruk segar dipotong 6 bagian sama besar, 2 bagian diarsir. Pecahannya?", "2/6", [
    opt("2/6"), opt("4/6", "M1A"), opt("6/2", "M1B"), opt("3/6", "M1C"),
  ], { visual: { shapes: [{ kind: "jeruk", n: 6, k: 2 }] } }),
  soal("m1q3", "m1", "arsir", "konsep", "Arsirlah 3 dari 8 bagian buah semangka segar!", "3 dari 8", [
    opt("3 dari 8"), opt("5 dari 8", "M1A"), opt("8 dari 3", "M1B"), BELUM_TAHU(),
  ], { interaktif: true, visual: { shapes: [{ kind: "semangka", n: 8, k: 0 }] } }),
  soal("m1q4", "m1", "konsep", "konsep", "Pada pecahan 3/5 potong semangka, angka 5 disebut…?", "penyebut", [
    opt("penyebut"), opt("pembilang", "M1B"), opt("hasil", "M1C"), BELUM_TAHU(),
  ], { visual: { shapes: [{ kind: "semangka", n: 5, k: 3 }] } }),
  soal("m1q5", "m1", "bagi_rata", "konsep", "Buah mana yang dipotong menjadi 4 bagian SAMA BESAR?", "4 bagian sama besar", [
    opt("bukan sama besar", "M1D", { kind: "semangka", parts: 4, equal: false }),
    opt("4 bagian sama besar", undefined, { kind: "semangka", parts: 4, equal: true }),
    opt("3 bagian sama besar", "M1C", { kind: "jeruk", parts: 3, equal: true }),
  ]),
  soal("m1q6", "m1", "bagi_rata", "konsep", "Buah jeruk dipotong 2 tapi ukurannya tidak sama besar. Apakah tiap bagian = 1/2?", "Tidak, harus sama besar", [
    opt("Tidak, harus sama besar"), opt("Ya, tetap 1/2", "M1D"), opt("Ya, asal sudah dibagi 2", "M1C"), BELUM_TAHU(),
  ], { visual: { shapes: [{ kind: "jeruk", n: 2, k: 1 }] } }),
  soal("m1q7", "m1", "visual", "konsep", "Buah semangka dibagi 8 bagian sama besar, 5 diarsir. Pecahannya?", "5/8", [
    opt("5/8"), opt("3/8", "M1A"), opt("8/5", "M1B"), BELUM_TAHU(),
  ], { visual: { shapes: [{ kind: "semangka", n: 8, k: 5 }] } }),
  soal("m1q8", "m1", "arsir", "konsep", "Arsirlah 2 dari 6 bagian buah jeruk segar!", "2 dari 6", [
    opt("2 dari 6"), opt("4 dari 6", "M1A"), opt("6 dari 2", "M1B"), BELUM_TAHU(),
  ], { interaktif: true, visual: { shapes: [{ kind: "jeruk", n: 6, k: 0 }] } }),
  soal("m1q9", "m1", "konsep", "konsep", "Pada pecahan 2/7 potong semangka, angka 2 disebut…?", "pembilang", [
    opt("pembilang"), opt("penyebut", "M1B"), opt("jumlah seluruh bagian", "M1C"), BELUM_TAHU(),
  ], { visual: { shapes: [{ kind: "semangka", n: 7, k: 2 }] } }),
  soal("m1q10", "m1", "cerita", "verbal", "Ibu memotong semangka jadi 3 potong sama besar. Dina ambil 1 potong. Berapa bagian semangka Dina?", "1/3", [
    opt("1/3"), opt("3/1", "M1E"), opt("2/3", "M1A"), opt("semua potong", "M3C"),
  ], { kataKunci: ["memotong"], visual: { shapes: [{ kind: "semangka", n: 3, k: 1 }] } }),

  /* ============ M2 — Banding, Urut & Senilai (Tema: Kue & Jajan Pasar 🍰🍕🍞🍫🧀) ============ */
  soal("m2q1", "m2", "banding", "konsep", "Mana porsi kue tart yang lebih besar: 1/2 atau 1/4?", "1/2", [
    opt("1/2"), opt("1/4", "M2A"), opt("sama besar", "M2F"), opt("tidak bisa dibandingkan", "M2B"),
  ], { visual: { shapes: [{ kind: "kue-tart", n: 2, k: 1 }, { kind: "kue-tart", n: 4, k: 1 }], op: "vs" } }),
  soal("m2q2", "m2", "banding", "konsep", "Mana porsi pizza yang lebih besar: 2/5 atau 4/5?", "4/5", [
    opt("4/5"), opt("2/5", "M2G"), opt("sama besar", "M2F"), BELUM_TAHU(),
  ], { visual: { shapes: [{ kind: "pizza", n: 5, k: 2 }, { kind: "pizza", n: 5, k: 4 }], op: "vs" } }),
  soal("m2q3", "m2", "banding", "konsep", "Mana potongan roti yang lebih kecil: 1/3 atau 1/2?", "1/3", [
    opt("1/3"), opt("1/2", "M2A"), opt("sama besar", "M2F"), BELUM_TAHU(),
  ], { visual: { shapes: [{ kind: "roti", n: 3, k: 1 }, { kind: "roti", n: 2, k: 1 }], op: "vs" } }),
  soal("m2q4", "m2", "urut", "prinsip", "Urutkan porsi kue dari yang TERKECIL: 1/2, 1/8, 1/4!", "1/8 < 1/4 < 1/2", [
    opt("1/8 < 1/4 < 1/2"), opt("1/2 < 1/4 < 1/8", "M2E"), opt("1/2 < 1/8 < 1/4", "M2E"), BELUM_TAHU(),
  ], { visual: { shapes: [{ kind: "kue-tart", n: 8, k: 1 }, { kind: "kue-tart", n: 4, k: 1 }, { kind: "kue-tart", n: 2, k: 1 }] } }),
  soal("m2q5", "m2", "urut", "prinsip", "Urutkan cokelat dari yang TERBESAR: 3/4, 1/4, 2/4!", "3/4 > 2/4 > 1/4", [
    opt("3/4 > 2/4 > 1/4"), opt("1/4 < 2/4 < 3/4", "M2E"), opt("2/4 < 3/4 < 1/4", "M2E"), BELUM_TAHU(),
  ], { visual: { shapes: [{ kind: "cokelat", n: 4, k: 3 }, { kind: "cokelat", n: 4, k: 2 }, { kind: "cokelat", n: 4, k: 1 }] } }),
  soal("m2q6", "m2", "senilai", "prinsip", "1/2 loyang kue tart senilai dengan…?", "2/4", [
    opt("2/4"), opt("1/3", "M2C"), opt("tidak ada yang sama", "M2D"), BELUM_TAHU(),
  ], { visual: { shapes: [{ kind: "kue-tart", n: 2, k: 1 }, { kind: "kue-tart", n: 4, k: 2 }], op: "vs" } }),
  soal("m2q7", "m2", "senilai", "prinsip", "2/4 loyang pizza senilai dengan…?", "1/2", [
    opt("1/2"), opt("2/3", "M2C"), opt("tidak ada yang sama", "M2D"), BELUM_TAHU(),
  ], { visual: { shapes: [{ kind: "pizza", n: 4, k: 2 }, { kind: "pizza", n: 2, k: 1 }], op: "vs" } }),
  soal("m2q8", "m2", "senilai", "prinsip", "3/6 potong roti senilai dengan…?", "1/2", [
    opt("1/2"), opt("3/3", "M2C"), opt("tidak ada yang sama", "M2D"), BELUM_TAHU(),
  ], { visual: { shapes: [{ kind: "roti", n: 6, k: 3 }, { kind: "roti", n: 2, k: 1 }], op: "vs" } }),
  soal("m2q9", "m2", "konsep", "konsep", "Mengapa 1/8 potong keju lebih kecil dari 1/4 potong keju?", "karena dibagi jadi lebih banyak bagian sama besar", [
    opt("karena dibagi jadi lebih banyak bagian sama besar"), opt("karena 8 lebih besar dari 4", "M2A"), opt("karena angkanya lebih besar", "M2A"), BELUM_TAHU(),
  ], { visual: { shapes: [{ kind: "keju", n: 8, k: 1 }, { kind: "keju", n: 4, k: 1 }], op: "vs" } }),
  soal("m2q10", "m2", "senilai", "prinsip", "Apakah 2/6 dan 4/12 potong cokelat sama nilainya?", "Ya, sama", [
    opt("Ya, sama"), opt("Tidak, karena penyebutnya beda", "M2D"), opt("Ya, tapi nilainya jadi lebih besar", "M2C"), BELUM_TAHU(),
  ], { visual: { shapes: [{ kind: "cokelat", n: 6, k: 2 }, { kind: "cokelat", n: 12, k: 4 }], op: "vs" } }),

  /* ============ M3 — Jumlah & Cerita (Tema: Roti Batang, Kue & Cerita Pasar 📜🍞🍰) ============ */
  genPenjumlahan("m3q1", 2, 1, 6),
  genPenjumlahan("m3q2", 1, 2, 4),
  genPenjumlahan("m3q3", 3, 2, 8),
  genPenjumlahan("m3q4", 4, 2, 9),

  soal("m3q5", "m3", "konsep", "prinsip", "Mengapa 2/6 + 1/6 = 3/6, bukan 3/12?", "penyebut tidak ikut dijumlah", [
    opt("penyebut tidak ikut dijumlah"), opt("semua angka dijumlah", "M3A"), opt("6+6 harus jadi 12", "M3A"), opt("penyebut ikut jadi 3", "M3B"),
  ], { visual: { shapes: [{ kind: "kue-batang", n: 6, k: 2 }, { kind: "kue-batang", n: 6, k: 1 }], op: "+" } }),
  soal("m3q6", "m3", "cerita", "verbal", "Siti punya 3/5 roti, lalu membeli lagi 1/5. Berapa total roti Siti?", "4/5", [
    opt("4/5"), opt("4/10", "M3A"), opt("3/5", "M3D"), opt("2/5", "M3E"),
  ], { kataKunci: ["membeli lagi"], visual: { shapes: [{ kind: "roti", n: 5, k: 3 }, { kind: "roti", n: 5, k: 1 }], op: "+" } }),
  soal("m3q7", "m3", "cerita", "verbal", "Andi membaca 3/8 bagian buku cerita pasar, lalu disambung 2/8 lagi. Berapa total yang dibaca?", "5/8", [
    opt("5/8"), opt("5/16", "M3A"), opt("3/8", "M3D"), opt("1/8", "M3E"),
  ], { kataKunci: ["disambung"], visual: { shapes: [{ kind: "kue-batang", n: 8, k: 3 }, { kind: "kue-batang", n: 8, k: 2 }], op: "+" } }),
  soal("m3q8", "m3", "cerita", "verbal", "Roti dipotong 6 bagian sama besar. Ayah ambil 3, Ibu ambil 1. Berapa total yang diambil?", "4/6", [
    opt("4/6"), opt("4/12", "M3A"), opt("3/6", "M3D"), opt("2/6", "M3E"),
  ], { visual: { shapes: [{ kind: "roti", n: 6, k: 3 }, { kind: "roti", n: 6, k: 1 }], op: "+" } }),
  soal("m3q9", "m3", "kata_kunci", "verbal", "Kata kunci mana yang berarti “menambah”?", "membeli lagi", [
    opt("membeli lagi"), opt("sisa", "M3C"), opt("dipotong", "M3C"), opt("dibagi", "M3C"),
  ], { visual: { shapes: [{ kind: "kue-batang", n: 4, k: 1 }] } }),
  soal("m3q10", "m3", "cerita", "verbal", "Kalimat: “3 dari 8 kue di meja pasar sudah dimakan.” Berapa bagian yang dimakan?", "3/8", [
    opt("3/8"), opt("8/3", "M3F"), opt("3/5", "M3F"), BELUM_TAHU(),
  ], { visual: { shapes: [{ kind: "kue-tart", n: 8, k: 3 }] } }),
];


/* ====================================================== TAHAP MASKOT */
export const MASKOT_STAGES: MaskotStage[] = [
  { level: 0, nama: "Pelajar", ambangBintang: 0 },
  { level: 1, nama: "Detektif Muda", ambangBintang: 25 },
  { level: 2, nama: "Ahli Pecahan", ambangBintang: 60 },
  { level: 3, nama: "Profesor", ambangBintang: 100 },
];

/** Level maskot dari total poin (evolusi murni dari poin, maks 100). */
export function levelDariPoin(poin: number): number {
  let level = 0;
  for (const s of MASKOT_STAGES) if (poin >= s.ambangBintang) level = s.level;
  return level;
}

/* ==================================================== ACHIEVEMENT */
export const ACHIEVEMENTS: Achievement[] = [
  { id: "jago-bagi-rata", nama: "Jago Bagi Rata", deskripsi: "Selesaikan Materi 1", ikon: "🏅" },
  { id: "ahli-banding-senilai", nama: "Ahli Banding & Senilai", deskripsi: "Selesaikan Materi 2", ikon: "🏅" },
  { id: "detektif-cerita", nama: "Detektif Cerita", deskripsi: "Selesaikan Materi 3", ikon: "🏅" },
  { id: "profesor-pecah", nama: "Profesor Pecah", deskripsi: "Selesaikan Tantangan Campuran", ikon: "🏆" },
  { id: "kolektor-bintang", nama: "Kolektor Bintang", deskripsi: "Kumpulkan 50 bintang", ikon: "⭐" },
];

/* ====================================================== ITEM TOKO SOUVENIR & BAHAN PASAR (20 ITEM, TOTAL 100 KOIN) */
export const ITEM_TOKO: ItemToko[] = [
  // BUAH (6 item)
  { id: "buah-semangka", nama: "Semangka", jenis: "buah", hargaKoin: 5, ikon: "🍉", deskripsi: "Potongan semangka 1/4" },
  { id: "buah-jeruk", nama: "Jeruk Manis", jenis: "buah", hargaKoin: 5, ikon: "🍊", deskripsi: "Jeruk potong 1/2" },
  { id: "buah-apel", nama: "Apel Merah", jenis: "buah", hargaKoin: 5, ikon: "🍎", deskripsi: "Apel renyah segar" },
  { id: "buah-pisang", nama: "Pisang Saji", jenis: "buah", hargaKoin: 5, ikon: "🍌", deskripsi: "Pisang olahan pasar" },
  { id: "buah-anggur", nama: "Anggur Manis", jenis: "buah", hargaKoin: 5, ikon: "🍇", deskripsi: "Anggur manis segar" },
  { id: "buah-nanas", nama: "Nanas Potong", jenis: "buah", hargaKoin: 5, ikon: "🍍", deskripsi: "Nanas madu 1/8" },

  // KUE & MAKANAN (8 item)
  { id: "kue-tart", nama: "Kue Tart", jenis: "kue", hargaKoin: 5, ikon: "🍰", deskripsi: "Tart pelangi 1/6" },
  { id: "kue-pizza", nama: "Pizza Keju", jenis: "kue", hargaKoin: 5, ikon: "🍕", deskripsi: "Pizza keju 1/8" },
  { id: "kue-roti", nama: "Roti Gandum", jenis: "kue", hargaKoin: 5, ikon: "🍞", deskripsi: "Roti gandum 1/4" },
  { id: "kue-cokelat", nama: "Cokelat Batang", jenis: "kue", hargaKoin: 5, ikon: "🍫", deskripsi: "Cokelat lapak kue" },
  { id: "kue-donut", nama: "Donat Manis", jenis: "kue", hargaKoin: 5, ikon: "🍩", deskripsi: "Donat gula 1/2" },
  { id: "kue-cupcake", nama: "Cupcake", jenis: "kue", hargaKoin: 5, ikon: "🧁", deskripsi: "Cupcake hiasan" },
  { id: "kue-pancake", nama: "Pancake Madu", jenis: "kue", hargaKoin: 5, ikon: "🥞", deskripsi: "Pancake lezat" },
  { id: "kue-waffle", nama: "Waffle Garing", jenis: "kue", hargaKoin: 5, ikon: "🧇", deskripsi: "Waffle renyah" },

  // SOUVENIR & HADIAH (6 item)
  { id: "souvenir-timbangan", nama: "Timbangan", jenis: "souvenir", hargaKoin: 5, ikon: "⚖️", deskripsi: "Timbangan adil" },
  { id: "souvenir-trofi", nama: "Piala Juara", jenis: "souvenir", hargaKoin: 5, ikon: "🏆", deskripsi: "Piala kasir cilik" },
  { id: "souvenir-topi", nama: "Topi Koki", jenis: "souvenir", hargaKoin: 5, ikon: "🧑‍🍳", deskripsi: "Topi kasir hebat" },
  { id: "souvenir-mahkota", nama: "Mahkota", jenis: "souvenir", hargaKoin: 5, ikon: "👑", deskripsi: "Mahkota pedagang" },
  { id: "souvenir-medali", nama: "Medali Emas", jenis: "souvenir", hargaKoin: 5, ikon: "🥇", deskripsi: "Medali kebanggaan" },
  { id: "souvenir-kantong", nama: "Tas Belanja", jenis: "souvenir", hargaKoin: 5, ikon: "🛍️", deskripsi: "Tas pasar ramah" },
];

/* ====================================================== HELPER */
export function getMateri(id: string): Materi | undefined {
  return MATERI.find((m) => m.id === id);
}
export function getMiskonsepsi(id: string): Miskonsepsi | undefined {
  return MISKONSEPSI.find((m) => m.id === id);
}

export function getSoalByMateri(materiId: string): Soal[] {
  return SOAL.filter((s) => s.materiId === materiId);
}

/* ====================================================== PELAJARAN (Belajar & Coba) */
export interface PelajaranBlok {
  judul: string;
  teks: string;
}
export interface MateriPelajaran {
  belajar: PelajaranBlok[];
  coba: PelajaranBlok[];
}

export const PELAJARAN: Record<string, MateriPelajaran> = {
  m1: {
    belajar: [
      { judul: "Bagian dari Keseluruhan", teks: "Pecahan artinya bagian dari sesuatu yang utuh. Semangka dipotong 4 sama besar → tiap potong = 1/4." },
      { judul: "Bagi Sama Besar", teks: "Semua bagian harus SAMA BESAR. Kalau ukurannya beda-beda, itu bukan pecahan." },
      { judul: "Pembilang & Penyebut", teks: "Angka atas = pembilang (bagian yang diambil/diarsir). Angka bawah = penyebut (jumlah semua bagian)." },
    ],
    coba: [
      { judul: "Bagi & Arsir", teks: "Pilih berapa bagian (2–8), lalu arsir sebagian. Temukan pecahan 1/2, 1/3, dan 1/4." },
    ],
  },
  m2: {
    belajar: [
      { judul: "Banding Penyebut Sama", teks: "Kalau penyebutnya sama, tinggal lihat pembilang. 4/5 lebih besar dari 2/5." },
      { judul: "Pembilang Satu", teks: "1/8 lebih kecil dari 1/4 — karena 1 potong dibagi jadi lebih banyak bagian, tiap bagian jadi lebih kecil." },
      { judul: "Pecahan Senilai", teks: "1/2 = 2/4 = 3/6. Nilainya sama, tulisannya berbeda. Ini yang dipakai untuk menyamakan penyebut." },
    ],
    coba: [
      { judul: "Banding & Lipat", teks: "Bandingkan potongan mana yang lebih besar, lalu lipat/timpa bentuk untuk menemukan pecahan senilai." },
    ],
  },
  m3: {
    belajar: [
      { judul: "Jumlahkan Pembilang", teks: "2/6 + 1/6 = 3/6. Pembilang dijumlah (2+1=3), penyebut TETAP (6)." },
      { judul: "Kenapa Penyebut Tidak Dijumlah?", teks: "Penyebut = ukuran potongan. Potongannya tidak berubah, jadi penyebutnya tetap." },
      { judul: "Kata Kunci Cerita", teks: "“membeli lagi”, “disambung”, “total keseluruhan” = operasi menambah." },
    ],
    coba: [
      { judul: "Gabung di Piring", teks: "Gabungkan potongan yang penyebutnya sama ke satu piring, lalu cek hasilnya di garis bilangan." },
    ],
  },
};

/* ====================================================== GAME */
export const GAMES: GameDef[] = [
  { id: "g1", nama: "Bagi Rata & Cocok", materiId: "m1", unlock: "materi_selesai" },
  { id: "g2", nama: "Banding & Jodoh", materiId: "m2", unlock: "materi_selesai" },
  { id: "g3", nama: "Lapak Jualan", materiId: "m3", unlock: "materi_selesai" },
  { id: "gCampuran", nama: "Tantangan Campuran", unlock: "semua_selesai" },
];
