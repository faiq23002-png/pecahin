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
        <Awning tone="amber" height={32} stripe={22} light="#fef08a" />
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
        {/* Banner Ringkasan Koin & Koleksi */}
        <div className="rounded-3xl border-2 border-ink bg-white p-4 shadow-[0_4px_0_#1e293b]">
          <div className="flex items-center justify-between text-xs font-black text-ink mb-1.5">
            <span className="flex items-center gap-1.5">
              <span>🛍️</span>
              <span>Koleksi Lapak Terbuka</span>
            </span>
            <span className="text-orange-600 font-black">{items.length} / {ITEM_TOKO.length} Item</span>
          </div>

          {/* Bar Progres Chunky */}
          <div className="h-2.5 w-full overflow-hidden rounded-full border-2 border-ink bg-slate-100 mb-3">
            <div
              className="h-full bg-orange-500 transition-all duration-500"
              style={{ width: `${(items.length / ITEM_TOKO.length) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold text-slate-700 bg-amber-50/80 p-2.5 rounded-2xl border-2 border-ink">
            <div>
              <div className="text-[10px] text-muted uppercase font-black">Koin Dihasilkan</div>
              <div className="text-sm font-black text-teal-800">🪙 {poin} / 100</div>
            </div>
            <div className="border-l-2 border-dashed border-amber-300">
              <div className="text-[10px] text-muted uppercase font-black">Koin Terpakai</div>
              <div className="text-sm font-black text-amber-800">🛒 {totalKoinDibelanjakan} Koin</div>
            </div>
          </div>
        </div>

        {/* Filter Kategori Papan Stan */}
        <div className="flex gap-1.5 justify-between bg-white p-1.5 rounded-2xl border-2 border-ink shadow-[0_3px_0_#1e293b]">
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
                    ? "bg-amber-400 text-ink border-2 border-ink shadow-[0_2px_0_#1e293b]"
                    : "text-muted hover:text-ink hover:bg-slate-50 border-2 border-transparent"
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
            const itemTone: "teal" | "orange" | "violet" =
              it.jenis === "buah" ? "teal" : it.jenis === "kue" ? "orange" : "violet";

            return (
              <div
                key={it.id}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 transition ${
                  dimiliki
                    ? "border-green-600 bg-green-50/70 shadow-[0_3px_0_#15803d]"
                    : cukup
                    ? "border-ink bg-white shadow-[0_3px_0_#1e293b]"
                    : "border-slate-300 bg-slate-50 opacity-80"
                }`}
              >
                {/* Mini Awning Kanopi per Etalase */}
                <Awning tone={dimiliki ? "teal" : cukup ? itemTone : "slate"} height={14} stripe={12} outline={false} />

                <div className="p-2 text-center flex flex-col items-center flex-1 justify-between">
                  <div className="w-full">
                    {/* Wadah Piring Display Barang */}
                    <div className="mx-auto my-1 grid h-12 w-12 place-items-center rounded-full border-2 border-ink bg-white shadow-sm">
                      <span className="text-2xl" aria-hidden>{it.ikon}</span>
                    </div>

                    <div className="font-display text-xs font-extrabold text-ink leading-tight mt-1 line-clamp-1">
                      {it.nama}
                    </div>
                    <div className="mt-0.5 inline-block text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-slate-100 text-muted border border-slate-200">
                      {it.jenis}
                    </div>
                  </div>

                  {/* Tombol Beli / Label Tag */}
                  <div className="w-full mt-2">
                    {dimiliki ? (
                      <PriceTag color="green" className="w-full justify-center">
                        ✓ Punya
                      </PriceTag>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleBeli(it.id, it.nama)}
                        className={`w-full rounded-xl py-1 px-1 text-xs font-black transition flex items-center justify-center gap-1 border-2 border-ink ${
                          cukup
                            ? "bg-amber-400 hover:bg-amber-500 text-ink shadow-[0_2px_0_#1e293b] active:translate-y-[2px] active:shadow-none"
                            : "bg-slate-200 text-slate-500 cursor-not-allowed border-slate-300"
                        }`}
                      >
                        <IconCoin size={12} className="text-amber-800" />
                        <span>{it.hargaKoin}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Meja Konter Kayu Etalase */}
                <Counter className={dimiliki ? "opacity-90" : ""} />
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
