/** Beranda — desain ulang: hierarki jelas, blok warna solid, aksen "chunky" yang playful. */
import React, { useEffect, useState } from "react";
import { useRouter } from "@/lib/router-context";
import { useApp } from "@/lib/profil-context";
import { MATERI, SOAL, MASKOT_STAGES } from "@/lib/content";
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
const LAPAK_EMOJI: Record<string, string> = { m1: "🍉", m2: "🍰", m3: "📜" };
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

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

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
    { id: "gCampuran", nama: "Grand Bazaar", desc: "Tantangan semua materi", emoji: "🏆", route: "game-campuran", terkunci: !semuaSelesai(progress) && !modeJuri, syarat: "Selesaikan semua lapak", skor: game["gCampuran"]?.skorTerbaik ?? 0, tone: "teal" },
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
    <div className="min-h-screen pb-28 select-none relative">
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
        <Awning tone="teal" height={32} stripe={22} light="#fef08a" />
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
            <Mascot gender={profil.gender} level={maskotLevel} size={46} />
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

        {/* ================= HERO: LAPAK YANG DILANJUTKAN ================= */}
        <section className="overflow-hidden rounded-3xl border-2 border-ink bg-white" style={{ boxShadow: "0 5px 0 #1e293b" }}>
          <Awning tone={heroTone} height={26} stripe={20} outline={false} />

          <div className={`relative ${TONE[heroTone].solid} px-4 pt-3 pb-4 text-white`}>
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <PriceTag color="amber">
                  {heroIsGame ? "Terakhir dimainkan" : terakhirDibuka ? "Terakhir dibuka" : "Mulai dari sini"}
                </PriceTag>
                <h2 className="mt-2 font-display text-xl font-extrabold leading-tight">{hero.nama}</h2>
                <p className="mt-0.5 text-sm font-semibold text-white/80">{hero.sub}</p>
              </div>
              {/* barang dagangan dipajang di atas piring */}
              <div className="relative shrink-0">
                <div className="grid h-24 w-24 place-items-center rounded-full border-2 border-ink bg-white p-3 shadow-[0_3px_0_#1e293b]">
                  {!heroIsGame && OBJ[hero.id] ? (
                    <FractionShape kind={OBJ[hero.id]} n={4} k={3} />
                  ) : (
                    <span className="text-5xl" aria-hidden>{hero.emoji}</span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                sfx("pop");
                navigate(hero.route);
              }}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-ink bg-white py-3 font-display text-base font-extrabold text-ink transition active:translate-y-[3px]"
              style={{ boxShadow: `0 4px 0 ${heroShadow}` }}
            >
              {heroIsGame ? "Buka lapak lagi" : "Lanjut belajar"}
              <Arrow />
            </button>
          </div>
          <Counter />
        </section>

        {/* ================= PROGRES ================= */}
        <section className="mt-6">
          <SectionHead title="Buku Catatan Lapak" hint={`${soalHariIni} transaksi soal hari ini`} />

          <div
            className="overflow-hidden rounded-3xl border-2 border-ink bg-amber-50/70"
            style={{ boxShadow: "0 5px 0 #1e293b" }}
          >
            {/* Atap kanopi stan info pasar */}
            <Awning tone="orange" height={22} stripe={16} light="#fef08a" outline={false} />

            {/* Papan atas: Timbangan / Neraca Poin Pasar */}
            <div className="bg-white/95 p-4 border-b-2 border-dashed border-amber-300">
              <div className="flex items-center gap-4">
                {/* Meteran Neraca / Timbangan Pasar */}
                <div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-2xl border-2 border-ink bg-amber-100 shadow-[0_3px_0_#1e293b]">
                  <svg viewBox="0 0 36 36" className="absolute inset-2 -rotate-90" aria-hidden>
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#fed7aa" strokeWidth="3.5" />
                    <circle
                      cx="18" cy="18" r="14" fill="none" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round"
                      strokeDasharray={`${(poin / 100) * 88} 88`}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="text-center leading-none z-10">
                    <span className="text-[10px] block font-extrabold text-amber-800 uppercase tracking-tighter">Hasil</span>
                    <div className="font-display text-2xl font-extrabold tabular-nums text-ink">{poin}</div>
                    <div className="text-[9px] font-black text-amber-900/60">/ 100</div>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base" aria-hidden>⚖️</span>
                    <span className="font-display text-base font-extrabold text-ink">{stageNow.nama}</span>
                    <PriceTag color="amber" className="ml-auto text-[10px]">Peringkat</PriceTag>
                  </div>
                  <p className="mt-1 text-xs font-semibold leading-snug text-muted">
                    {stageNext ? (
                      <>
                        <b className="text-orange-600 font-extrabold">{stageNext.ambangBintang - poin} poin lagi</b> untuk naik pangkat ke <b>{stageNext.nama}</b>
                      </>
                    ) : (
                      "🏆 Saudagar Legendaris! Pangkat tertinggi tercapai."
                    )}
                  </p>
                  
                  {/* Badge Rekap Hasil Pasar */}
                  <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] font-bold">
                    <span className="inline-flex items-center gap-1 rounded-lg border border-teal-300 bg-teal-50 px-2 py-0.5 text-teal-800 shadow-xs">
                      <span>🍉 Lapak:</span>
                      <b className="tabular-nums text-teal-900 font-extrabold">{poinMateriTotal}/{POIN_LATIHAN_MAX}</b>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg border border-orange-300 bg-orange-50 px-2 py-0.5 text-orange-800 shadow-xs">
                      <span>🎪 Game:</span>
                      <b className="tabular-nums text-orange-900 font-extrabold">{poinGameTotal}/70</b>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rincian per lapak pasar */}
            <div className="p-4 bg-white/70">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700">
                  <span>🏪</span> Dagangan Tiap Lapak
                </span>
                <span className="text-[10px] font-bold text-muted">Skor Latihan</span>
              </div>
              <ul className="space-y-2">
                {materiRows.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white p-2.5 shadow-xs transition hover:border-amber-300"
                  >
                    <Crate size={40} className="shrink-0">
                      {LAPAK_EMOJI[m.id]}
                    </Crate>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-xs font-extrabold text-ink">{LAPAK_SHORT[m.id] ?? m.judul}</span>
                        <span className="shrink-0 text-[11px] font-extrabold tabular-nums">
                          {m.terkunci ? (
                            <span className="inline-flex items-center gap-1 text-slate-400 font-bold">
                              <IconLock size={11} /> Tutup
                            </span>
                          ) : (
                            <span className="text-teal-700 font-black">{m.poin}/{m.total} poin</span>
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
              <div className="mt-4 pt-3 border-t-2 border-dashed border-amber-200">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700">
                    <span>🎪</span> Stan Game Pasar
                  </span>
                  <span className="text-[10px] font-bold text-muted">Rekor Terbaik</span>
                </div>
                <ul className="space-y-2">
                  {gameCards.map((g) => {
                    const max = POIN_GAME_MAX[g.id] ?? 15;
                    const didapat = Math.round((max * Math.min(g.skor, GAME_ROUNDS)) / GAME_ROUNDS);
                    return (
                      <li
                        key={g.id}
                        className="flex items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white p-2.5 shadow-xs transition hover:border-orange-300"
                      >
                        <div
                          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 border-ink ${TONE[g.tone].soft} text-lg shadow-[0_2px_0_#1e293b]`}
                          aria-hidden
                        >
                          {g.terkunci ? <IconLock size={15} className="text-slate-400" /> : g.emoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="truncate text-xs font-extrabold text-ink">{g.nama}</span>
                            <span className="shrink-0 text-[11px] font-extrabold tabular-nums">
                              {g.terkunci ? (
                                <span className="inline-flex items-center gap-1 text-slate-400 font-bold">
                                  <IconLock size={11} /> Belum Buka
                                </span>
                              ) : (
                                <span className="text-orange-600 font-black">{didapat}/{max} poin</span>
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

            {/* Meja kayu konter stan di bagian bawah */}
            <Counter />
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
                className="flex items-center gap-0.5 rounded-full border border-teal-400 bg-teal-800/80 px-2.5 py-1 text-xs font-black text-white shadow-xs backdrop-blur-xs transition active:scale-95"
              >
                Peta <Arrow className="-mr-0.5" />
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
                className={`relative block w-full overflow-hidden rounded-2xl border-2 text-left transition active:translate-y-[2px] ${
                  m.terkunci
                    ? "border-slate-400 bg-white shadow-[0_3px_0_#94a3b8]"
                    : "border-ink bg-white shadow-[0_3px_0_#1e293b] active:shadow-[0_1px_0_#1e293b]"
                }`}
              >
                <Awning tone={m.terkunci ? "slate" : m.tone} height={14} stripe={14} outline={false} />
                <div className="flex items-center gap-3 px-3 pt-1.5 pb-3">
                  <Crate size={52} className={m.terkunci ? "opacity-70 grayscale" : ""}>
                    {LAPAK_EMOJI[m.id]}
                  </Crate>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Lapak {m.urutan}</div>
                    <div className={`truncate font-display text-base font-extrabold leading-tight ${m.terkunci ? "text-slate-700" : "text-ink"}`}>
                      {m.judul}
                    </div>
                    {/* indikator 3 tahap */}
                    <div className="mt-1.5 flex gap-1" aria-label={`${m.tahapSelesai} dari 3 tahap selesai`}>
                      {[0, 1, 2].map((i) => (
                        <span key={i} className={`h-1.5 w-6 rounded-full ${i < m.tahapSelesai ? TONE[m.tone].bar : "bg-slate-200"}`} />
                      ))}
                    </div>
                  </div>
                  {m.selesai ? (
                    <PriceTag color="green" className="shrink-0">Lulus</PriceTag>
                  ) : m.terkunci ? (
                    <IconLock size={18} className="shrink-0 text-slate-400" />
                  ) : (
                    <Arrow className="shrink-0 text-slate-400" />
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
                className="flex items-center gap-0.5 rounded-full border border-orange-400 bg-orange-700/80 px-2.5 py-1 text-xs font-black text-white shadow-xs backdrop-blur-xs transition active:scale-95"
              >
                Semua <Arrow className="-mr-0.5" />
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
                className={`relative flex flex-col overflow-hidden rounded-2xl border-2 text-left transition active:translate-y-[2px] ${
                  g.terkunci
                    ? "border-slate-400 bg-white shadow-[0_3px_0_#94a3b8]"
                    : "border-ink bg-white shadow-[0_3px_0_#1e293b] active:shadow-[0_1px_0_#1e293b]"
                }`}
              >
                <Awning tone={g.terkunci ? "slate" : g.tone} height={20} stripe={16} outline={false} />
                <div className="flex flex-1 flex-col px-3 pt-2 pb-3">
                  <div className="flex items-start justify-between">
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-full border-2 ${
                        g.terkunci ? "border-slate-300 bg-slate-50" : "border-ink bg-white shadow-[0_2px_0_#1e293b]"
                      }`}
                    >
                      <span className="text-2xl" aria-hidden>{g.emoji}</span>
                    </span>
                    {!g.terkunci && g.skor > 0 ? (
                      <PriceTag color="amber" className="tabular-nums">
                        {g.skor}/{GAME_ROUNDS}
                      </PriceTag>
                    ) : g.terkunci ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600">
                        <IconLock size={11} /> Terkunci
                      </span>
                    ) : null}
                  </div>
                  <div className={`mt-2.5 font-display text-sm font-extrabold leading-tight ${g.terkunci ? "text-slate-700" : "text-ink"}`}>
                    {g.nama}
                  </div>
                  <div className="mt-0.5 text-[11px] font-bold leading-snug text-slate-500">
                    {g.terkunci ? g.syarat : g.desc}
                  </div>
                </div>
                <Counter className={g.terkunci ? "opacity-75 grayscale" : ""} />
                {g.terkunci && <ClosedSign className="absolute top-3 right-2" />}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Toast ringan pengganti alert() */}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4">
          <div role="status" className="animate-pop rounded-full border-2 border-ink bg-ink px-4 py-2 text-sm font-bold text-white shadow-lg">
            {toast}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
