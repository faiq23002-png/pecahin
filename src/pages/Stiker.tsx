/** Toko: tukar koin jadi stiker souvenir (bergaya stan toko souvenir pasar). */
import React, { useState } from "react";
import { useApp } from "@/lib/profil-context";
import { ITEM_TOKO } from "@/lib/content";
import { BottomNav } from "@/components/BottomNav";
import { IconCoin, IconBack } from "@/components/icons";
import { sfx } from "@/lib/audio";
import { useRouter } from "@/lib/router-context";
import { Awning, HangingSign, PriceTag, Counter, Bunting, MarketFestoonLights } from "@/components/MarketProps";

export default function Stiker() {
  const { navigate, goBack } = useRouter();
  const { profil, items, beliItem, poin } = useApp();
  const [filter, setFilter] = useState<"semua" | "buah" | "kue" | "souvenir">("semua");
  const [toast, setToast] = useState<string | null>(null);

  if (!profil) return null;

  const filteredItems = ITEM_TOKO.filter((it) => (filter === "semua" ? true : it.jenis === filter));
  const totalKoinDibelanjakan = items.reduce((acc, id) => {
    const it = ITEM_TOKO.find((i) => i.id === id);
    return acc + (it ? it.hargaKoin : 0);
  }, 0);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleBeli = (id: string, nama: string) => {
    if (beliItem(id)) {
      sfx("unlock");
      showToast(`🎉 Berhasil membeli ${nama}!`);
    } else {
      sfx("wrong");
      showToast("🪙 Koinmu belum cukup!");
    }
  };

  return (
    <div className="min-h-screen pb-28 select-none relative">
      {/* Background Toko Pasar */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <img
          src="/bgtoko.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
          style={{ transform: "translateZ(0)" }}
        />
        <div className="absolute inset-0 bg-slate-900/25 pointer-events-none" />
      </div>

      {/* ================= GERBANG TOKO SOUVENIR (FIXED TOP) ================= */}
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
              Toko Souvenir Pasar
            </span>
          </HangingSign>
          <div className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-amber-300 px-3 py-1.5 shadow-[0_3px_0_#1e293b]">
            <IconCoin size={16} className="text-amber-800" />
            <span className="font-display text-base font-extrabold tabular-nums text-ink">{profil.koin}</span>
          </div>
        </div>

        {/* Untaian Lampu Neon Kuning Pasar Malam di Bawah Header */}
        <div className="pt-0.5 pb-1">
          <MarketFestoonLights count={10} />
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 mt-1 space-y-4">
        {/* Lampu Neon Pasar Tambahan di atas Banner Toko */}
        <div className="relative pt-1">
          <MarketFestoonLights count={8} />
        </div>
        {/* Banner Ringkasan Koin & Koleksi - Vintage Parchment Ledger */}
        <div className="overflow-hidden rounded-3xl border-2 border-[#451a03] bg-gradient-to-b from-[#fffefc] via-[#fbf3e0] to-[#f6ebd1] shadow-[0_5px_0_#451a03]">
          {/* Header Pita Kayu Cokelat */}
          <div className="flex items-center justify-between border-b-2 border-[#451a03] bg-gradient-to-r from-[#78350f] via-[#92400e] to-[#78350f] px-4 py-2.5 text-[#fef3c7]">
            <span className="flex items-center gap-2 font-display text-xs font-black uppercase tracking-wider text-[#fef3c7] [text-shadow:0_1px_1px_rgba(0,0,0,0.6)]">
              <span>🏺</span>
              <span>Peti Koleksi Petualang</span>
            </span>
            <span className="rounded-full border border-amber-400/40 bg-amber-950/40 px-2.5 py-0.5 text-[10px] font-black text-amber-200">
              {items.length} / {ITEM_TOKO.length} Item
            </span>
          </div>

          <div className="p-4">
            {/* Bar Progres Emas */}
            <div className="h-3 w-full overflow-hidden rounded-full border-2 border-[#451a03] bg-stone-200/80 mb-3 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 transition-all duration-500"
                style={{ width: `${(items.length / ITEM_TOKO.length) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold bg-[#fef8ea] p-2.5 rounded-2xl border-2 border-[#b45309]/30">
              <div>
                <div className="text-[10px] text-[#78350f]/80 uppercase font-black">Koin Dihasilkan</div>
                <div className="text-sm font-black text-[#451a03]">🪙 {poin} / 100</div>
              </div>
              <div className="border-l-2 border-dashed border-[#b45309]/30">
                <div className="text-[10px] text-[#78350f]/80 uppercase font-black">Koin Terpakai</div>
                <div className="text-sm font-black text-[#b45309]">🛒 {totalKoinDibelanjakan} Koin</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Kategori Papan Stan Vintage */}
        <div className="flex gap-1.5 justify-between bg-[#fef8ea] p-1.5 rounded-2xl border-2 border-[#451a03] shadow-[0_3px_0_#451a03]">
          {[
            { id: "semua", label: "Semua", emoji: "🛒" },
            { id: "buah", label: "Buah", emoji: "🍉" },
            { id: "kue", label: "Kue", emoji: "🍰" },
            { id: "souvenir", label: "Oleh-Oleh", emoji: "🏆" },
          ].map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setFilter(tab.id as any);
                  sfx("pop");
                }}
                className={`flex-1 py-1.5 px-1 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1 ${
                  active
                    ? "bg-gradient-to-r from-amber-400 to-amber-300 text-[#451a03] border-2 border-[#451a03] shadow-[0_2px_0_#451a03]"
                    : "text-[#78350f]/75 hover:text-[#451a03] border-2 border-transparent"
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bunting Dekorasi Etalase */}
        <Bunting className="-mx-4 my-2 w-[calc(100%+2rem)]" />

        {/* Grid Etalase Dagangan Toko (3 Card Per Baris) */}
        <div className="grid grid-cols-3 gap-2.5">
          {filteredItems.map((it) => {
            const dimiliki = items.includes(it.id);
            const cukup = profil.koin >= it.hargaKoin;

            return (
              <div
                key={it.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 transition ${
                  dimiliki
                    ? "border-emerald-700 bg-gradient-to-b from-[#f0fdf4] to-[#dcfce7] shadow-[0_3px_0_#14532d]"
                    : cukup
                    ? "border-[#451a03] bg-gradient-to-b from-[#fffefc] via-[#fbf3e0] to-[#f6ebd1] shadow-[0_4px_0_#451a03]"
                    : "border-stone-300 bg-stone-100 opacity-80 shadow-none"
                }`}
              >
                {/* List Batang Kayu Atas */}
                <div
                  className={`h-2 w-full ${
                    dimiliki
                      ? "bg-emerald-600"
                      : "border-b border-[#451a03] bg-gradient-to-r from-[#78350f] via-[#b45309] to-[#78350f]"
                  }`}
                />

                <div className="p-2 text-center flex flex-col items-center flex-1 justify-between">
                  <div className="w-full">
                    {/* Wadah Piring Display Barang Vintage */}
                    <div
                      className={`mx-auto my-1 grid h-12 w-12 place-items-center rounded-xl border-2 shadow-xs ${
                        dimiliki
                          ? "border-emerald-700 bg-white"
                          : "border-[#78350f] bg-gradient-to-b from-amber-100 to-amber-200"
                      }`}
                    >
                      <span className="text-2xl" aria-hidden>{it.ikon}</span>
                    </div>

                    <div className="font-display text-xs font-black text-[#451a03] leading-tight mt-1 line-clamp-1">
                      {it.nama}
                    </div>
                    <div className="mt-0.5 inline-block text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#fef8ea] text-[#78350f] border border-[#b45309]/30">
                      {it.jenis}
                    </div>
                  </div>

                  {/* Tombol Beli / Label Tag */}
                  <div className="w-full mt-2">
                    {dimiliki ? (
                      <span className="inline-flex w-full items-center justify-center rounded-xl border border-emerald-700 bg-emerald-600 py-1 text-[11px] font-black text-white shadow-xs">
                        ✓ Punya
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleBeli(it.id, it.nama)}
                        className={`w-full rounded-xl py-1 px-1 text-xs font-black transition flex items-center justify-center gap-1 border-2 ${
                          cukup
                            ? "border-[#451a03] bg-gradient-to-b from-amber-300 to-amber-400 text-[#451a03] shadow-[0_2px_0_#451a03] active:translate-y-[1px] active:shadow-none hover:brightness-105"
                            : "border-stone-300 bg-stone-200 text-stone-400 cursor-not-allowed"
                        }`}
                      >
                        <IconCoin size={12} className={cukup ? "text-amber-800" : "text-stone-400"} />
                        <span>{it.hargaKoin}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Lis Kayu Bawah */}
                <div
                  className={`h-1.5 w-full border-t ${
                    dimiliki ? "border-emerald-700/30 bg-emerald-700/15" : "border-[#451a03]/30 bg-[#78350f]/15"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Toast Notifikasi Belanja */}
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
