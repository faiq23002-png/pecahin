/**
 * ProfilSetup.tsx
 * Halaman Pendaftaran Nama & Pemilihan Karakter Kasir Cilik bertema Pasar Supermarket PECAH-IN.
 */
import React, { useState } from "react";
import { useRouter } from "@/lib/router-context";
import { useApp } from "@/lib/profil-context";
import { Mascot } from "@/components/Mascot";
import { sfx } from "@/lib/audio";
import type { Gender } from "@/lib/types";
import { Awning, HangingSign } from "@/components/MarketProps";

export default function ProfilSetup() {
  const { navigate } = useRouter();
  const { buatProfil } = useApp();
  const [nama, setNama] = useState("");
  const [gender, setGender] = useState<Gender>("cewe");

  const mulai = () => {
    const n = nama.trim() || "Pecinta Pecahan";
    buatProfil(n, gender);
    sfx("success");
    navigate("home");
  };

  const karakterOptions: { g: Gender; nama: string; role: string; itemEmoji: string }[] = [
    {
      g: "cewe",
      nama: "Pica",
      role: "Penjual Buah & Kue",
      itemEmoji: "🍰 🍉",
    },
    {
      g: "cowo",
      nama: "Peco",
      role: "Penjual Sayur & Roti",
      itemEmoji: "🍞 🥦",
    },
  ];

  return (
    <div className="min-h-screen pb-24 select-none relative">
      {/* Background Pasar Beranda */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <img
          src="/bghome.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
          style={{ transform: "translateZ(0)" }}
        />
        <div className="absolute inset-0 bg-slate-900/35 pointer-events-none" />
      </div>

      {/* ================= GERBANG ATAP & JUDUL (FIXED TOP) ================= */}
      <div className="sticky top-0 z-30 w-full select-none">
        <Awning tone="orange" height={32} stripe={22} light="#fef08a" />
        <div className="-mt-1 flex justify-center pb-1">
          <HangingSign rope={12}>
            <span className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-white [text-shadow:0_1px_0_rgba(0,0,0,.4)]">
              Loket Masuk Pasar
            </span>
          </HangingSign>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 mt-2 space-y-4">
        {/* Banner Logo Judul PECAH-IN Transparan */}
        <div className="flex flex-col items-center justify-center text-center py-1">
          <img
            src="/logo-pecahin.png"
            alt="PECAH-IN"
            className="w-full max-w-[320px] h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.65)] animate-float"
          />
          <p className="mt-1 text-xs font-extrabold text-amber-200 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">
            Petualangan Belajar Pecahan di Pasar Tradisional! 🍉🛒
          </p>
        </div>

        {/* Form Papan Nama Pemilik Lapak */}
        <div className="rounded-3xl bg-white/95 p-5 shadow-xl border-2 border-ink">
          <div className="flex items-center justify-between mb-2">
            <span className="wood-plank text-white text-xs font-extrabold px-3 py-1 rounded-lg border border-ink shadow-[0_2px_0_#1e293b]">
              🏷️ Papan Nama Lapak
            </span>
            <span className="text-xs font-bold text-slate-500">Form Kasir</span>
          </div>

          <label className="block mt-2 font-display text-base font-extrabold text-ink">
            Siapa Nama Panggilanmu?
          </label>
          <div className="relative mt-2">
            <span className="absolute left-3.5 top-3.5 text-lg">📝</span>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Ketik namamu di sini..."
              className="w-full rounded-2xl border-2 border-ink bg-slate-50 pl-11 pr-4 py-3 text-base font-bold text-ink focus:border-teal-600 focus:bg-white transition shadow-inner"
              maxLength={20}
            />
          </div>
        </div>

        {/* Pemilihan Stan Karakter (Pica vs Peco) */}
        <div className="rounded-3xl bg-white/95 p-5 shadow-xl border-2 border-ink">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-display text-base font-extrabold text-ink">
                Pilih Sahabat Kasir:
              </div>
              <p className="text-xs font-bold text-slate-600">
                Karakter yang akan menemanimu di pasar
              </p>
            </div>
            <span className="text-2xl">🎪</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {karakterOptions.map((c) => {
              const selected = gender === c.g;
              return (
                <button
                  key={c.g}
                  type="button"
                  onClick={() => {
                    setGender(c.g);
                    sfx("pop");
                  }}
                  className={`relative rounded-2xl p-3.5 pt-5 text-center transition-all active:scale-95 flex flex-col items-center justify-between border-2 ${
                    selected
                      ? "wood-plank border-ink text-white shadow-[0_4px_0_#1e293b] ring-2 ring-amber-300"
                      : "bg-slate-50 border-slate-300 text-ink shadow hover:bg-slate-100"
                  }`}
                >
                  {/* Selected Badge Overlay */}
                  {selected && (
                    <span className="absolute -top-2.5 bg-amber-400 text-amber-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow border border-amber-600">
                      ✓ DIPILIH
                    </span>
                  )}

                  {/* Character Avatar inside Booth Counter */}
                  <div className="w-18 h-18 rounded-2xl bg-white/90 border-2 border-ink p-1 shadow-md grid place-items-center relative my-1 z-10">
                    <Mascot gender={c.g} level={1} size={58} />
                  </div>

                  <div className="mt-2 w-full">
                    <div className={`font-display text-base font-extrabold ${selected ? "text-white [text-shadow:0_1px_1px_rgba(0,0,0,0.5)]" : "text-ink"}`}>
                      {c.nama}
                    </div>
                    <div className={`text-xs font-bold ${selected ? "text-amber-100" : "text-slate-600"}`}>
                      {c.role}
                    </div>
                    <div className="text-xs mt-1.5 bg-white text-ink py-0.5 rounded-lg font-extrabold border border-ink shadow-xs">
                      {c.itemEmoji}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA Button Buka Lapak dengan tema kayu / pasar */}
        <button
          type="button"
          onClick={mulai}
          className="w-full wood-plank border-2 border-ink rounded-2xl py-4 px-6 font-display text-lg font-extrabold text-white shadow-[0_5px_0_#1e293b] active:translate-y-[2px] active:shadow-[0_2px_0_#1e293b] transition flex items-center justify-center gap-2 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]"
        >
          <span className="text-xl">🛒</span>
          <span>BUKA LAPAK & MULAI BELAJAR!</span>
        </button>
      </div>
    </div>
  );
}

