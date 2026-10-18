/**
 * Materi.tsx
 * Peta Petualangan Gulungan Perkamen Harta Karun (Treasure Scroll Map).
 * Seluruh komponen visual (Header Zona, Tab Wilayah, Card Pos Ekspedisi, dan Gerbang Puncak)
 * dirancang penuh dengan tekstur perkamen kayu kuno, segel lilin medali, dan jahitan tinta klasik.
 */
import React, { useState } from "react";
import { useRouter } from "@/lib/router-context";
import { useApp } from "@/lib/profil-context";
import { semuaSelesai } from "@/lib/progress";
import { BottomNav } from "@/components/BottomNav";
import { IconBack, IconLock } from "@/components/icons";
import { sfx } from "@/lib/audio";
import { FractionShape } from "@/components/FractionShape";
import { Awning, HangingSign } from "@/components/MarketProps";
import { Mascot } from "@/components/Mascot";

type QuestStop = {
  materiId: string;
  tahapId: "tahapBelajar" | "tahapCoba" | "tahapLatihan";
  stopNum: number;
  title: string;
  subtitle: string;
  badgeText: string;
  icon: string;
  isBossChest?: boolean;
};

type TerritoryScroll = {
  id: string;
  territoryNum: string;
  title: string;
  sub: string;
  sealColor: string;
  sealBg: string;
  kind: "semangka" | "kue-tart" | "kue-batang";
  stops: QuestStop[];
};

const SCROLL_TERRITORIES: TerritoryScroll[] = [
  {
    id: "m1",
    territoryNum: "WILAYAH I",
    title: "Lapak Toko Buah Segar",
    sub: "Mengenal Pecahan & Potongan Aneka Buah",
    sealColor: "text-emerald-900 border-emerald-900/60 bg-emerald-200/80",
    sealBg: "from-emerald-500 to-emerald-700",
    kind: "semangka",
    stops: [
      { materiId: "m1", tahapId: "tahapBelajar", stopNum: 1, title: "Ayo Belajar", subtitle: "Etalase Buah 3D & Konsep", badgeText: "Teori", icon: "📜" },
      { materiId: "m1", tahapId: "tahapCoba", stopNum: 2, title: "Ayo Coba", subtitle: "Praktik Potong Aneka Buah", badgeText: "Praktik", icon: "🧺" },
      { materiId: "m1", tahapId: "tahapLatihan", stopNum: 3, title: "Ujian Lapak 1", subtitle: "Tantangan 10 Soal Toko Buah", badgeText: "Peti Harta", icon: "🧰", isBossChest: true },
    ],
  },
  {
    id: "m2",
    territoryNum: "WILAYAH II",
    title: "Pelabuhan Toko Kue",
    sub: "Pecahan Senilai & Banding Ukuran",
    sealColor: "text-amber-900 border-amber-900/60 bg-amber-200/80",
    sealBg: "from-amber-500 to-amber-700",
    kind: "kue-tart",
    stops: [
      { materiId: "m2", tahapId: "tahapBelajar", stopNum: 4, title: "Ayo Belajar", subtitle: "Rahasia Pecahan Senilai", badgeText: "Teori", icon: "🧭" },
      { materiId: "m2", tahapId: "tahapCoba", stopNum: 5, title: "Ayo Coba", subtitle: "Eksperimen Kue & Pizza", badgeText: "Praktik", icon: "🍰" },
      { materiId: "m2", tahapId: "tahapLatihan", stopNum: 6, title: "Ujian Lapak 2", subtitle: "Tantangan 10 Soal Toko Kue", badgeText: "Peti Harta", icon: "🧰", isBossChest: true },
    ],
  },
  {
    id: "m3",
    territoryNum: "WILAYAH III",
    title: "Benteng Bazar Utama",
    sub: "Penjumlahan Pecahan & Soal Cerita",
    sealColor: "text-rose-900 border-rose-900/60 bg-rose-200/80",
    sealBg: "from-rose-500 to-rose-700",
    kind: "kue-batang",
    stops: [
      { materiId: "m3", tahapId: "tahapBelajar", stopNum: 7, title: "Ayo Belajar", subtitle: "Aturan Penjumlahan Porsi", badgeText: "Teori", icon: "📖" },
      { materiId: "m3", tahapId: "tahapCoba", stopNum: 8, title: "Ayo Coba", subtitle: "Pesanan Gabungan Pembeli", badgeText: "Praktik", icon: "🧺" },
      { materiId: "m3", tahapId: "tahapLatihan", stopNum: 9, title: "Ujian Lapak 3", subtitle: "Tantangan 10 Soal Cerita", badgeText: "Peti Harta", icon: "🧰", isBossChest: true },
    ],
  },
];

/** Komponen Batang Kayu Penggulung Peta (Atas / Bawah) */
function WoodenScrollRoller() {
  return (
    <div className="relative mx-auto flex w-full items-center justify-center select-none">
      {/* Ujung Knop Kayu Kiri */}
      <div className="h-6 w-4 shrink-0 rounded-l-md border-2 border-r-0 border-[#3e2412] bg-gradient-to-b from-[#d97706] via-[#92400e] to-[#451a03] shadow-md" />
      {/* Cincin Emas Kiri */}
      <div className="h-5 w-2 shrink-0 border-y-2 border-[#3e2412] bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-700" />
      {/* Batang Utama Kayu Jati */}
      <div className="h-4 flex-1 border-2 border-[#3e2412] bg-gradient-to-b from-[#b45309] via-[#78350f] to-[#451a03] shadow-[0_4px_6px_rgba(0,0,0,0.45)]" />
      {/* Cincin Emas Kanan */}
      <div className="h-5 w-2 shrink-0 border-y-2 border-[#3e2412] bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-700" />
      {/* Ujung Knop Kayu Kanan */}
      <div className="h-6 w-4 shrink-0 rounded-r-md border-2 border-l-0 border-[#3e2412] bg-gradient-to-b from-[#d97706] via-[#92400e] to-[#451a03] shadow-md" />
    </div>
  );
}

/** Ikon Mawar Kompas Klasik SVG */
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

export default function Materi() {
  const { navigate, goBack } = useRouter();
  const { progress, modeJuri, profil, maskotLevel } = useApp();
  const [activeTerritoryId, setActiveTerritoryId] = useState<string>("m1");

  const semua = semuaSelesai(progress) || modeJuri;
  const territory = SCROLL_TERRITORIES.find((t) => t.id === activeTerritoryId) ?? SCROLL_TERRITORIES[0];
  const prog = progress[territory.id] ?? {
    tahapBelajar: "terkunci",
    tahapCoba: "terkunci",
    tahapLatihan: "terkunci",
    selesai: false,
  };

  // Hitung total pos selesai dari 9 pos
  const totalStopsDone = SCROLL_TERRITORIES.reduce((acc, t) => {
    const p = progress[t.id];
    if (!p) return acc;
    return (
      acc +
      (p.tahapBelajar === "selesai" ? 1 : 0) +
      (p.tahapCoba === "selesai" ? 1 : 0) +
      (p.tahapLatihan === "selesai" ? 1 : 0)
    );
  }, 0);

  // Cari tahap aktif tempat karakter Peco/Pica berdiri
  const currentActiveStop = (() => {
    if (prog.tahapBelajar !== "selesai") return "tahapBelajar";
    if (prog.tahapCoba !== "selesai") return "tahapCoba";
    if (prog.tahapLatihan !== "selesai") return "tahapLatihan";
    return "completed";
  })();

  return (
    <div className="min-h-screen pb-36 select-none relative">
      {/* Background Pasar Tradisional */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <img
          src="/bgpasar.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
          style={{ transform: "translateZ(0)" }}
        />
        <div className="absolute inset-0 bg-slate-950/45 pointer-events-none" />
      </div>

      {/* ================= GERBANG ATAP & JUDUL (FIXED TOP) ================= */}
      <div className="fixed top-0 inset-x-0 z-30 select-none">
        <Awning tone="orange" height={32} stripe={22} light="#fef08a" />
        <div className="-mt-1 flex items-center justify-between px-4 pb-1">
          <button
            type="button"
            onClick={() => goBack("home")}
            aria-label="Kembali"
            className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-white shadow-[0_3px_0_#1e293b] active:translate-y-[2px] active:shadow-[0_1px_0_#1e293b]"
          >
            <IconBack size={20} className="text-ink" />
          </button>
          <HangingSign rope={10}>
            <span className="font-display text-sm font-extrabold uppercase tracking-[0.15em] text-white [text-shadow:0_1px_0_rgba(0,0,0,.4)]">
              Peta Harta Saudagar
            </span>
          </HangingSign>
          <div className="flex items-center gap-1 rounded-xl border-2 border-ink bg-amber-300 px-2.5 py-1 shadow-[0_3px_0_#1e293b]">
            <span className="text-xs">🧭</span>
            <span className="font-display text-xs font-black text-ink tabular-nums">{totalStopsDone}/9</span>
          </div>
        </div>
      </div>

      {/* Spacer tinggi agar konten peta tidak tertutup oleh header fixed top */}
      <div className="h-[76px]" />

      <div className="mx-auto max-w-md px-3.5 pt-3">
        {/* ================= TAB WILAYAH EKSPEDISI BERTEMA SEGEL PERKAMEN ================= */}
        <div className="mb-3.5 grid grid-cols-3 gap-2">
          {SCROLL_TERRITORIES.map((t, idx) => {
            const isSelected = t.id === activeTerritoryId;
            const p = progress[t.id];
            const isLocked = p?.tahapBelajar === "terkunci" && !modeJuri;
            const doneCount =
              (p?.tahapBelajar === "selesai" ? 1 : 0) +
              (p?.tahapCoba === "selesai" ? 1 : 0) +
              (p?.tahapLatihan === "selesai" ? 1 : 0);

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  sfx("pop");
                  setActiveTerritoryId(t.id);
                }}
                className={`relative flex flex-col items-center rounded-2xl border-2 px-2 py-2 transition active:translate-y-[2px] ${
                  isSelected
                    ? "border-[#451a03] bg-gradient-to-b from-[#fef3c7] to-[#fde68a] text-[#451a03] shadow-[0_4px_0_#451a03] ring-2 ring-amber-300"
                    : isLocked
                    ? "border-[#78350f]/30 bg-[#ebd5b3]/70 text-[#78350f]/50"
                    : "border-[#78350f] bg-[#fbf0d9] text-[#451a03] shadow-[0_3px_0_#78350f]"
                }`}
              >
                <span className="text-[10px] font-black tracking-wider uppercase opacity-80">
                  Peta {idx + 1}
                </span>
                <span className="mt-0.5 font-display text-xs font-black truncate w-full text-center">
                  {idx === 0 ? "🧺 Toko Buah" : idx === 1 ? "🍰 Toko Kue" : "📜 Bazar"}
                </span>
                <span className="mt-1 rounded-full border border-[#78350f]/20 bg-[#78350f]/10 px-2 py-0.5 text-[9px] font-black">
                  {p?.selesai ? "✓ Tuntas" : isLocked ? "🔒 Terkunci" : `${doneCount}/3 Pos`}
                </span>
              </button>
            );
          })}
        </div>

        {/* ================= GULUNGAN PERKAMEN UTAMA (TREASURE SCROLL) ================= */}
        <div className="relative">
          {/* Batang Kayu Penggulung Atas */}
          <WoodenScrollRoller />

          {/* Lembaran Kertas Perkamen Kuno */}
          <div
            className="relative mx-2 border-x-4 border-[#5c3418] bg-[#f7e6c4] px-4 py-5 shadow-[inset_0_0_32px_rgba(146,64,14,0.35),0_10px_25px_rgba(0,0,0,0.45)]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(120, 53, 15, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(217, 119, 6, 0.12), transparent 15%, transparent 85%, rgba(120, 53, 15, 0.2))",
              backgroundSize: "18px 18px, 100% 100%",
            }}
          >
            {/* Mawar Kompas Transparan di Sudut Kertas */}
            <CompassRose className="pointer-events-none absolute top-3 right-3 h-16 w-16" />

            {/* Bingkai Garis Tinta Klasik di Dalam Peta */}
            <div className="rounded-2xl border-2 border-dashed border-[#92400e]/50 p-3.5 relative bg-[#fdf5e2]/60">
              
              {/* Header Wilayah di Atas Perkamen */}
              <div className="flex items-center gap-3 border-b-2 border-[#92400e]/30 pb-3">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-2 border-[#451a03] bg-[#fffbeb] p-1.5 shadow-[0_3px_0_#451a03]">
                  <FractionShape kind={territory.kind} n={4} k={3} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className={`inline-block rounded-md border px-2 py-0.5 text-[9px] font-black tracking-widest uppercase ${territory.sealColor}`}>
                    {territory.territoryNum}
                  </span>
                  <h2 className="mt-0.5 font-display text-base font-black text-[#3e2412] leading-tight">
                    {territory.title}
                  </h2>
                  <p className="text-[11px] font-bold text-[#78350f]">{territory.sub}</p>
                </div>
              </div>

              {/* ================= JALUR TINTA JEJAK PETUALANGAN & 3 CARD POS PERKAMEN ================= */}
              <div className="relative mt-5 space-y-4">
                {/* Garis Vertikal Jejak Tinta Menghubungkan Pos 1 -> 2 -> 3 */}
                <div
                  className="pointer-events-none absolute top-8 bottom-8 left-7 w-1 border-l-3 border-dashed border-[#78350f]/60"
                  aria-hidden
                />

                {territory.stops.map((stop) => {
                  const st = prog[stop.tahapId];
                  const isDone = st === "selesai";
                  const isLocked = st === "terkunci" && !modeJuri;
                  const isCurrent = currentActiveStop === stop.tahapId && !isLocked;

                  return (
                    <div key={stop.tahapId} className="relative flex items-center gap-3.5 z-10">
                      
                      {/* Segel Medali Bulat / Peti Harta di Kiri */}
                      <div className="relative shrink-0">
                        <div
                          className={`grid h-14 w-14 place-items-center rounded-full border-3 transition ${
                            isDone
                              ? "border-[#065f46] bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-[0_4px_0_#064e3b]"
                              : !isLocked
                              ? "border-[#451a03] bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 text-[#451a03] shadow-[0_4px_0_#451a03] ring-4 ring-amber-300/70"
                              : "border-[#78350f]/50 bg-[#e7d4b5] text-[#78350f]/60 shadow-[0_3px_0_rgba(120,53,15,0.3)]"
                          }`}
                        >
                          {isLocked ? (
                            <IconLock size={20} className="text-[#78350f]/60" />
                          ) : (
                            <span className="text-2xl drop-shadow-xs">{stop.icon}</span>
                          )}
                        </div>

                        {/* Nomor Urut Segel */}
                        <span className="absolute -top-1 -left-1 grid h-6 w-6 place-items-center rounded-full border-2 border-[#451a03] bg-[#fffbeb] font-display text-[11px] font-black text-[#451a03] shadow">
                          {stop.stopNum}
                        </span>

                        {/* Bendera Ceklis Selesai */}
                        {isDone && (
                          <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-[#451a03] bg-amber-300 text-xs font-black text-[#451a03] shadow">
                            🚩
                          </span>
                        )}
                      </div>

                      {/* Card Pos Perkamen Harta Karun (Ukuran Seragam & Rapi) */}
                      <button
                        type="button"
                        disabled={isLocked}
                        onClick={() => {
                          if (isLocked) {
                            sfx("wrong");
                            return;
                          }
                          sfx("tap");
                          navigate(`materi${stop.materiId}-${stop.tahapId}`);
                        }}
                        className={`group relative flex-1 overflow-hidden rounded-2xl border-2 p-3 text-left transition active:translate-y-[2px] ${
                          isDone
                            ? "border-[#065f46] bg-gradient-to-r from-[#fefbf0] to-[#ecfdf5] shadow-[0_4px_0_#065f46]"
                            : !isLocked
                            ? "border-[#451a03] bg-gradient-to-r from-[#fffbeb] to-[#fef3c7] shadow-[0_4px_0_#451a03] ring-2 ring-amber-400/80"
                            : "border-[#78350f]/40 bg-[#efe0c4]/80 opacity-75 shadow-[0_2px_0_rgba(120,53,15,0.2)]"
                        }`}
                      >
                        {/* Aksen Pinggiran Perkamen Timbul */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`rounded px-1.5 py-0.5 text-[9px] font-black uppercase border ${
                                  stop.isBossChest
                                    ? "bg-amber-300 text-[#451a03] border-[#451a03]"
                                    : "bg-[#f3e3c3] text-[#78350f] border-[#78350f]/40"
                                }`}
                              >
                                {stop.badgeText}
                              </span>
                              <span className="font-display text-sm font-black text-[#3e2412] truncate">
                                {stop.title}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs font-bold text-[#78350f] truncate">
                              {stop.subtitle}
                            </p>

                            {/* Baris Status Bintang / Tombol Aksi */}
                            <div className="mt-2 flex items-center justify-between">
                              {stop.isBossChest ? (
                                <div className="flex items-center gap-0.5 text-xs">
                                  {[1, 2, 3].map((s) => (
                                    <span key={s} className={isDone ? "text-amber-500" : "text-[#c4b093]"}>
                                      ★
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-[10px] font-black text-[#92400e]">
                                  {isDone ? "✓ Ekspedisi Selesai" : isLocked ? "🔒 Belum Terbuka" : "🧭 Siap Dijelajahi"}
                                </span>
                              )}

                              <span
                                className={`rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase transition ${
                                  isDone
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-400"
                                    : !isLocked
                                    ? "bg-amber-400 text-[#451a03] border border-[#451a03] group-hover:scale-105"
                                    : "bg-[#dfcbb0] text-[#78350f]"
                                }`}
                              >
                                {isDone ? "Ulangi" : isLocked ? "Kunci" : "Jelajahi ➔"}
                              </span>
                            </div>
                          </div>

                          {/* Karakter Maskot Peco/Pica Berdiri di Pos Aktif */}
                          {isCurrent && (
                            <div className="shrink-0 flex flex-col items-center pl-1 animate-bounce">
                              <div className="h-12 w-12">
                                <Mascot gender={profil?.gender ?? "cowo"} level={maskotLevel} size={48} />
                              </div>
                              <span className="rounded bg-amber-400 px-1.5 py-0.2 text-[8px] font-black text-[#451a03] border border-[#451a03] shadow-xs">
                                Di Sini!
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* ================= CARD HARTA KARUN UTAMA: GRAND BAZAR ================= */}
              <div className="mt-6 border-t-2 border-dashed border-[#92400e]/40 pt-4">
                <button
                  type="button"
                  disabled={!semua}
                  onClick={() => {
                    if (!semua) {
                      sfx("wrong");
                      return;
                    }
                    sfx("unlock");
                    navigate("game-campuran");
                  }}
                  className={`w-full rounded-2xl border-2 p-3 text-left transition active:translate-y-[2px] ${
                    semua
                      ? "border-[#451a03] bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 shadow-[0_4px_0_#451a03]"
                      : "border-[#78350f]/40 bg-[#ead8ba] opacity-80 shadow-[0_2px_0_rgba(120,53,15,0.2)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border-2 border-[#451a03] bg-[#fffbeb] text-2xl shadow-xs">
                      {semua ? "👑" : "🔒"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded bg-[#78350f] px-1.5 py-0.5 text-[9px] font-black text-amber-100 uppercase">
                           Harta Utama
                        </span>
                        <span className="font-display text-sm font-black text-[#3e2412] truncate">
                          Istana Grand Bazar
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-[#78350f] truncate mt-0.5">
                        {semua
                          ? "Seluruh ekspedisi tuntas! Masuk ke tantangan raja pasar!"
                          : "Selesaikan ketiga wilayah peta untuk membuka harta utama"}
                      </p>
                    </div>
                  </div>
                </button>
              </div>

            </div>
          </div>

          {/* Batang Kayu Penggulung Bawah */}
          <WoodenScrollRoller />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
