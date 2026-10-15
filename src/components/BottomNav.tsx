/** Navigasi bawah: Materi · Game · Home · Toko · Menu. */
import React from "react";
import { useRouter } from "@/lib/router-context";
import { IconHome, IconBook, IconGame, IconGrid, IconShop } from "./icons";

const TABS = [
  { id: "materi", label: "Materi", icon: IconBook },
  { id: "game", label: "Game", icon: IconGame },
  { id: "home", label: "Home", icon: IconHome },
  { id: "stiker", label: "Toko", icon: IconShop },
  { id: "menu", label: "Menu", icon: IconGrid },
];

const isTabActive = (tabId: string, currentRoute: string) => {
  if (tabId === "materi") return currentRoute === "materi" || currentRoute.startsWith("materi");
  if (tabId === "game") return currentRoute === "game" || currentRoute.startsWith("game");
  if (tabId === "home") return currentRoute === "home" || !currentRoute;
  if (tabId === "stiker") return currentRoute === "stiker";
  if (tabId === "menu") return ["menu", "rapor", "rumah-maskot", "misi", "pengaturan"].includes(currentRoute);
  return false;
};

export function BottomNav() {
  const { route, navigate } = useRouter();
  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-40 wood-plank border-t-2 border-ink select-none"
    >
      {/* Listel atas kayu berkilau tipis */}
      <div className="h-0.5 w-full bg-amber-300/40" />

      <div className="mx-auto grid max-w-md grid-cols-5 px-1 py-1">
        {TABS.map((t) => {
          const active = isTabActive(t.id, route);
          const Icon = t.icon;

          return (
            <button
              key={t.id}
              onClick={() => navigate(t.id)}
              aria-current={active ? "page" : undefined}
              className={`group relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 active:scale-90 ${
                active
                  ? "text-white"
                  : "text-amber-100 hover:text-white"
              }`}
            >
              {/* Efek Lingkaran Badge Ikon dengan Efek Cahaya Neon Saat Aktif */}
              <div
                className={`grid h-8 w-8 place-items-center rounded-xl transition-all duration-200 group-hover:scale-110 ${
                  active
                    ? "bg-amber-300 text-amber-950 -translate-y-0.5 shadow-[0_0_12px_#fde047,0_0_24px_rgba(250,204,21,0.7)] ring-2 ring-yellow-200"
                    : "text-amber-100 group-hover:bg-white/20 group-hover:text-white"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.8 : 2.2} />
              </div>

              {/* Label Teks Navigasi dengan Pendaran Neon Saat Aktif */}
              <span
                className={`text-[10px] tracking-wide transition-colors ${
                  active
                    ? "font-extrabold text-yellow-100 [text-shadow:0_0_8px_#fde047,0_0_16px_#eab308]"
                    : "font-bold text-amber-100 group-hover:text-white"
                }`}
              >
                {t.label}
              </span>

              {/* Penanda Aktif Neon Glow Bar di Bawah */}
              {active && (
                <span className="absolute -bottom-0.5 h-1 w-4 rounded-full bg-yellow-300 shadow-[0_0_8px_#fde047,0_0_14px_#eab308]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
