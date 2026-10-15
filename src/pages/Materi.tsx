/**
 * Materi.tsx
 * Peta Petualangan Belajar Pasar PECAH-IN (Gaya Winding Road Pathway — contoh peta.jpg).
 */
import React, { useState } from "react";
import { useRouter } from "@/lib/router-context";
import { useApp } from "@/lib/profil-context";
import { MATERI } from "@/lib/content";
import { semuaSelesai } from "@/lib/progress";
import { BottomNav } from "@/components/BottomNav";
import { IconLock, IconFlag, IconBack } from "@/components/icons";
import { sfx } from "@/lib/audio";
import { PageBoothHeader } from "@/components/MarketBoothHeader";
import { FractionShape } from "@/components/FractionShape";
import { Awning, HangingSign } from "@/components/MarketProps";

const MAP_THEMES: Record<
  string,
  {
    title: string;
    sub: string;
    bgColor: string;
    cardBg: string;
    pathColor: string;
    accent: string;
    kind: "semangka" | "kue-tart" | "kue-batang";
    stages: { id: string; title: string; desc: string; icon: string }[];
  }
> = {
  m1: {
    title: "LAPAK 1: KENAL PECAHAN",
    sub: "Kebun Semangka & Potongan Adil",
    bgColor: "bg-[#D1F4E0]",
    cardBg: "bg-emerald-50 border-emerald-300",
    pathColor: "#10B981",
    accent: "bg-emerald-600 text-white",
    kind: "semangka",
    stages: [
      { id: "tahapBelajar", title: "1. Ayo Belajar 🧠", desc: "Konsep Dasar & Potongan", icon: "🍉" },
      { id: "tahapCoba", title: "2. Ayo Coba 🎮", desc: "Arsir & Bagi Rata", icon: "🍽️" },
      { id: "tahapLatihan", title: "3. Ayo Latihan ✏️", desc: "Tantangan 10 Soal", icon: "⭐" },
    ],
  },
  m2: {
    title: "LAPAK 2: PECAHAN SENILAI",
    sub: "Toko Kue & Banding Ukuran",
    bgColor: "bg-[#FDF4C7]",
    cardBg: "bg-amber-50 border-amber-300",
    pathColor: "#F59E0B",
    accent: "bg-amber-500 text-white",
    kind: "kue-tart",
    stages: [
      { id: "tahapBelajar", title: "1. Ayo Belajar 🧠", desc: "Pecahan Senilai & Banding", icon: "🍰" },
      { id: "tahapCoba", title: "2. Ayo Coba 🎮", desc: "Eksperimen Kue Senilai", icon: "🍕" },
      { id: "tahapLatihan", title: "3. Ayo Latihan ✏️", desc: "Tantangan 10 Soal", icon: "⭐" },
    ],
  },
  m3: {
    title: "LAPAK 3: PENJUMLAHAN",
    sub: "Pasar Utama & Soal Cerita",
    bgColor: "bg-[#D7F3FE]",
    cardBg: "bg-sky-50 border-sky-300",
    pathColor: "#0EA5E9",
    accent: "bg-sky-600 text-white",
    kind: "kue-batang",
    stages: [
      { id: "tahapBelajar", title: "1. Ayo Belajar 🧠", desc: "Tambah Pembilang & Kata Kunci", icon: "📜" },
      { id: "tahapCoba", title: "2. Ayo Coba 🎮", desc: "Gabung Potongan Kue", icon: "🥖" },
      { id: "tahapLatihan", title: "3. Ayo Latihan ✏️", desc: "Tantangan 10 Soal", icon: "⭐" },
    ],
  },
};

export default function Materi() {
  const { navigate, goBack } = useRouter();
  const { progress, modeJuri } = useApp();
  const [selectedMateri, setSelectedMateri] = useState<string>("m1");

  const activeTheme = MAP_THEMES[selectedMateri];
  const activeProg = progress[selectedMateri] ?? { tahapBelajar: "terkunci", tahapCoba: "terkunci", tahapLatihan: "terkunci" };
  const semua = semuaSelesai(progress) || modeJuri;

  const activeDoneCount =
    (activeProg.tahapBelajar === "selesai" ? 1 : 0) +
    (activeProg.tahapCoba === "selesai" ? 1 : 0) +
    (activeProg.tahapLatihan === "selesai" ? 1 : 0);
  const activePct = Math.round((activeDoneCount / 3) * 100);

  return (
    <div className="min-h-screen pb-24 select-none relative">
      {/* Background Layer Statis yang Tidak Bergerak / Tidak Zoom saat Discroll */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <img
          src="/bgpasar.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
          style={{ transform: "translateZ(0)" }}
        />
        <div className="absolute inset-0 bg-slate-900/25 pointer-events-none" />
      </div>

      {/* ================= GERBANG ATAP & JUDUL (FIXED TOP) ================= */}
      <div className="sticky top-0 z-30 w-full select-none">
        <Awning tone="green" height={32} stripe={22} light="#fef08a" />
        <div className="-mt-1 flex items-center justify-between px-4 pb-1">
          <button
            type="button"
            onClick={() => goBack("menu")}
            aria-label="Kembali"
            className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-white shadow-[0_3px_0_#1e293b] active:translate-y-[2px] active:shadow-[0_1px_0_#1e293b]"
          >
            <IconBack size={20} className="text-ink" />
          </button>
          <HangingSign rope={10}>
            <span className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-white [text-shadow:0_1px_0_rgba(0,0,0,.4)]">
              Peta Belajar Pecahan
            </span>
          </HangingSign>
          <div className="w-10" />
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 pt-3">
        {/* Theme Floor / Lapak Tabs with Progress Bar */}
        <div className="flex justify-between gap-1.5 bg-white/95 p-2 rounded-2xl shadow-md border border-slate-200 mb-3">
          {MATERI.map((m) => {
            const isSelected = selectedMateri === m.id;
            const p = progress[m.id];
            const isLocked = p?.tahapBelajar === "terkunci" && !modeJuri;
            const doneCount =
              (p?.tahapBelajar === "selesai" ? 1 : 0) +
              (p?.tahapCoba === "selesai" ? 1 : 0) +
              (p?.tahapLatihan === "selesai" ? 1 : 0);
            const pct = Math.round((doneCount / 3) * 100);

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setSelectedMateri(m.id);
                  sfx("pop");
                }}
                className={`flex-1 py-2 px-1.5 rounded-xl text-xs font-black transition flex flex-col items-center gap-1 ${
                  isSelected
                    ? "bg-teal-700 text-white shadow-md scale-[1.02]"
                    : isLocked
                    ? "bg-slate-100 text-slate-400"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{m.id === "m1" ? "🍉 LAPAK 1" : m.id === "m2" ? "🍰 LAPAK 2" : "📜 LAPAK 3"}</span>
                {/* Mini Progress Bar inside tab */}
                <div className="w-full px-1">
                  <div className={`h-1.5 w-full rounded-full overflow-hidden ${isSelected ? "bg-teal-900/50" : "bg-slate-200"}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${isSelected ? "bg-amber-300" : "bg-emerald-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="text-[9px] font-bold opacity-90">
                  {p?.selesai ? "✓ 3/3 Selesai" : isLocked ? "🔒 Kunci" : `${doneCount}/3 Selesai`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Banner Informatif Lapak dengan Bar Progres */}
        <div className={`p-4 rounded-3xl border-2 shadow-md mb-4 ${activeTheme.cardBg}`}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                {activeTheme.title}
              </div>
              <div className="font-display text-base font-extrabold text-slate-900">
                {activeTheme.sub}
              </div>
            </div>
            <div className="h-12 w-12 shrink-0">
              <FractionShape kind={activeTheme.kind} n={4} k={3} />
            </div>
          </div>

          {/* Bar Progres Lapak Aktif */}
          <div className="mt-3 pt-2.5 border-t border-slate-300/60">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
              <span>Progres Lapak ini</span>
              <span className="text-teal-800 font-extrabold">{activeDoneCount} / 3 Tahap Selesai ({activePct}%)</span>
            </div>
            <div className="h-3 w-full bg-slate-200/80 rounded-full overflow-hidden shadow-inner border border-slate-300/40">
              <div
                className="h-full bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 rounded-full transition-all duration-500 shadow"
                style={{ width: `${activePct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Straight Pathway Canvas */}
        <div className="relative min-h-[480px] py-4">
          {/* SVG Straight Neon Pathway Line */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M 50 95 L 50 5"
              fill="none"
              stroke="#00F0FF"
              strokeWidth="12"
              strokeLinecap="round"
              className="opacity-50"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 50 95 L 50 5"
              fill="none"
              stroke={activeTheme.pathColor}
              strokeWidth="6"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 50 95 L 50 5"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeDasharray="3 4"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Stage Node Cards sitting straight in a single column */}
          <div className="relative flex flex-col items-center justify-between gap-10 pt-2 pb-6">
            {activeTheme.stages.map((stg) => {
              const statusKey = stg.id as "tahapBelajar" | "tahapCoba" | "tahapLatihan";
              const isDone = activeProg[statusKey] === "selesai";
              const isLocked = activeProg[statusKey] === "terkunci" && !modeJuri;

              return (
                <div key={stg.id} className="w-[92%] self-center z-10">
                  <button
                    type="button"
                    onClick={() => {
                      if (isLocked) {
                        sfx("wrong");
                        return;
                      }
                      sfx("tap");
                      navigate(`materi${selectedMateri}-${stg.id}`);
                    }}
                    disabled={isLocked}
                    className={`relative w-full rounded-3xl p-3.5 text-left border-3 shadow-lg transition-all active:scale-95 ${
                      isDone
                        ? "bg-white border-green-500 ring-4 ring-green-400/20"
                        : !isLocked
                        ? "bg-white border-teal-500 ring-4 ring-teal-400/30"
                        : "bg-slate-100 border-slate-300 opacity-70"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 grid place-items-center text-2xl shrink-0 shadow-sm">
                        <span>{isLocked ? "🔒" : stg.icon}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-display font-black text-sm text-slate-900 truncate">
                          {stg.title}
                        </div>
                        <div className="text-xs font-bold text-slate-500 truncate">
                          {stg.desc}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isDone ? (
                          <span className="bg-green-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                            ✓ Ulangi 🔄
                          </span>
                        ) : !isLocked ? (
                          <span className="bg-teal-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                            Buka 🛒
                          </span>
                        ) : (
                          <span className="bg-slate-300 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            Kunci 🔒
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}

            {/* Festival Parcel Challenge (Panggung Game) */}
            <div className="w-[85%] self-center mt-4 z-10">
              <button
                type="button"
                onClick={() => {
                  if (!semua) {
                    sfx("wrong");
                    return;
                  }
                  sfx("tap");
                  navigate("game-campuran");
                }}
                disabled={!semua}
                className={`w-full rounded-3xl p-3.5 text-left border-3 shadow-xl transition-all ${
                  semua
                    ? "bg-amber-400 border-amber-500 text-amber-950 active:scale-95"
                    : "bg-slate-200 border-slate-300 text-slate-500 opacity-70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border-2 border-amber-500 grid place-items-center text-2xl shrink-0 shadow">
                    <span>{semua ? "🏆" : "🔒"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm font-black truncate">
                      Panggung Festival Pasar 🎪
                    </div>
                    <div className="text-xs font-bold opacity-90 truncate">
                      {semua ? "Mainkan Tantangan Campuran Pasar!" : "Selesaikan semua lapak dulu"}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
