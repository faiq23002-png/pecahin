/**
 * Data Tips & Trik Edukatif untuk Maskot Pendamping Interaktif (MPI).
 * Menghubungkan diagnosis miskonsepsi di Rapor dengan tips interaktif Peco & Pica.
 */

export interface MiskonsepsiTip {
  id: string;
  nama: string;
  judulTips: string;
  trikSingkat: string;
  penjelasan: string;
  contoh: string;
  emoji: string;
  lapak: string;
}

export const TIPS_MISKONSEPSI: Record<string, MiskonsepsiTip> = {
  M1A: {
    id: "M1A",
    nama: "Salah menghitung bagian terarsir",
    judulTips: "Trik Hitung Arsir Telunjuk 👆",
    trikSingkat: "Sentuh dan hitung dulu bagian yang BERWARNA, baru hitung SEMUA potongan!",
    penjelasan:
      "Kadang kita tidak sengaja menghitung bagian putih yang kosong. Ingat ya, pembilang (angka atas) HANYA untuk potongan yang diwarnai/diambil!",
    contoh: "Jika ada 3 potong merah dari total 4 potong, pecahannya adalah 3/4 (bukan 1/4).",
    emoji: "🎨",
    lapak: "Lapak 1",
  },
  M1B: {
    id: "M1B",
    nama: "Tertukar pembilang & penyebut",
    judulTips: "Jembatan Keledai: Pembilang di Atas! 🪜",
    trikSingkat: "PEMBILANG di Atas (yang diambil), PENYEBUT di Bawah (Penyangga total)!",
    penjelasan:
      "Ingat kata 'Penyangga' = letaknya di bawah menopang beban. Jadi Penyebut selalu di BAWAH menunjukkan total seluruh bagian potong.",
    contoh: "1 potong dari 4 bagian kue = 1 di atas, 4 di bawah → 1/4 (bukan 4/1).",
    emoji: "📐",
    lapak: "Lapak 1",
  },
  M1C: {
    id: "M1C",
    nama: "Dibagi = pasti sama besar",
    judulTips: "Aturan Pembagian Adil ⚖️",
    trikSingkat: "Pecahan WAJIB dibagi SAMA BESAR, tidak boleh ada yang besar sebelah!",
    penjelasan:
      "Membagi semangka jadi 4 potong belum tentu pecahan kalau ada yang dapat potongan besar dan ada yang kecil. Harus dipotong adil sama rata!",
    contoh: "Potongan semangka adil = 1/4 pecahan sah. Potongan miring beda ukuran = bukan pecahan.",
    emoji: "⚖️",
    lapak: "Lapak 1",
  },
  M1D: {
    id: "M1D",
    nama: "Bagian tidak sama besar tetap pecahan",
    judulTips: "Kacamata Kasir Adil 🧐",
    trikSingkat: "Periksa garis potongnya! Kalau ukurannya beda, itu BUKAN pecahan sah.",
    penjelasan:
      "Jangan terkecoh oleh jumlah garisnya saja. Lihat luas potongannya. Bila satu sisi luas dan satu sisi sempit, itu bukan pecahan yang adil.",
    contoh: "Kue tart yang dipotong asal-asalan tidak bisa dihitung 1/2 atau 1/4.",
    emoji: "🍰",
    lapak: "Lapak 1",
  },
  M1E: {
    id: "M1E",
    nama: "Salah membaca pecahan pada cerita",
    judulTips: "Trik Detektif Cerita Pasar 🕵️",
    trikSingkat: "Cari benda yang dibagi (Penyebut) dan bagian yang diambil pedagang (Pembilang)!",
    penjelasan:
      "Baca kalimat soal perlahan. Angka yang dimakan/dijual adalah pembilang (atas). Jumlah awal semua barang adalah penyebut (bawah).",
    contoh: "'Ibu menjual 2 dari 5 mangga' artinya 2/5 bagian mangga terjual.",
    emoji: "🥭",
    lapak: "Lapak 1",
  },
  M2A: {
    id: "M2A",
    nama: "Penyebut besar = pecahan besar",
    judulTips: "Rahasia Pesta Semangka 🍉",
    trikSingkat: "Makin BESAR penyebut di bawah, potongannya justru makin KECIL!",
    penjelasan:
      "Bayangkan semangka utuh: jika dibagi ke 8 anak (1/8), masing-masing dapat potongan kecil. Kalau cuma dibagi ke 2 anak (1/2), potongannya besar sekali! Jadi 1/2 > 1/8.",
    contoh: "1/4 kue lebih BESAR dan lebih kenyang daripada 1/8 kue.",
    emoji: "🍉",
    lapak: "Lapak 2",
  },
  M2B: {
    id: "M2B",
    nama: "Menolak membandingkan penyebut berbeda",
    judulTips: "Trik Sejajarkan Potongan 📏",
    trikSingkat: "Pecahan beda penyebut BISA dibandingkan dengan melihat ukuran potongannya!",
    penjelasan:
      "Walau bawahnya beda (misal 1/2 dan 2/6), kita tetap bisa bandingkan dengan gambar kue atau menyamakan penyebutnya.",
    contoh: "1/2 semangka itu sama luasnya dengan 3/6 semangka, jadi 1/2 lebih besar dari 2/6.",
    emoji: "🍰",
    lapak: "Lapak 2",
  },
  M2C: {
    id: "M2C",
    nama: "Menyamakan penyebut dengan cara keliru",
    judulTips: "Prinsip Tim Adat Adil 🤝",
    trikSingkat: "Kalau angka bawah dikali 2, angka atas JUGA wajib dikali 2!",
    penjelasan:
      "Atas dan bawah harus diperlakukan sama adil. Mengubah 1/2 menjadi per-4 berarti atas dan bawah sama-sama dikalikan 2 → 2/4.",
    contoh: "1/3 = (1×2)/(3×2) = 2/6. Jangan cuma mengalikan pembilangnya saja ya!",
    emoji: "✨",
    lapak: "Lapak 2",
  },
  M2D: {
    id: "M2D",
    nama: "Pecahan senilai dianggap beda nilai",
    judulTips: "Sulap Kertas Lipat 📄",
    trikSingkat: "Angkanya boleh beda, tapi nilainya BISA SAMA BESAR!",
    penjelasan:
      "Kue 1/2 dipotong lagi di tengah jadi 2/4. Ukuran kue yang kamu makan tidak bertambah, hanya potongannya jadi lebih kecil tapi jumlahnya 2.",
    contoh: "1/2 gelas jus = 2/4 gelas jus = 4/8 gelas jus. Semua sama banyaknya!",
    emoji: "🥤",
    lapak: "Lapak 2",
  },
  M2E: {
    id: "M2E",
    nama: "Salah mengurutkan pecahan",
    judulTips: "Tangga Ukuran Potongan 📶",
    trikSingkat: "Urutkan dari potongan yang paling sedikit dibagi jika pembilangnya sama!",
    penjelasan:
      "Jika pembilang sama-sama 1 (1/2, 1/4, 1/8), urutan dari TERBESAR adalah penyebut paling KECIL: 1/2 > 1/4 > 1/8.",
    contoh: "Urutan dari besar ke kecil: 1/2, 1/3, 1/4, 1/8.",
    emoji: "📊",
    lapak: "Lapak 2",
  },
  M2F: {
    id: "M2F",
    nama: "Pembilang sama = nilai sama",
    judulTips: "Lihat Ukuran Wadahnya! 🥣",
    trikSingkat: "Walau sama-sama angka 1 di atas, periksa angka bawahnya!",
    penjelasan:
      "1/3 mangkok bakso TIDAK SAMA dengan 1/6 mangkok bakso. Angka bawah menentukan seberapa besar tiap sendokannya.",
    contoh: "1/2 loyang kue jauh lebih banyak dari 1/10 loyang kue.",
    emoji: "🥣",
    lapak: "Lapak 2",
  },
  M2G: {
    id: "M2G",
    nama: "Salah arah membandingkan",
    judulTips: "Trik Mulut Buaya Lapar 🐊",
    trikSingkat: "Tanda > selalu MENCAPLOK yang LEBIH BESAR!",
    penjelasan:
      "Mulut tanda (>) atau (<) selalu terbuka lebar ke arah makanan yang lebih banyak. Jangan terbalik ya!",
    contoh: "1/2 > 1/4 (mulut terbuka menghadap 1/2 yang lebih besar).",
    emoji: "🐊",
    lapak: "Lapak 2",
  },
  M3A: {
    id: "M3A",
    nama: "Penyebut ikut dijumlah (silang semua)",
    judulTips: "Hukum Piring Kue Utuh 🍽️",
    trikSingkat: "Penyebut di bawah JANGAN dijumlahkan! Ukuran piringnya tetap sama.",
    penjelasan:
      "Saat menjumlah 1/5 + 2/5, ukuran potongannya tetap per-lima. Cukup tambahkan atasnya: 1 + 2 = 3. Hasilnya 3/5, BUKAN 3/10!",
    contoh: "1 potong semangka (1/4) + 2 potong (2/4) = 3 potong (3/4).",
    emoji: "🍉",
    lapak: "Lapak 3",
  },
  M3B: {
    id: "M3B",
    nama: "Penyebut disamakan sendiri ke pembilang",
    judulTips: "Aturan Kasir Teliti 🧾",
    trikSingkat: "Angka bawah tidak boleh diubah sembarangan tanpa perkalian yang sah!",
    penjelasan:
      "Penyebut yang sudah sama langsung disalin ke hasil akhir. Angka bawah tidak perlu dijumlahkan atau disamakan ke angka atas.",
    contoh: "2/6 + 3/6 = (2+3)/6 = 5/6.",
    emoji: "🧮",
    lapak: "Lapak 3",
  },
  M3C: {
    id: "M3C",
    nama: "Salah baca kata kunci",
    judulTips: "Kamus Kata Kunci Pasar 🔑",
    trikSingkat: "'Membeli lagi' = TAMBAH (+). 'Terjual / Dimakan / Sisa' = KURANG (-)!",
    penjelasan:
      "Lingkari kata kunci di soal cerita. Kalau barangnya bertambah, gunakan tanda tambah (+). Kalau barangnya berkurang atau ditanya sisa, gunakan kurang (-).",
    contoh: "Peco punya 2/4 melon, lalu membeli 1/4 lagi → 2/4 + 1/4 = 3/4 melon.",
    emoji: "🔑",
    lapak: "Lapak 3",
  },
  M3D: {
    id: "M3D",
    nama: "Mengabaikan / menyalin satu suku",
    judulTips: "Gabungkan Semua Pesanan 🧺",
    trikSingkat: "Jangan cuma menyalin angka depan! Hitung semua pecahan yang ada di soal.",
    penjelasan:
      "Jika ada 2/6 + 1/6, jangan lupa menjumlahkan keduanya (2 + 1 = 3), jangan langsung menyalin 2/6 saja.",
    contoh: "1/8 apel + 3/8 apel = (1+3)/8 = 4/8 apel.",
    emoji: "🧺",
    lapak: "Lapak 3",
  },
  M3E: {
    id: "M3E",
    nama: "Mengurangi, bukan menjumlah",
    judulTips: "Cek Tanda Operasi Hitung ➕",
    trikSingkat: "Periksa lambang hitungnya, apakah tanda tambah (+) atau kurang (-)!",
    penjelasan:
      "Hati-hati jangan sampai salah melihat tanda. Tanda tambah (+) berarti bagiannya digabungkan jadi makin banyak.",
    contoh: "3/5 + 1/5 = 4/5 (bukan 2/5).",
    emoji: "➕",
    lapak: "Lapak 3",
  },
  M3F: {
    id: "M3F",
    nama: "Salah menghitung bagian dari kalimat",
    judulTips: "Trik Baca Nyaring Pelan-Pelan 🗣️",
    trikSingkat: "Tuliskan pecahan yang ada di cerita satu per satu di kertas buram!",
    penjelasan:
      "Sebelum menjawab, catat pecahan milik pedagang pertama dan pedagang kedua, lalu perhatikan apa yang ditanyakan di akhir cerita.",
    contoh: "'Pica membawa 2/6 roti, Peco membawa 3/6 roti' → Gabungan = 2/6 + 3/6 = 5/6 roti.",
    emoji: "🥖",
    lapak: "Lapak 3",
  },
};

/**
 * Mengambil daftar tips miskonsepsi berdasarkan riwayat jawaban siswa.
 * Mengurutkan dari miskonsepsi yang paling sering dialami.
 */
export function getTipsMiskonsepsiSiswa(
  riwayat: Array<{ miskonsepsiId?: string }>,
  limit = 10
): MiskonsepsiTip[] {
  const map: Record<string, number> = {};
  for (const r of riwayat) {
    if (r.miskonsepsiId) {
      map[r.miskonsepsiId] = (map[r.miskonsepsiId] || 0) + 1;
    }
  }

  const sortedIds = Object.keys(map).sort((a, b) => map[b] - map[a]);
  const tips: MiskonsepsiTip[] = [];

  for (const id of sortedIds) {
    if (TIPS_MISKONSEPSI[id]) {
      tips.push(TIPS_MISKONSEPSI[id]);
      if (tips.length >= limit) break;
    }
  }

  return tips;
}
