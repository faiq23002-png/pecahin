/** Beranda — desain ulang: hierarki jelas, blok warna solid, aksen "chunky" yang playful. */
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "@/lib/router-context";
import { useApp } from "@/lib/profil-context";
import { MATERI, SOAL, MASKOT_STAGES } from "@/lib/content";
import { getTipsMiskonsepsiSiswa } from "@/lib/miskonsepsi-tips";
import { semuaSelesai } from "@/lib/progress";
import { poinMateri, poinGame, POIN_GAME_MAX, POIN_LATIHAN_MAX, GAME_ROUNDS } from "@/lib/poin";
import { todayStr } from "@/lib/util";
import { sfx } from "@/lib/audio";
import { FractionShape, type ObjKind } from "@/components/FractionShape";
import { BottomNav } from "@/components/BottomNav";
import { Mascot } from "@/components/Mascot";
import { IconLock, IconCoin, IconStar } from "@/components/icons";
import { Awning, Bunting, HangingSign, PriceTag, ClosedSign, Crate, Counter } from "@/components/MarketProps";

const OBJ: Record<string, ObjKind> = { m1: "semangka", m2: "kue-tart", m3: "kue-batang" };
const LAPAK_EMOJI: Record<string, string> = { m1: "🧺", m2: "🍰", m3: "📜" };
const LAPAK_SHORT: Record<string, string> = { m1: "Mengenal Pecahan", m2: "Pecahan Senilai", m3: "Penjumlahan" };

/** Warna aksen per lapak/game — solid, tanpa gradien. */
const TONE = {
  teal: { solid: "bg-teal-700", soft: "bg-teal-50", text: "text-teal-700", bar: "bg-teal-500", ring: "border-teal-700" },
  orange: { solid: "bg-orange-500", soft: "bg-orange-50", text: "text-orange-600", bar: "bg-orange-500", ring: "border-orange-500" },
  violet: { solid: "bg-violet-600", soft: "bg-violet-50", text: "text-violet-700", bar: "bg-violet-500", ring: "border-violet-600" },
  rose: { solid: "bg-rose-500", soft: "bg-rose-50", text: "text-rose-600", bar: "bg-rose-500", ring: "border-rose-500" },
} as const;
type Tone = keyof typeof TONE;
const MATERI_TONE: Record<string, Tone> = { m1: "teal", m2: "orange", m3: "violet" };

function Bar({ value, tone = "teal" }: { value: number; tone?: Tone }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
      <div className={`h-full rounded-full ${TONE[tone].bar} transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

/** Batang Kayu Penggulung Peta Kuno untuk Tema Treasure Scroll */
function WoodenScrollRoller() {
  return (
    <div className="relative mx-auto flex w-full items-center justify-center select-none">
      {/* Knop Kayu Kiri */}
      <div className="h-5 w-3.5 shrink-0 rounded-l-md border-2 border-r-0 border-[#3e2412] bg-gradient-to-b from-[#d97706] via-[#92400e] to-[#451a03] shadow-md" />
      {/* Cincin Emas Kiri */}
      <div className="h-4.5 w-2 shrink-0 border-y-2 border-[#3e2412] bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-700" />
      {/* Batang Utama Kayu Jati */}
      <div className="h-3.5 flex-1 border-2 border-[#3e2412] bg-gradient-to-b from-[#b45309] via-[#78350f] to-[#451a03] shadow-[0_3px_5px_rgba(0,0,0,0.45)]" />
      {/* Cincin Emas Kanan */}
      <div className="h-4.5 w-2 shrink-0 border-y-2 border-[#3e2412] bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-700" />
      {/* Knop Kayu Kanan */}
      <div className="h-5 w-3.5 shrink-0 rounded-r-md border-2 border-l-0 border-[#3e2412] bg-gradient-to-b from-[#d97706] via-[#92400e] to-[#451a03] shadow-md" />
    </div>
  );
}

/** Ornamen Kompas Klasik SVG */
function CompassRose({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <circle cx="32" cy="32" r="26" stroke="#78350f" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.45" />
      <circle cx="32" cy="32" r="18" stroke="#78350f" strokeWidth="1.2" opacity="0.35" />
      <polygon points="32,4 37,27 32,23 27,27" fill="#b91c1c" opacity="0.65" />
      <polygon points="32,60 37,37 32,41 27,37" fill="#78350f" opacity="0.5" />
      <polygon points="4,32 27,27 23,32 27,37" fill="#78350f" opacity="0.5" />
      <polygon points="60,32 37,27 41,32 37,37" fill="#78350f" opacity="0.5" />
      <circle cx="32" cy="32" r="3.5" fill="#78350f" />
    </svg>
  );
}

function SectionHead({ title, hint, action }: { title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3 px-0.5">
      <div className="min-w-0">
        <h2 className="wood-plank inline-block rounded-lg border-2 border-ink px-3 py-1 font-display text-base font-extrabold leading-none text-white shadow-[0_2px_0_#1e293b] [text-shadow:0_1px_0_rgba(0,0,0,.35)]">
          {title}
        </h2>
        {hint && <p className="mt-1.5 text-xs font-bold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.85)]">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export default function Home() {
  const { navigate } = useRouter();
  const { profil, progress, harian, poin, maskotLevel, terakhirDibuka, game, riwayat, modeJuri } = useApp();
  const [toast, setToast] = useState<string | null>(null);
  const [showMascotDialog, setShowMascotDialog] = useState(false);
  const [isMascotMinimized, setIsMascotMinimized] = useState(() => {
    try {
      return localStorage.getItem("mpi_minimized") === "true";
    } catch {
      return false;
    }
  });
  const [dialogIndex, setDialogIndex] = useState(0);

  // Tips Miskonsepsi Siswa yang terdeteksi dari riwayat latihan/soal (MPI Evaluasi Belajar)
  const tipsMiskonsepsi = useMemo(() => getTipsMiskonsepsiSiswa(riwayat, 10), [riwayat]);

  // Pool tips umum/random untuk backup hingga kuota pas 5 tips (atau 6 jika miskonsepsi >= 5)
  const RANDOM_TIPS_POOL = useMemo(() => [
    {
      kategori: "umum" as const,
      badge: "🍉 Rangkuman Lapak 1",
      judul: "Bagian Adil & Sama Besar",
      isi: (
        <p className="text-slate-700 font-semibold leading-relaxed">
          Pecahan itu harus <b>dibagi sama besar</b>! Angka di atas disebut <b>Pembilang</b> (bagian yang diambil), dan di bawah disebut <b>Penyebut</b> (total semua potongan).
        </p>
      ),
    },
    {
      kategori: "umum" as const,
      badge: "🍰 Rahasia Lapak 2",
      judul: "Penyebut Besar vs Ukuran Porsi",
      isi: (
        <p className="text-slate-700 font-semibold leading-relaxed">
          Makin besar penyebutnya, potongan kuenya makin <b>kecil</b> loh! Misalnya <b>1/4 potong</b> lebih besar daripada <b>1/8 potong</b>.
        </p>
      ),
    },
    {
      kategori: "umum" as const,
      badge: "🧺 Aturan Tambah Porsi",
      judul: "Penjumlahan Penyebut Sama",
      isi: (
        <p className="text-slate-700 font-semibold leading-relaxed">
          Saat menjumlahkan pecahan yang penyebutnya sama, cukup jumlahkan <b>angka atasnya</b> saja! Ukuran potongannya tidak bertambah.
        </p>
      ),
    },
    {
      kategori: "umum" as const,
      badge: "📄 Trik Kertas Lipat",
      judul: "Sulap Pecahan Senilai",
      isi: (
        <p className="text-slate-700 font-semibold leading-relaxed">
          Lipat kertas jadi 2 bagian (<b>1/2</b>), lalu lipat lagi jadi 4 (<b>2/4</b>). Luas kertas yang diarsir tetap sama besarnya! Angkanya beda, tapi nilainya tetap sama persis.
        </p>
      ),
    },
    {
      kategori: "umum" as const,
      badge: "🐊 Trik Mulut Buaya",
      judul: "Tanda Lebih Besar (>)",
      isi: (
        <p className="text-slate-700 font-semibold leading-relaxed">
          Ingat mulut buaya lapar! Mulut tanda (<b>&gt;</b>) atau (<b>&lt;</b>) selalu terbuka mencaplok makanan/pecahan yang porsinya <b>lebih banyak</b>!
        </p>
      ),
    },
    {
      kategori: "umum" as const,
      badge: "🔥 Semangat Saudagar Cilik",
      judul: "Ayo Kumpulkan Bintang!",
      isi: (
        <p className="text-slate-700 font-semibold leading-relaxed">
          Hebat banget, {profil.nama}! Kamu sudah mengumpulkan <b>{poin} poin</b>. Terus berlatih agar maskotmu berevolusi ke pangkat tertinggi!
        </p>
      ),
    },
    {
      kategori: "umum" as const,
      badge: "⚖️ Kasir Teliti Pasar",
      judul: "Cek Ulang Sebelum Menjawab",
      isi: (
        <p className="text-slate-700 font-semibold leading-relaxed">
          Kasir hebat selalu teliti! Sebelum memilih jawaban, baca kalimat soal dengan saksama dan periksa apakah diminta bagian yang terarsir atau sisanya.
        </p>
      ),
    },
  ], [profil.nama, poin]);

  // Aturan kuota tips:
  // - Jika miskonsepsi >= 5: tampilkan Top 5 miskonsepsi + 1 tips random = TOTAL 6 TIPS.
  // - Jika miskonsepsi < 5: tampilkan semua miskonsepsi + backup tips random = TOTAL 5 TIPS.
  const allTips = useMemo(() => {
    const list: Array<{
      kategori: "miskonsepsi" | "umum";
      badge: string;
      judul: string;
      sub?: string;
      isi: React.ReactNode;
    }> = [];

    const isLebihDariSamaDengan5 = tipsMiskonsepsi.length >= 5;
    const targetMiskonsepsiCount = isLebihDariSamaDengan5 ? 5 : tipsMiskonsepsi.length;
    const targetTotal = isLebihDariSamaDengan5 ? 6 : 5;

    // 1. Masukkan miskonsepsi siswa (Top 5 jika >= 5, atau seluruhnya jika < 5)
    for (let i = 0; i < targetMiskonsepsiCount; i++) {
      const tip = tipsMiskonsepsi[i];
      list.push({
        kategori: "miskonsepsi",
        badge: `🎯 Trik ${tip.lapak} · Khusus Untukmu`,
        judul: `${tip.emoji} ${tip.judulTips}`,
        sub: tip.nama,
        isi: (
          <div className="space-y-1.5">
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-2 text-[11px] font-bold text-amber-900 leading-snug">
              <span className="font-extrabold text-amber-950">💡 Trik Ingat:</span> {tip.trikSingkat}
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
              {tip.penjelasan}
            </p>
            <div className="rounded-lg bg-teal-50 border border-teal-200 p-1.5 text-[10.5px] font-medium text-teal-900">
              <span className="font-bold text-teal-950">📌 Contoh:</span> {tip.contoh}
            </div>
          </div>
        ),
      });
    }

    // 2. Tambahkan tips random:
    // - Jika miskonsepsi >= 5: menambah 1 tips random penyemangat (jadi pas 6)
    // - Jika miskonsepsi < 5: menutup sisa slot sampai pas 5 tips
    const sisaSlot = targetTotal - list.length;
    if (sisaSlot > 0) {
      for (let i = 0; i < sisaSlot && i < RANDOM_TIPS_POOL.length; i++) {
        list.push(RANDOM_TIPS_POOL[i]);
      }
    }

    return list;
  }, [tipsMiskonsepsi, RANDOM_TIPS_POOL]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  // Lock body scroll when MPI dialog is open
  useEffect(() => {
    if (showMascotDialog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMascotDialog]);

  if (!profil) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-krim p-6">
        <button
          onClick={() => navigate("profil")}
          className="rounded-2xl bg-orange-500 px-8 py-4 font-display text-lg font-bold text-white shadow-[0_5px_0_#c2410c] transition active:translate-y-[3px] active:shadow-[0_2px_0_#c2410c]"
        >
          Mulai
        </button>
      </div>
    );
  }

  const today = harian[todayStr()];
  const soalHariIni = today?.soalDijawab ?? 0;
  const aktifFallback = MATERI.find((m) => progress[m.id]?.tahapBelajar !== "terkunci" && !progress[m.id]?.selesai) ?? MATERI[0];

  /* ---------- Data materi ---------- */
  const materiRows = MATERI.map((m) => {
    const ids = SOAL.filter((s) => s.materiId === m.id).map((s) => s.id);
    const p = progress[m.id];
    const tahapSelesai =
      (p?.tahapBelajar === "selesai" ? 1 : 0) + (p?.tahapCoba === "selesai" ? 1 : 0) + (p?.tahapLatihan === "selesai" ? 1 : 0);
    return {
      ...m,
      poin: poinMateri(riwayat, ids),
      total: ids.length || 10,
      tahapSelesai,
      selesai: !!p?.selesai,
      terkunci: p?.tahapBelajar === "terkunci" && !modeJuri,
      tone: MATERI_TONE[m.id] ?? "teal",
    };
  });
  const poinMateriTotal = materiRows.reduce((a, m) => a + m.poin, 0);

  /* ---------- Data game (aturan lock/unlock tetap) ---------- */
  const gameCards: Array<{
    id: string; nama: string; desc: string; emoji: string; route: string; terkunci: boolean; syarat: string; skor: number; tone: Tone;
  }> = [
      { id: "g1", nama: "Bagi Rata", desc: "Potong buah sama besar", emoji: "🍉", route: "game-bagi-rata", terkunci: !progress["m1"]?.selesai && !modeJuri, syarat: "Selesaikan Lapak 1", skor: game["g1"]?.skorTerbaik ?? 0, tone: "teal" },
      { id: "g2", nama: "Banding & Senilai", desc: "Cari pasangan senilai", emoji: "🍰", route: "game-banding-jodoh", terkunci: !progress["m2"]?.selesai && !modeJuri, syarat: "Selesaikan Lapak 2", skor: game["g2"]?.skorTerbaik ?? 0, tone: "rose" },
      { id: "g3", nama: "Tambah Porsi", desc: "Jumlahkan pesanan", emoji: "🧺", route: "game-lapak-jualan", terkunci: !progress["m3"]?.selesai && !modeJuri, syarat: "Selesaikan Lapak 3", skor: game["g3"]?.skorTerbaik ?? 0, tone: "violet" },
      { id: "gCampuran", nama: "Grand Bazar", desc: "Tantangan semua materi", emoji: "🏆", route: "game-campuran", terkunci: !semuaSelesai(progress) && !modeJuri, syarat: "Selesaikan semua lapak", skor: game["gCampuran"]?.skorTerbaik ?? 0, tone: "teal" },
    ];
  const poinGameTotal = poinGame(game);

  /* ---------- Maskot & target berikutnya ---------- */
  const stageNow = MASKOT_STAGES.find((s) => s.level === maskotLevel) ?? MASKOT_STAGES[0];
  const stageNext = MASKOT_STAGES.find((s) => s.ambangBintang > poin);

  /* ---------- Hero: item terakhir dibuka ---------- */
  const hero = terakhirDibuka ?? {
    type: "materi" as const,
    id: aktifFallback.id,
    route: `materi${aktifFallback.urutan}`,
    nama: aktifFallback.judul,
    sub: `Lapak ${aktifFallback.urutan}`,
    emoji: LAPAK_EMOJI[aktifFallback.id] ?? "🏪",
    waktu: "",
  };
  const heroIsGame = hero.type === "game";
  const heroTone: Tone = heroIsGame ? "orange" : MATERI_TONE[hero.id] ?? "teal";
  const heroShadow = heroTone === "orange" ? "#c2410c" : heroTone === "violet" ? "#5b21b6" : "#0b5650";

  const tapLocked = (msg: string) => {
    sfx("wrong");
    setToast(`🔒 ${msg} dulu, ya!`);
  };

  return (
    <div className="min-h-screen pb-36 select-none relative">
      {/* Background Pasar Beranda */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <img
          src="/bghome.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
          style={{ transform: "translateZ(0)" }}
        />
        <div className="absolute inset-0 bg-slate-900/25 pointer-events-none" />
      </div>

      {/* ================= GERBANG PASAR ATAP & JUDUL (FIXED TOP) ================= */}
      <div className="sticky top-0 z-30 w-full select-none">
        <Awning tone="orange" height={32} stripe={22} light="#fef08a" />
        <div className="-mt-1.5 flex justify-center pb-1">
          <HangingSign rope={10} className="px-3 py-0.5">
            <img
              src="/judul-pecahin.png"
              alt="PECAH-IN"
              className="h-8 sm:h-9 w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            />
          </HangingSign>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4">
        {/* ================= HEADER PROFIL ================= */}
        <header className="flex items-center gap-3 pt-3 pb-4">
          <button
            type="button"
            onClick={() => navigate("rumah-maskot")}
            aria-label="Buka rumah maskot"
            className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border-2 border-ink bg-amber-100 shadow-[0_3px_0_#1e293b] transition active:translate-y-[2px] active:shadow-[0_1px_0_#1e293b]"
          >
            <Mascot gender={profil.gender} level={maskotLevel} size={48} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold text-amber-200 [text-shadow:0_1px_2px_rgba(0,0,0,0.9)]">Pedagang cilik hari ini</p>
            <h1 className="truncate font-display text-2xl font-extrabold leading-tight text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.9)]">{profil.nama}</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate("stiker")}
            className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-amber-300 px-3 py-1.5 shadow-[0_3px_0_#1e293b] transition active:translate-y-[2px] active:shadow-[0_1px_0_#1e293b]"
            aria-label={`Koin: ${profil.koin}. Buka toko`}
          >
            <IconCoin size={16} className="text-amber-800" />
            <span className="font-display text-base font-extrabold tabular-nums text-ink">{profil.koin}</span>
          </button>
        </header>

        {/* ================= HERO: GULUNGAN PETA HARTA SAUDAGAR (TREASURE SCROLL) ================= */}
        <section className="relative my-2 select-none">
          {/* Batang Kayu Penggulung Atas */}
          <WoodenScrollRoller />

          {/* Lembaran Perkamen Kuno Khas Peta Saudagar */}
          <div
            className="relative mx-1.5 border-x-4 border-[#5c3418] bg-[#f7e6c4] px-4 py-4 shadow-[inset_0_0_24px_rgba(146,64,14,0.3),0_8px_20px_rgba(0,0,0,0.35)]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(120, 53, 15, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(217, 119, 6, 0.12), transparent 20%, transparent 80%, rgba(120, 53, 15, 0.2))",
              backgroundSize: "16px 16px, 100% 100%",
            }}
          >
            {/* Ornamen Kompas Mawar Transparan di Sudut Kertas */}
            <CompassRose className="pointer-events-none absolute top-2 right-2 h-14 w-14" />

            {/* Bingkai Jahitan Tinta Klasik Perkamen */}
            <div className="rounded-2xl border-2 border-dashed border-[#92400e]/50 p-3.5 bg-[#fdf5e2]/60">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  {/* Badge Segel Status Perkamen */}
                  <div className="inline-flex items-center gap-1.5 rounded-md border border-[#451a03] bg-gradient-to-r from-amber-300 to-yellow-400 px-2.5 py-0.5 text-[10px] font-black uppercase text-[#451a03] shadow-xs">
                    <span>🧭</span>
                    <span>{heroIsGame ? "Panggung Permainan" : terakhirDibuka ? "Pos Terakhir Dibuka" : "Mulai Petualangan"}</span>
                  </div>

                  <h2 className="mt-2 font-display text-lg font-black leading-tight text-[#3e2412]">
                    {hero.nama}
                  </h2>
                  <p className="mt-0.5 text-xs font-bold text-[#78350f]">{hero.sub}</p>
                </div>

                {/* Segel Medali Pajangan Objek Pecahan */}
                <div className="relative shrink-0">
                  <div className="grid h-20 w-20 place-items-center rounded-2xl border-2 border-[#451a03] bg-[#fffbeb] p-2.5 shadow-[0_3px_0_#451a03]">
                    {!heroIsGame && OBJ[hero.id] ? (
                      <FractionShape kind={OBJ[hero.id]} n={4} k={3} />
                    ) : (
                      <span className="text-4xl" aria-hidden>{hero.emoji}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tombol Aksi Khas Ekspedisi Peta Harta */}
              <button
                type="button"
                onClick={() => {
                  sfx("pop");
                  navigate(hero.route);
                }}
                className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#451a03] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 py-3 font-display text-sm font-black text-[#451a03] shadow-[0_4px_0_#451a03] transition active:translate-y-[2px] active:shadow-[0_2px_0_#451a03]"
              >
                <span>{heroIsGame ? "🎪 Buka Lapak Permainan" : "🧭 Lanjutkan Ekspedisi"}</span>
                <Arrow />
              </button>
            </div>
          </div>

          {/* Batang Kayu Penggulung Bawah */}
          <WoodenScrollRoller />
        </section>

        {/* ================= PROGRES ================= */}
        <section className="mt-6">
          <SectionHead title="Buku Catatan Lapak" hint={`${soalHariIni} transaksi soal hari ini`} />

          <div
            className="overflow-hidden rounded-3xl border-2 border-[#451a03] bg-[#fbf4e2] shadow-[0_5px_0_#451a03]"
          >
            {/* Header Jurnal Ekspedisi Vintage */}
            <div className="flex items-center justify-between border-b-2 border-[#451a03] bg-gradient-to-r from-[#78350f] via-[#92400e] to-[#78350f] px-4 py-2.5 text-[#fef3c7] shadow-inner">
              <div className="flex items-center gap-2">
                <span className="text-lg" aria-hidden>📜</span>
                <span className="font-display text-xs font-black uppercase tracking-wider text-[#fef3c7] [text-shadow:0_1px_1px_rgba(0,0,0,0.6)]">
                  Jurnal Ekspedisi Saudagar
                </span>
              </div>
              <span className="rounded-full border border-amber-400/40 bg-amber-950/40 px-2 py-0.5 text-[10px] font-black text-amber-200">
                Catatan Harian
              </span>
            </div>

            {/* Papan atas: Timbangan / Neraca Poin Pasar */}
            <div className="relative overflow-hidden border-b-2 border-dashed border-[#b45309]/30 bg-gradient-to-b from-[#fffefc] to-[#fbf4e2] p-4">
              {/* Faded compass watermark */}
              <div className="pointer-events-none absolute -right-6 -bottom-6 opacity-10">
                <CompassRose className="h-32 w-32" />
              </div>

              <div className="relative z-10 flex items-center gap-4">
                {/* Meteran Neraca / Timbangan Pasar */}
                <div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-2xl border-2 border-[#78350f] bg-gradient-to-b from-amber-100 to-amber-200 shadow-[0_3px_0_#451a03]">
                  <svg viewBox="0 0 36 36" className="absolute inset-2 -rotate-90" aria-hidden>
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#fcd34d" strokeWidth="3.5" opacity="0.4" />
                    <circle
                      cx="18" cy="18" r="14" fill="none" stroke="#b45309" strokeWidth="3.5" strokeLinecap="round"
                      strokeDasharray={`${(poin / 100) * 88} 88`}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="text-center leading-none z-10">
                    <span className="text-[9px] block font-extrabold text-[#78350f] uppercase tracking-tighter">Hasil</span>
                    <div className="font-display text-2xl font-black tabular-nums text-[#451a03]">{poin}</div>
                    <div className="text-[9px] font-black text-[#92400e]/80">/ 100</div>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base" aria-hidden>⚖️</span>
                    <span className="font-display text-base font-extrabold text-[#451a03]">{stageNow.nama}</span>
                    <span className="ml-auto rounded-lg border border-[#b45309]/60 bg-amber-200/80 px-2 py-0.5 text-[10px] font-black text-[#78350f] shadow-xs">
                      Peringkat
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold leading-snug text-[#78350f]/85">
                    {stageNext ? (
                      <>
                        <b className="text-[#b45309] font-black">{stageNext.ambangBintang - poin} poin lagi</b> untuk naik pangkat ke <b>{stageNext.nama}</b>
                      </>
                    ) : (
                      "🏆 Saudagar Legendaris! Pangkat tertinggi tercapai."
                    )}
                  </p>

                  {/* Badge Rekap Hasil Pasar */}
                  <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] font-bold">
                    <span className="inline-flex items-center gap-1 rounded-lg border border-[#b45309]/30 bg-[#fef8ea] px-2 py-0.5 text-[#78350f] shadow-xs">
                      <span>🍉 Lapak:</span>
                      <b className="tabular-nums text-[#451a03] font-black">{poinMateriTotal}/{POIN_LATIHAN_MAX}</b>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg border border-[#b45309]/30 bg-[#fef8ea] px-2 py-0.5 text-[#78350f] shadow-xs">
                      <span>🎪 Game:</span>
                      <b className="tabular-nums text-[#451a03] font-black">{poinGameTotal}/70</b>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rincian per lapak pasar */}
            <div className="p-4 bg-[#faf2de]/75">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#78350f]">
                  <span>🗺️</span> Rute Penjelajahan Lapak
                </span>
                <span className="text-[10px] font-bold text-[#92400e]/80">Skor Latihan</span>
              </div>
              <ul className="space-y-2">
                {materiRows.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center gap-3 rounded-2xl border-2 border-[#b45309]/25 bg-[#fffdfa] p-2.5 shadow-xs transition hover:border-[#b45309]"
                  >
                    <Crate size={40} className="shrink-0">
                      {LAPAK_EMOJI[m.id]}
                    </Crate>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-xs font-extrabold text-[#451a03]">{LAPAK_SHORT[m.id] ?? m.judul}</span>
                        <span className="shrink-0 text-[11px] font-extrabold tabular-nums">
                          {m.terkunci ? (
                            <span className="inline-flex items-center gap-1 text-stone-400 font-bold">
                              <IconLock size={11} /> Tutup
                            </span>
                          ) : (
                            <span className="text-[#92400e] font-black">{m.poin}/{m.total} poin</span>
                          )}
                        </span>
                      </div>
                      <div className="mt-1.5">
                        <Bar value={(m.poin / m.total) * 100} tone={m.tone} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Rincian stan game festival pasar */}
              <div className="mt-4 pt-3 border-t-2 border-dashed border-[#b45309]/25">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#78350f]">
                    <span>🎪</span> Stan Game Pasar
                  </span>
                  <span className="text-[10px] font-bold text-[#92400e]/80">Rekor Terbaik</span>
                </div>
                <ul className="space-y-2">
                  {gameCards.map((g) => {
                    const max = POIN_GAME_MAX[g.id] ?? 15;
                    const didapat = Math.round((max * Math.min(g.skor, GAME_ROUNDS)) / GAME_ROUNDS);
                    return (
                      <li
                        key={g.id}
                        className="flex items-center gap-3 rounded-2xl border-2 border-[#b45309]/25 bg-[#fffdfa] p-2.5 shadow-xs transition hover:border-[#b45309]"
                      >
                        <div
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 border-[#78350f] bg-gradient-to-b from-amber-100 to-amber-200 text-lg shadow-[0_2px_0_#451a03]"
                          aria-hidden
                        >
                          {g.terkunci ? <IconLock size={15} className="text-stone-400" /> : g.emoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="truncate text-xs font-extrabold text-[#451a03]">{g.nama}</span>
                            <span className="shrink-0 text-[11px] font-extrabold tabular-nums">
                              {g.terkunci ? (
                                <span className="inline-flex items-center gap-1 text-stone-400 font-bold">
                                  <IconLock size={11} /> Belum Buka
                                </span>
                              ) : (
                                <span className="text-[#b45309] font-black">{didapat}/{max} poin</span>
                              )}
                            </span>
                          </div>
                          <div className="mt-1.5">
                            <Bar value={(g.skor / GAME_ROUNDS) * 100} tone={g.tone} />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Garis pinggir bawah kayu ekspedisi */}
            <div className="h-3 w-full border-t-2 border-[#3e2412] bg-gradient-to-r from-[#78350f] via-[#b45309] to-[#78350f]" />
          </div>
        </section>

        {/* ================= LAPAK MATERI ================= */}
        <section className="mt-6">
          <SectionHead
            title="Lapak materi"
            hint="Belajar → Coba → Latihan"
            action={
              <button
                type="button"
                onClick={() => navigate("materi")}
                className="flex items-center gap-1 rounded-full border border-amber-500/80 bg-gradient-to-r from-[#78350f] to-[#92400e] px-3 py-1 text-xs font-black text-amber-200 shadow-md backdrop-blur-xs transition active:scale-95"
              >
                <span>🗺️ Peta</span> <Arrow className="-mr-0.5" />
              </button>
            }
          />
          <div className="space-y-3">
            {materiRows.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  if (m.terkunci) return tapLocked(`Selesaikan Lapak ${m.urutan - 1}`);
                  sfx("pop");
                  navigate(`materi${m.urutan}`);
                }}
                className={`group relative block w-full overflow-hidden rounded-2xl border-2 text-left transition active:translate-y-[2px] ${m.terkunci
                    ? "border-stone-400/80 bg-stone-100 shadow-[0_3px_0_#78716c]"
                    : "border-[#451a03] bg-gradient-to-r from-[#fffdfa] via-[#fdf6e6] to-[#faf0d9] shadow-[0_4px_0_#451a03] active:shadow-[0_1px_0_#451a03]"
                  }`}
              >
                {/* List Atas Emas Vintage */}
                <div
                  className={`h-1.5 w-full ${m.terkunci
                      ? "bg-stone-300"
                      : "bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600"
                    }`}
                />

                <div className="relative flex items-center gap-3 px-3.5 py-3">
                  {/* Watermark kompas pudar */}
                  {!m.terkunci && (
                    <div className="pointer-events-none absolute right-14 -bottom-4 opacity-5">
                      <CompassRose className="h-24 w-24" />
                    </div>
                  )}

                  {/* Stamp peti dagangan dengan wax seal nomor */}
                  <div className="relative shrink-0">
                    <Crate size={50} className={m.terkunci ? "opacity-60 grayscale" : "shadow-xs"}>
                      {LAPAK_EMOJI[m.id]}
                    </Crate>
                    <span className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-[#451a03] bg-amber-400 font-display text-[10px] font-black text-[#451a03] shadow-xs">
                      {m.urutan}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${m.terkunci ? "text-stone-500" : "text-[#92400e]"}`}>
                        Lapak {m.urutan} • Jalur Ekspedisi
                      </span>
                    </div>
                    <div className={`truncate font-display text-base font-black leading-tight ${m.terkunci ? "text-stone-600" : "text-[#451a03]"}`}>
                      {m.judul}
                    </div>

                    {/* 3 Tahap Indikator Ekspedisi */}
                    <div className="mt-2 flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => {
                        const done = i < m.tahapSelesai;
                        const label = i === 0 ? "Belajar" : i === 1 ? "Coba" : "Latihan";
                        return (
                          <span
                            key={i}
                            className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-black ${done
                                ? "border border-amber-600/40 bg-amber-400/30 text-[#451a03]"
                                : m.terkunci
                                  ? "border border-stone-300 bg-stone-200/50 text-stone-400"
                                  : "border border-stone-300/80 bg-white/70 text-stone-400"
                              }`}
                          >
                            <span>{done ? "✓" : "○"}</span>
                            <span>{label}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status Badge di Ujung Kanan */}
                  {m.selesai ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-emerald-700 bg-emerald-600 px-2.5 py-1 text-xs font-black text-white shadow-xs">
                      <span>✓</span> Lulus
                    </span>
                  ) : m.terkunci ? (
                    <div className="shrink-0 rounded-xl border border-stone-300 bg-stone-200/70 p-2 text-stone-500">
                      <IconLock size={16} />
                    </div>
                  ) : (
                    <div className="shrink-0 rounded-xl border-2 border-[#451a03] bg-gradient-to-b from-amber-300 to-amber-400 p-2 text-[#451a03] shadow-[0_2px_0_#451a03] transition group-hover:translate-x-0.5">
                      <Arrow className="text-[#451a03]" />
                    </div>
                  )}
                </div>

                {m.terkunci && <ClosedSign className="absolute top-2 right-10" />}
              </button>
            ))}
          </div>
        </section>

        {/* ================= GAME ================= */}
        <section className="mt-6">
          <Bunting className="-mx-4 mb-3 w-[calc(100%+2rem)]" />
          <SectionHead
            title="Game pasar"
            hint="Stan buka setelah lapak materinya selesai"
            action={
              <button
                type="button"
                onClick={() => navigate("game")}
                className="flex items-center gap-1 rounded-full border border-amber-500/80 bg-gradient-to-r from-[#78350f] to-[#92400e] px-3 py-1 text-xs font-black text-amber-200 shadow-md backdrop-blur-xs transition active:scale-95"
              >
                <span>🎪 Semua</span> <Arrow className="-mr-0.5" />
              </button>
            }
          />
          <div className="grid grid-cols-2 gap-3">
            {gameCards.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  if (g.terkunci) return tapLocked(g.syarat);
                  sfx("tap");
                  navigate(g.route);
                }}
                className={`relative flex flex-col overflow-hidden rounded-2xl border-2 text-left transition active:translate-y-[2px] ${g.terkunci
                    ? "border-stone-400 bg-stone-100/95 shadow-[0_3px_0_#78716c]"
                    : "border-[#451a03] bg-gradient-to-b from-[#fffefc] via-[#fbf3e0] to-[#f6ebd1] shadow-[0_4px_0_#451a03] active:shadow-[0_1px_0_#451a03]"
                  }`}
              >
                {/* List Batang Kayu Atas */}
                <div className="h-2 w-full border-b border-[#451a03] bg-gradient-to-r from-[#78350f] via-[#b45309] to-[#78350f]" />

                <div className="flex flex-1 flex-col p-3">
                  <div className="flex items-start justify-between">
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-xl border-2 ${g.terkunci
                          ? "border-stone-300 bg-stone-200"
                          : "border-[#451a03] bg-gradient-to-b from-amber-100 to-amber-200 shadow-[0_2px_0_#451a03]"
                        }`}
                    >
                      <span className="text-2xl" aria-hidden>{g.emoji}</span>
                    </span>
                    {!g.terkunci && g.skor > 0 ? (
                      <span className="rounded-lg border border-[#b45309] bg-amber-200/90 px-1.5 py-0.5 text-[11px] font-black text-[#78350f] tabular-nums shadow-xs">
                        {g.skor}/{GAME_ROUNDS}
                      </span>
                    ) : g.terkunci ? (
                      <span className="inline-flex items-center gap-1 rounded-lg border border-stone-300 bg-stone-200 px-1.5 py-0.5 text-[10px] font-black text-stone-600">
                        <IconLock size={11} /> Kunci
                      </span>
                    ) : null}
                  </div>
                  <div className={`mt-2 font-display text-sm font-black leading-tight ${g.terkunci ? "text-stone-600" : "text-[#451a03]"}`}>
                    {g.nama}
                  </div>
                  <div className={`mt-1 text-[11px] font-bold leading-snug line-clamp-2 ${g.terkunci ? "text-stone-500" : "text-[#78350f]/80"}`}>
                    {g.terkunci ? g.syarat : g.desc}
                  </div>
                </div>

                {/* List Kayu Bawah */}
                <div className="h-1.5 w-full border-t border-[#451a03]/30 bg-[#78350f]/15" />
                {g.terkunci && <ClosedSign className="absolute top-3 right-2" />}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Toast ringan pengganti alert() */}
      {toast && (
        <div
          className="pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4"
          style={{ bottom: "calc(4.5rem + max(env(safe-area-inset-bottom, 0px), 14px))" }}
        >
          <div role="status" className="animate-pop rounded-full border-2 border-ink bg-ink px-4 py-2 text-sm font-bold text-white shadow-lg">
            {toast}
          </div>
        </div>
      )}

      {/* Overlay Hitam Tipis saat Dialog Maskot Dibuka */}
      {showMascotDialog && (
        <div
          onClick={() => {
            sfx("tap");
            setShowMascotDialog(false);
          }}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1.5px] transition-opacity duration-300 pointer-events-auto"
          aria-hidden
        />
      )}

      {/* ================= FLOATING MASKOT PENDAMPING (KANAN BAWAH) ================= */}
      <div
        className={`fixed z-50 select-none pointer-events-auto ${isMascotMinimized ? "right-0" : "right-3"}`}
        style={{ bottom: "calc(4.5rem + max(env(safe-area-inset-bottom, 0px), 14px))" }}
      >
        {isMascotMinimized ? (
          /* Tombol Panah < Nempel di Pojok Kanan Layar Tanpa Celah */
          <button
            type="button"
            onClick={() => {
              sfx("pop");
              setIsMascotMinimized(false);
              try {
                localStorage.setItem("mpi_minimized", "false");
              } catch { }
            }}
            aria-label="Tampilkan Maskot"
            className="relative flex items-center gap-2 rounded-l-2xl border-2 border-r-0 border-ink bg-amber-400 pl-3.5 pr-2 py-2 text-ink shadow-[-4px_4px_12px_rgba(0,0,0,0.25)] transition active:scale-95 hover:bg-amber-300"
          >
            {tipsMiskonsepsi.length > 0 && (
              <span className="absolute -top-1.5 -left-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow ring-2 ring-white animate-pulse">
                !
              </span>
            )}
            <span className="text-base font-black text-amber-950 animate-pulse">◀</span>
            <div className="h-8 w-8 rounded-full bg-white p-0.5 border-2 border-ink shadow-xs">
              <Mascot gender={profil.gender} level={maskotLevel} size={28} />
            </div>
          </button>
        ) : (
          <div className="relative flex flex-col items-end">
            {/* Pop-up Rangkuman Materi & Semangat Belajar */}
            {showMascotDialog && allTips.length > 0 && (() => {
              const activeTipIndex = dialogIndex % allTips.length;
              const curTip = allTips[activeTipIndex];
              return (
                <div className="mb-2 w-72 max-w-[85vw] rounded-3xl border-2 border-ink bg-white p-4 shadow-[0_8px_20px_rgba(0,0,0,0.25)] animate-pop">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2 mb-2.5">
                    <span className="inline-flex items-center gap-1 text-xs font-black text-amber-800">
                      <span>💡</span> Tips {profil.gender === "cowo" ? "Peco" : "Pica"}
                      {curTip.kategori === "miskonsepsi" && (
                        <span className="ml-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[8.5px] font-black text-white uppercase tracking-wider">
                          Evaluasi
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        sfx("tap");
                        setShowMascotDialog(false);
                      }}
                      aria-label="Tutup pesan"
                      className="h-6 w-6 rounded-full bg-slate-100 grid place-items-center text-xs font-extrabold text-slate-500 hover:bg-slate-200"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Konten Edukatif & Rangkuman Materi */}
                  <div className="text-xs font-bold text-ink leading-relaxed">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full ${curTip.kategori === "miskonsepsi"
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : "bg-teal-50 text-teal-800 border border-teal-200"
                        }`}>
                        {curTip.badge}
                      </span>
                    </div>
                    <div className="font-display text-sm font-extrabold text-ink mb-1.5">
                      {curTip.judul}
                    </div>
                    {curTip.sub && (
                      <div className="text-[10px] font-semibold text-slate-500 mb-2">
                        Fokus: {curTip.sub}
                      </div>
                    )}
                    {curTip.isi}
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-muted">
                      {activeTipIndex + 1} dari {allTips.length} tips
                      {tipsMiskonsepsi.length > 0 && activeTipIndex < tipsMiskonsepsi.length && (
                        <span className="ml-1 text-rose-600 font-black">• Khusus</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        sfx("pop");
                        setDialogIndex((prev) => prev + 1);
                      }}
                      className="text-[11px] font-black text-orange-600 hover:text-orange-700 flex items-center gap-1"
                    >
                      <span>Tips Lain</span> <span>›</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Karakter Maskot Interaktif + Tombol Tutup X Geser Kanan */}
            <div className="relative flex items-end">
              {/* Tombol X (Tutup / Geser ke kanan) */}
              <button
                type="button"
                onClick={() => {
                  sfx("tap");
                  setShowMascotDialog(false);
                  setIsMascotMinimized(true);
                  try {
                    localStorage.setItem("mpi_minimized", "true");
                  } catch { }
                }}
                aria-label="Sembunyikan Maskot ke Kanan"
                title="Sembunyikan Maskot"
                className="absolute -top-1.5 -left-1.5 z-10 grid h-6 w-6 place-items-center rounded-full border border-ink bg-white text-xs font-black text-slate-600 shadow-md hover:bg-red-50 hover:text-red-600 active:scale-90"
              >
                ✕
              </button>

              {/* Maskot Tanpa Background Bulat (Langsung Karakter Berdiri) */}
              <button
                type="button"
                onClick={() => {
                  sfx("pop");
                  if (!showMascotDialog) {
                    setDialogIndex(0);
                    setShowMascotDialog(true);
                  } else {
                    setShowMascotDialog(false);
                  }
                }}
                aria-label="Bicara dengan maskot"
                className="relative flex items-end justify-center transition-transform active:scale-95 hover:scale-105"
              >
                <Mascot gender={profil.gender} level={maskotLevel} size={76} />

                {/* Bubble Icon Chat Kecil */}
                {!showMascotDialog && (
                  <span className="absolute top-0 right-0 flex items-center gap-0.5 rounded-full border border-ink bg-orange-500 px-1.5 py-0.5 text-[10px] font-extrabold text-white shadow-md animate-bounce">
                    {tipsMiskonsepsi.length > 0 ? "💡 Tips" : "💬"}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
