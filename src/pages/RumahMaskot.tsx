/** Rumah Peco & Pica: evolusi maskot bernuansa panggung stan pasar tradisional. */
import React from "react";
import { useRouter } from "@/lib/router-context";
import { useApp } from "@/lib/profil-context";
import { MASKOT_STAGES, levelDariPoin } from "@/lib/content";
import { Mascot } from "@/components/Mascot";
import { ProgressBar } from "@/components/ui";
import { IconLock, IconBack } from "@/components/icons";
import { BottomNav } from "@/components/BottomNav";
import { Awning, HangingSign, PriceTag, Counter } from "@/components/MarketProps";

export default function RumahMaskot() {
  const { navigate, goBack } = useRouter();
  const { profil, poin, buatProfil } = useApp();
  if (!profil) return null;

  const level = levelDariPoin(poin);
  const stage = MASKOT_STAGES.find((s) => s.level === level) ?? MASKOT_STAGES[0];
  const next = MASKOT_STAGES.find((s) => s.level === level + 1);
  const progres = next
    ? Math.min(100, ((poin - stage.ambangBintang) / (next.ambangBintang - stage.ambangBintang)) * 100)
    : 100;

  const isCowo = profil.gender === "cowo";
  const namaKarakter = isCowo ? "Peco" : "Pica";

  const stageDescriptions: Record<number, string> = {
    1: "Murid magang lapak pasar yang baru mulai belajar mengenal potongan pecahan yang adil.",
    2: "Detektif cilik pasar yang teliti membandingkan ukuran dan menemukan pecahan senilai.",
    3: "Juragan lapak terpercaya yang ahli menimbang porsi belanjaan dan menguasai transaksi pasar.",
    4: "Profesor & Sultan Pecahan legendaris yang menguasai seluruh panggung Grand Bazaar!",
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
        <div className="absolute inset-0 bg-slate-900/35 pointer-events-none" />
      </div>

      {/* ================= GERBANG ATAP & JUDUL (FIXED TOP) ================= */}
      <div className="sticky top-0 z-30 w-full select-none">
        <Awning tone="orange" height={32} stripe={22} light="#fef3c7" />
        <div className="-mt-1 flex items-center justify-between px-4 pb-1">
          <button
            type="button"
            onClick={() => goBack("menu")}
            aria-label="Kembali"
            className="grid h-10 w-10 place-items-center rounded-2xl border-2 border-[#451a03] bg-white shadow-[0_3px_0_#451a03] transition active:translate-y-[2px] active:shadow-[0_1px_0_#451a03]"
          >
            <IconBack size={20} className="text-[#451a03]" />
          </button>

          <HangingSign rope={12} className="px-4 py-1">
            <span className="font-display text-sm font-extrabold uppercase tracking-[0.14em] text-white [text-shadow:0_1px_0_rgba(0,0,0,.4)]">
              STAN EVOLUSI MASKOT
            </span>
          </HangingSign>

          {/* Badge Karakter Aktif (Klik untuk Ganti Peco / Pica) */}
          <button
            type="button"
            onClick={() => {
              buatProfil(profil.nama, isCowo ? "cewe" : "cowo");
            }}
            className="flex items-center gap-1.5 rounded-2xl border-2 border-[#451a03] bg-gradient-to-b from-amber-300 to-amber-400 px-2.5 py-1.5 shadow-[0_3px_0_#451a03] active:translate-y-[2px] transition"
            title="Klik untuk beralih antara Peco & Pica"
          >
            <span className="text-xs font-black text-[#451a03]">
              {isCowo ? "👦 Peco" : "👧 Pica"}
            </span>
            <span className="text-[10px] font-bold text-[#78350f] opacity-60">⇄</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 mt-3">
        {/* ================= PANGGUNG UTAMA MASKOT AKTIF ================= */}
        <section
          className="overflow-hidden rounded-3xl border-2 border-[#451a03] bg-gradient-to-b from-[#fffefc] via-[#fbf3e0] to-[#f6ebd1] text-center shadow-[0_6px_0_#451a03]"
        >
          <Awning tone="orange" height={22} stripe={18} outline={false} light="#fef3c7" />

          <div className="p-5 pt-3">
            <PriceTag color="amber" className="mb-2">
              ⭐ Pangkat Aktif: Level {stage.level}
            </PriceTag>

            {/* Gambar Maskot Utama yang Aktif */}
            <div className="my-2 flex justify-center">
              <div className="relative p-2 rounded-3xl bg-amber-50/70 border-2 border-dashed border-[#b45309]/30">
                <Mascot gender={profil.gender} level={level} pose="senang" size={150} />
              </div>
            </div>

            <h1 className="font-display text-2xl font-black text-[#451a03]">
              {namaKarakter} — {stage.nama}
            </h1>
            <p className="mt-1 text-xs font-semibold text-[#78350f]/80 max-w-xs mx-auto">
              {stageDescriptions[stage.level]}
            </p>

            {/* Target Level Berikutnya */}
            <div className="mt-4 rounded-2xl bg-[#fef8ea] border-2 border-[#b45309]/30 p-3 text-left">
              <div className="flex justify-between items-baseline text-xs font-black text-[#451a03] mb-1.5">
                <span>
                  {next ? `Menuju Pangkat ${next.nama}` : "🏆 Saudagar Legendaris!"}
                </span>
                <span className="text-[#b45309] tabular-nums font-black">
                  {next ? `${poin} / ${next.ambangBintang} Poin` : `${poin} Poin Maksimal`}
                </span>
              </div>
              <ProgressBar value={progres} color="orange" className="h-2.5" />
              {next && (
                <p className="mt-1.5 text-[11px] font-bold text-[#78350f]/80">
                  Kumpulkan <b>{next.ambangBintang - poin} poin</b> lagi dari Ayo Latihan &amp; Game Pasar untuk berevolusi!
                </p>
              )}
            </div>
          </div>
          <Counter />
        </section>

        {/* ================= 4 TAHAP EVOLUSI MASKOT ================= */}
        <div className="mt-5 mb-2 flex items-center justify-between px-1">
          <h2 className="wood-plank inline-block rounded-lg border-2 border-[#451a03] px-3 py-1 font-display text-sm font-extrabold text-white shadow-[0_2px_0_#451a03]">
            4 Tahap Evolusi {namaKarakter}
          </h2>
          <span className="text-xs font-black text-amber-200 [text-shadow:0_1px_2px_rgba(0,0,0,0.9)]">
            Total 8 Desain Maskot
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {MASKOT_STAGES.map((s) => {
            const tercapai = level >= s.level;
            const aktif = level === s.level;

            return (
              <div
                key={s.level}
                className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 p-3 text-center transition ${
                  aktif
                    ? "border-[#451a03] bg-gradient-to-b from-amber-100 to-amber-200/90 shadow-[0_5px_0_#451a03] ring-2 ring-amber-400"
                    : tercapai
                    ? "border-[#451a03] bg-[#fffdfa] shadow-[0_4px_0_#451a03]"
                    : "border-stone-300 bg-stone-100/90 opacity-80 shadow-[0_2px_0_#78716c]"
                }`}
              >
                {/* Badge Status */}
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black uppercase text-stone-500">
                    Lvl {s.level}
                  </span>
                  {aktif ? (
                    <span className="rounded-full bg-amber-500 text-amber-950 px-2 py-0.5 text-[9px] font-black border border-amber-600">
                      Dipakai
                    </span>
                  ) : tercapai ? (
                    <span className="text-xs font-black text-emerald-600">✓ Terbuka</span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-[10px] font-extrabold text-stone-500">
                      <IconLock size={11} /> Kunci
                    </span>
                  )}
                </div>

                {/* Gambar Maskot */}
                <div className="my-1.5 flex items-center justify-center w-full">
                  <div className={`p-1 rounded-2xl flex items-center justify-center ${aktif ? "bg-white/80" : ""}`}>
                    <Mascot
                      gender={profil.gender}
                      level={s.level}
                      size={92}
                      className={tercapai ? "" : "grayscale contrast-75 opacity-70"}
                    />
                  </div>
                </div>

                {/* Info Stage */}
                <div>
                  <div className="font-display text-sm font-black leading-tight text-[#451a03]">
                    {s.nama}
                  </div>
                  <div className="mt-0.5 text-[10.5px] font-bold text-[#78350f]/80">
                    {tercapai ? "⭐ Berhasil Diraih" : `Butuh ⭐ ${s.ambangBintang} Poin`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
