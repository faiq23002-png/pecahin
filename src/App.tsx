import React from "react";
import { RouterProvider, useRouter } from "@/lib/router-context";
import { AppProvider, useApp } from "@/lib/profil-context";
import { GAMES } from "@/lib/content";
import { semuaSelesai } from "@/lib/progress";
import { BottomNav } from "@/components/BottomNav";
import { IconLock, IconBack } from "@/components/icons";
import { sfx } from "@/lib/audio";
import { PageBoothHeader } from "@/components/MarketBoothHeader";
import { Awning, HangingSign } from "@/components/MarketProps";

import Home from "@/pages/Home";
import ProfilSetup from "@/pages/ProfilSetup";
import Materi from "@/pages/Materi";
import MateriDetail from "@/pages/MateriDetail";
import Game from "@/pages/Game";
import RumahMaskot from "@/pages/RumahMaskot";
import Stiker from "@/pages/Stiker";
import Misi from "@/pages/Misi";
import Rapor from "@/pages/Rapor";
import Menu from "@/pages/Menu";
import Pengaturan from "@/pages/Pengaturan";
function GameHub() {
  const { navigate, goBack } = useRouter();
  const { progress, game } = useApp();
  const semua = semuaSelesai(progress);

  const gameMeta: Record<string, { emoji: string; sellerRole: string; bg: string; awning: string }> = {
    g1: {
      emoji: "🍉",
      sellerRole: "Pedagang Buah & Potong Adil",
      bg: "bg-teal-600",
      awning: "bg-market-awning-teal",
    },
    g2: {
      emoji: "🍰",
      sellerRole: "Pedagang Kue & Jodoh Senilai",
      bg: "bg-rose-500",
      awning: "bg-market-awning-red",
    },
    g3: {
      emoji: "📜",
      sellerRole: "Pedagang Lapak & Tambah Porsi",
      bg: "bg-violet-600",
      awning: "bg-market-awning-red",
    },
    gCampuran: {
      emoji: "🏆",
      sellerRole: "Panggung Utama Grand Bazaar Pasar",
      bg: "bg-amber-500",
      awning: "bg-market-awning-orange",
    },
  };

  return (
    <div className="min-h-screen pb-20 select-none relative">
      {/* Background Panggung Game Pasar */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <img
          src="/bggame.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
          style={{ transform: "translateZ(0)" }}
        />
        <div className="absolute inset-0 bg-slate-900/25 pointer-events-none" />
      </div>

      {/* ================= GERBANG ATAP & JUDUL (FIXED TOP) ================= */}
      <div className="sticky top-0 z-30 w-full select-none">
        <Awning tone="red" height={32} stripe={22} light="#fff8f0" />
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
              Panggung Game Pasar
            </span>
          </HangingSign>
          <div className="w-10" />
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 mt-3 space-y-3.5">
        <div className="bg-amber-100 border border-amber-300 rounded-2xl p-3 text-center text-amber-950 font-bold text-xs shadow-sm flex items-center justify-center gap-2">
          <span className="text-base">🏪</span>
          <span>Selesaikan materi lapak untuk membuka stan game pedagang!</span>
        </div>

        <div className="flex flex-col gap-3.5">
          {GAMES.map((g) => {
            const terkunci = g.id === "gCampuran" ? !semua : !progress[g.materiId!]?.selesai;
            const meta = gameMeta[g.id] ?? gameMeta["g1"];
            const skorTerbaik = game[g.id]?.skorTerbaik ?? 0;

            return (
              <button
                key={g.id}
                onClick={() => {
                  if (terkunci) {
                    sfx("wrong");
                    return;
                  }
                  sfx("tap");
                  navigate(
                    g.id === "gCampuran"
                      ? "game-campuran"
                      : g.id === "g1"
                      ? "game-bagi-rata"
                      : g.id === "g2"
                      ? "game-banding-jodoh"
                      : "game-lapak-jualan"
                  );
                }}
                disabled={terkunci}
                className={`relative overflow-hidden rounded-3xl text-left shadow-lg transition-all active:scale-[0.98] border-2 ${
                  terkunci
                    ? "bg-white/95 border-slate-400 shadow-md"
                    : "bg-white border-amber-400 hover:border-amber-500 shadow-xl"
                }`}
              >
                {/* Awning Striped Canopy Header */}
                <div className={`${terkunci ? "bg-slate-400" : meta.awning} h-3.5 w-full border-b border-slate-300`} />

                <div className="p-3.5 flex items-center gap-3">
                  {/* Vendor Emoji Badge Frame (Tampilkan langsung ikonnya tanpa gradasi) */}
                  <div
                    className={`h-16 w-16 shrink-0 rounded-2xl grid place-items-center text-3xl shadow-md border-2 ${
                      terkunci ? "border-slate-300 bg-slate-100 text-slate-800" : `border-white/60 ${meta.bg} text-white`
                    } relative`}
                  >
                    <span className="text-3xl">{meta.emoji}</span>
                    {terkunci && (
                      <span className="absolute -top-1.5 -right-1.5 grid h-6 w-6 place-items-center rounded-full bg-slate-700 text-white shadow-md text-xs border border-white">
                        <IconLock size={13} />
                      </span>
                    )}
                  </div>

                  {/* Info Stan Pedagang */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-extrabold text-base text-slate-900 truncate">
                        {g.nama}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-teal-700 truncate">
                      {meta.sellerRole}
                    </div>

                    {/* Skor Terbaik & Status */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {terkunci ? (
                        <span className="inline-flex items-center gap-1 text-xs font-black bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-300">
                          <IconLock size={12} /> Lapak Terkunci
                        </span>
                      ) : (
                        <>
                          <span className="inline-flex items-center gap-1 text-[11px] font-black bg-green-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                            ✓ STAN BUKA
                          </span>
                          {skorTerbaik > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black bg-amber-100 text-amber-950 border border-amber-300 px-2.5 py-0.5 rounded-full shadow-xs">
                              🏆 Rekor: <span className="text-orange-600 font-black">{skorTerbaik}/10 Benar</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              ⭐ Belum Dimainkan
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="shrink-0 text-slate-400 font-black text-xl">
                    {terkunci ? <IconLock size={20} /> : <span className="text-amber-600">›</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}


function AppRoutes() {
  const { route } = useRouter();
  const { profil } = useApp();
  if (!profil && route !== "profil") return <Home />;

  // Support route patterns with stage params: materi1-tahapCoba, materim1-tahapLatihan, etc.
  if (route.startsWith("materi1") || route.startsWith("materim1")) {
    const parts = route.split("-");
    const initialTahap = parts[1] || undefined;
    return <MateriDetail materiId="m1" initialTahap={initialTahap} />;
  }
  if (route.startsWith("materi2") || route.startsWith("materim2")) {
    const parts = route.split("-");
    const initialTahap = parts[1] || undefined;
    return <MateriDetail materiId="m2" initialTahap={initialTahap} />;
  }
  if (route.startsWith("materi3") || route.startsWith("materim3")) {
    const parts = route.split("-");
    const initialTahap = parts[1] || undefined;
    return <MateriDetail materiId="m3" initialTahap={initialTahap} />;
  }

  switch (route) {
    case "profil":
      return <ProfilSetup />;
    case "materi":
      return <Materi />;
    case "game":
      return <GameHub />;
    case "game-bagi-rata":
      return <Game gameId="g1" />;
    case "game-banding-jodoh":
      return <Game gameId="g2" />;
    case "game-lapak-jualan":
      return <Game gameId="g3" />;
    case "game-campuran":
      return <Game gameId="gCampuran" />;
    case "rumah-maskot":
      return <RumahMaskot />;
    case "stiker":
      return <Stiker />;
    case "misi":
      return <Misi />;
    case "rapor":
      return <Rapor />;
    case "menu":
      return <Menu />;
    case "pengaturan":
      return <Pengaturan />;
    default:
      return <Home />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <RouterProvider>
        <AppRoutes />
      </RouterProvider>
    </AppProvider>
  );
}
