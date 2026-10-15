/**
 * ProfilSetup.tsx
 * Halaman Pendaftaran Nama & Pemilihan Karakter Kasir Cilik bertema Pasar Supermarket PECAH-IN.
 */
import React, { useState } from "react";
import { useRouter } from "@/lib/router-context";
import { useApp } from "@/lib/profil-context";
import { Mascot } from "@/components/Mascot";
import { PrimaryButton } from "@/components/ui";
import { sfx } from "@/lib/audio";
import type { Gender } from "@/lib/types";
import { AwningScallops } from "@/components/MarketBoothHeader";

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

  const karakterOptions: { g: Gender; nama: string; role: string; itemEmoji: string; theme: string }[] = [
    {
      g: "cewe",
      nama: "Pica",
      role: "Penjual Buah & Kue",
      itemEmoji: "🍰 🍉",
      theme: "from-orange-500 to-amber-500",
    },
    {
      g: "cowo",
      nama: "Peco",
      role: "Penjual Sayur & Roti",
      itemEmoji: "🍞 🥦",
      theme: "from-teal-600 to-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-krim pb-12 select-none">
      {/* Header Canopy Stan Pendaftaran Pasar */}
      <div className="relative overflow-hidden bg-slate-900 text-white shadow-xl rounded-b-[2.5rem]">
        <div className="bg-market-awning-teal pt-4 pb-2 px-4 relative">
          {/* Signboard Marquee Kayu */}
          <div className="mx-auto max-w-xs bg-wood-sign rounded-2xl py-2 px-4 text-center border-2 border-amber-400 shadow-lg relative z-10 flex items-center justify-between">
            <span className="text-amber-300 text-sm">🏬</span>
            <div className="flex items-center gap-1.5 justify-center">
              <span className="text-lg">🛒</span>
              <span className="font-display font-black text-amber-100 tracking-wider text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                LOKET PASAR PECAH-IN
              </span>
            </div>
            <span className="text-amber-300 text-sm">🍉</span>
          </div>

          <div className="mt-3 text-center relative z-10 bg-slate-900/80 backdrop-blur-md rounded-2xl p-3 border border-teal-400/40">
            <h1 className="font-display text-xl font-black text-amber-300 drop-shadow">
              Selamat Datang, Kasir Cilik! 👋
            </h1>
            <p className="text-xs font-semibold text-teal-100 mt-0.5">
              Daftarkan nama & pilih stan karaktermulah sebelum mulai berjualan!
            </p>
          </div>
        </div>

        <AwningScallops lightCount={6} colorScheme="teal" />
      </div>

      <div className="mx-auto max-w-md px-4 mt-4 space-y-4">
        {/* Form Papan Kapur / Nama Pemilik Lapak */}
        <div className="rounded-3xl bg-white p-5 shadow-lg border-2 border-amber-400/60 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
              🏷️ Papan Nama Lapak
            </span>
            <span className="text-xs font-bold text-slate-500">Form Kasir</span>
          </div>

          <label className="block font-display text-base font-extrabold text-slate-800">
            Siapa Nama Pemilik Lapak?
          </label>
          <div className="relative mt-2">
            <span className="absolute left-3.5 top-3.5 text-lg">📝</span>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Ketik nama panggilanmu di sini..."
              className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-base font-bold text-ink focus:border-teal-600 focus:bg-white transition shadow-inner"
              maxLength={20}
            />
          </div>
        </div>

        {/* Pemilihan Stan Karakter (Pica vs Peco) */}
        <div className="rounded-3xl bg-white p-5 shadow-lg border-2 border-teal-500/40">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-display text-base font-black text-slate-800">
                Pilih Stan Karakter Kasir:
              </div>
              <p className="text-xs font-semibold text-slate-500">
                Pilih sahabat pecahan yang akan mendampingimu!
              </p>
            </div>
            <span className="text-xl">🎪</span>
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
                  className={`relative rounded-3xl p-3.5 pt-6 text-center transition-all active:scale-95 flex flex-col items-center justify-between border-2 ${
                    selected
                      ? "bg-gradient-to-b from-teal-50 to-amber-50 border-amber-400 ring-4 ring-amber-400/30 shadow-xl"
                      : "bg-slate-50 border-slate-200 opacity-80 hover:opacity-100 shadow"
                  }`}
                >
                  {/* Selected Badge Overlay */}
                  {selected && (
                    <span className="absolute top-2 right-2 z-20 bg-amber-400 text-amber-950 text-[11px] font-black px-2 py-0.5 rounded-full shadow-md border border-amber-500 tracking-wide flex items-center gap-1 animate-pulse">
                      ✓ DIPILIH
                    </span>
                  )}

                  {/* Character Avatar inside Booth Counter */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-amber-100 to-amber-300 border-2 border-amber-400 p-1 shadow-md grid place-items-center relative my-1 z-10">
                    <Mascot gender={c.g} level={0} size={64} />
                    <div className="absolute inset-x-0 bottom-0 h-2 bg-amber-800 border-t border-amber-600 rounded-b-xl" />
                  </div>

                  <div className="mt-2 w-full">
                    <div className="font-display text-base font-black text-slate-900">
                      {c.nama}
                    </div>
                    <div className="text-xs font-bold text-teal-700">
                      {c.role}
                    </div>
                    <div className="text-xs mt-1 bg-white/80 py-0.5 rounded-lg font-bold border border-slate-200">
                      {c.itemEmoji}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA Button Buka Lapak */}
        <PrimaryButton
          onClick={mulai}
          color="orange"
          className="w-full py-4 text-lg shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <span>🛒</span>
          <span>BUKA LAPAK & MULAI BELANJA!</span>
        </PrimaryButton>
      </div>
    </div>
  );
}
