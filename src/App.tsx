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
import { GameLoadingScreen } from "@/components/GameLoadingScreen";

import Home from "@/pages/Home";
import ProfilSetup from "@/pages/ProfilSetup";
import Materi from "@/pages/Materi";
import MateriDetail from "@/pages/MateriDetail";
import Game from "@/pages/Game";
import RumahMaskot from "@/pages/RumahMaskot";
import Stiker from "@/pages/Stiker";
import Misi from "@/pages/Misi";
import Rapor from "@/pages/Rapor";
import RaporCetak from "@/pages/RaporCetak";
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
    <div className="min-h-screen pb-36 select-none relative">
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
        <Awning tone="orange" height={32} stripe={22} light="#fef08a" />
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
        <div className="bg-[#fef8ea] border-2 border-[#b45309]/40 rounded-2xl p-3 text-center text-[#78350f] font-black text-xs shadow-sm flex items-center justify-center gap-2">
          <span className="text-base" aria-hidden>🗺️</span>
          <span>Selesaikan materi lapak untuk membuka arena tantangan game!</span>
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
                className={`group relative overflow-hidden rounded-2xl text-left transition-all active:translate-y-[2px] border-2 ${
                  terkunci
                    ? "bg-stone-100/95 border-stone-400/80 shadow-[0_3px_0_#78716c]"
                    : "bg-gradient-to-r from-[#fffdfa] via-[#fdf6e6] to-[#faf0d9] border-[#451a03] shadow-[0_4px_0_#451a03] active:shadow-[0_1px_0_#451a03]"
                }`}
              >
                {/* List Atas Batang Kayu */}
                <div
                  className={`h-2 w-full ${
                    terkunci
                      ? "bg-stone-300"
                      : "border-b border-[#451a03] bg-gradient-to-r from-[#78350f] via-[#b45309] to-[#78350f]"
                  }`}
                />

                <div className="p-3.5 flex items-center gap-3">
                  {/* Badge Ikon Stan */}
                  <div
                    className={`h-14 w-14 shrink-0 rounded-2xl grid place-items-center text-3xl shadow-sm border-2 ${
                      terkunci
                        ? "border-stone-300 bg-stone-200 text-stone-500"
                        : "border-[#451a03] bg-gradient-to-b from-amber-100 to-amber-200 text-[#451a03] shadow-[0_2px_0_#451a03]"
                    } relative`}
                  >
                    <span className="text-3xl" aria-hidden>{meta.emoji}</span>
                    {terkunci && (
                      <span className="absolute -top-1.5 -right-1.5 grid h-6 w-6 place-items-center rounded-full bg-stone-700 text-white shadow-md text-xs border border-white">
                        <IconLock size={12} />
                      </span>
                    )}
                  </div>

                  {/* Info Stan Pedagang */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-display font-black text-base truncate ${terkunci ? "text-stone-600" : "text-[#451a03]"}`}>
                        {g.nama}
                      </span>
                    </div>
                    <div className={`text-xs font-bold truncate ${terkunci ? "text-stone-400" : "text-[#92400e]"}`}>
                      {meta.sellerRole}
                    </div>

                    {/* Skor Terbaik & Status */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {terkunci ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black bg-stone-200 text-stone-700 px-2 py-0.5 rounded-lg border border-stone-300">
                          <IconLock size={11} /> Lapak Belum Buka
                        </span>
                      ) : (
                        <>
                          <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-lg border border-emerald-700 shadow-xs">
                            ✓ STAN BUKA
                          </span>
                          {skorTerbaik > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black bg-amber-100 text-amber-950 border border-amber-400 px-2 py-0.5 rounded-lg shadow-xs">
                              🏆 Rekor: <span className="text-[#b45309] font-black">{skorTerbaik}/10 Benar</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-500 bg-[#fef8ea] px-2 py-0.5 rounded-lg border border-stone-200">
                              ⭐ Belum Dimainkan
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="shrink-0">
                    {terkunci ? (
                      <div className="rounded-xl border border-stone-300 bg-stone-200/70 p-2 text-stone-500">
                        <IconLock size={16} />
                      </div>
                    ) : (
                      <div className="rounded-xl border-2 border-[#451a03] bg-gradient-to-b from-amber-300 to-amber-400 p-2 text-[#451a03] shadow-[0_2px_0_#451a03] transition group-hover:translate-x-0.5">
                        <span className="block font-black text-sm leading-none">➔</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* List Kayu Bawah */}
                <div className="h-1.5 w-full border-t border-[#451a03]/20 bg-[#78350f]/10" />
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
  if (!profil) return <ProfilSetup />;

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
      return <Game key="g1" gameId="g1" />;
    case "game-banding-jodoh":
      return <Game key="g2" gameId="g2" />;
    case "game-lapak-jualan":
      return <Game key="g3" gameId="g3" />;
    case "game-campuran":
      return <Game key="gCampuran" gameId="gCampuran" />;
    case "rumah-maskot":
      return <RumahMaskot />;
    case "stiker":
      return <Stiker />;
    case "misi":
      return <Misi />;
    case "rapor":
    case "rapor-cetak":
      return <RaporCetak />;
    case "menu":
      return <Menu />;
    case "pengaturan":
      return <Pengaturan />;
    default:
      return <Home />;
  }
}

export default function App() {
  const [initialLoading, setInitialLoading] = React.useState(true);
  const { profil } = useApp();

  React.useEffect(() => {
    if (profil) {
      import("@/lib/audio").then(({ setAudioMuted, setVolumeMusik, setVolumeSfx, initOrPlayBgm }) => {
        setAudioMuted(!profil.suaraOn);
        setVolumeMusik(profil.volumeMusik ?? 70);
        setVolumeSfx(profil.volumeSfx ?? 80);
        if (profil.suaraOn) {
          initOrPlayBgm();
        }
      });
    }
  }, [profil?.suaraOn, profil?.volumeMusik, profil?.volumeSfx]);

  return (
    <AppProvider>
      <RouterProvider>
        {initialLoading ? (
          <GameLoadingScreen
            gameTitle="Membuka Pasar PECAH-IN..."
            durationMs={3200}
            onLoaded={() => setInitialLoading(false)}
          />
        ) : (
          <AppRoutes />
        )}
      </RouterProvider>
    </AppProvider>
  );
}
