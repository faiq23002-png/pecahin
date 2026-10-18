/** Menu: lorong layanan pasar — pintasan fitur dalam bentuk lapak. */
import React, { useState } from "react";
import { useRouter } from "@/lib/router-context";
import { useApp } from "@/lib/profil-context";
import { BottomNav } from "@/components/BottomNav";
import { InfoModalCard } from "@/components/InfoModalCard";
import { Awning, Bunting, HangingSign, PriceTag, Counter, type AwningTone } from "@/components/MarketProps";
import { sfx } from "@/lib/audio";
import { IconChart, IconMaskot, IconFlame, IconRefresh, IconQuestion, IconSound, IconGear, IconTrash } from "@/components/icons";

type Item = {
  label: string;
  sub: string;
  icon: React.ReactNode;
  tone: AwningTone;
  action: () => void;
  tag?: { text: string; color: "green" | "amber" | "white" | "red" };
};

const ICON_TONE: Record<string, string> = {
  teal: "text-teal-700",
  orange: "text-orange-600",
  violet: "text-violet-700",
  rose: "text-rose-600",
  red: "text-red-600",
  slate: "text-slate-600",
};

function Stall({ it, onTap }: { it: Item; onTap: () => void }) {
  return (
    <button
      type="button"
      onClick={onTap}
      className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-[#451a03] bg-gradient-to-b from-[#fffefc] via-[#fbf3e0] to-[#f6ebd1] text-left shadow-[0_4px_0_#451a03] transition active:translate-y-[2px] active:shadow-[0_1px_0_#451a03]"
    >
      {/* Batang Kayu Penggulung Atas */}
      <div className="h-2 w-full border-b border-[#451a03] bg-gradient-to-r from-[#78350f] via-[#b45309] to-[#78350f]" />

      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-start justify-between gap-1">
          {/* Medali Ikon Vintage */}
          <span className="grid h-12 w-12 place-items-center rounded-xl border-2 border-[#78350f] bg-gradient-to-b from-amber-100 to-amber-200 text-[#451a03] shadow-[0_2px_0_#451a03]">
            {it.icon}
          </span>
          {it.tag && (
            <span
              className={`rounded-lg px-2 py-0.5 text-[10px] font-black shadow-xs border ${
                it.tag.color === "red"
                  ? "border-red-700 bg-red-600 text-white"
                  : "border-[#b45309] bg-amber-200/90 text-[#78350f]"
              }`}
            >
              {it.tag.text}
            </span>
          )}
        </div>
        <div className="mt-2.5 font-display text-sm font-black leading-tight text-[#451a03] group-hover:text-[#78350f] transition">
          {it.label}
        </div>
        <div className="mt-0.5 text-[11px] font-bold leading-snug text-[#78350f]/80">
          {it.sub}
        </div>
      </div>

      {/* Lis Kayu Bawah */}
      <div className="h-1.5 w-full border-t border-[#451a03]/30 bg-[#78350f]/15" />
    </button>
  );
}

export default function Menu() {
  const { navigate } = useRouter();
  const { profil, toggleSuara, resetAll } = useApp();
  const [bantuan, setBantuan] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const belajar: Item[] = [
    { label: "Rapor", sub: "Pratinjau rapor PDF", icon: <IconChart size={24} />, tone: "teal", action: () => navigate("rapor") },
    { label: "Maskot", sub: "Rumah Peco & Pica", icon: <IconMaskot size={24} />, tone: "orange", action: () => navigate("rumah-maskot") },
  ];

  const layanan: Item[] = [
    { label: "Pengaturan Toko", sub: "Suara, karakter & demo", icon: <IconGear size={24} />, tone: "orange", action: () => navigate("pengaturan") },
    { label: "Bantuan", sub: "Cara pakai aplikasi", icon: <IconQuestion size={24} />, tone: "teal", action: () => setBantuan(true) },
    {
      label: "Reset Data",
      sub: "Hapus progres & akun",
      icon: <IconTrash size={24} />,
      tone: "red",
      action: () => setShowConfirmReset(true),
      tag: { text: "Reset", color: "red" },
    },
  ];

  const tap = (it: Item) => () => {
    sfx("tap");
    it.action();
  };

  return (
    <div className="min-h-screen pb-36 select-none relative">
      {/* Background Menu Pasar */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <img
          src="/bgmenu.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
          style={{ transform: "translateZ(0)" }}
        />
        <div className="absolute inset-0 bg-slate-900/25 pointer-events-none" />
      </div>

      {/* ================= GERBANG ATAP & JUDUL (FIXED TOP) ================= */}
      <div className="sticky top-0 z-30 w-full select-none">
        <Awning tone="orange" height={32} stripe={22} light="#fef08a" />
        <div className="-mt-1 flex justify-center">
          <HangingSign rope={10}>
            <span className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-white [text-shadow:0_1px_0_rgba(0,0,0,.4)]">
              Pusat Layanan
            </span>
          </HangingSign>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4">
        <p className="pt-3 pb-4 text-center text-xs font-extrabold text-amber-200 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">
          Mau ke lapak mana hari ini{profil ? `, ${profil.nama}` : ""}?
        </p>

        {/* ================= LAPAK BELAJAR ================= */}
        <section>
          <div className="mb-3">
            <h2 className="wood-plank inline-block rounded-lg border-2 border-ink px-3 py-1 font-display text-base font-extrabold leading-none text-white shadow-[0_2px_0_#1e293b] [text-shadow:0_1px_0_rgba(0,0,0,.35)]">
              Lapak belajar
            </h2>
            <p className="mt-1.5 text-xs font-bold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.85)]">Pantau kemajuan dan ambil tantangan</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {belajar.map((it) => (
              <Stall key={it.label} it={it} onTap={tap(it)} />
            ))}
          </div>
        </section>

        {/* ================= PENGATURAN ================= */}
        <section className="mt-6">
          <Bunting className="-mx-4 mb-3 w-[calc(100%+2rem)]" />
          <div className="mb-3">
            <h2 className="wood-plank inline-block rounded-lg border-2 border-ink px-3 py-1 font-display text-base font-extrabold leading-none text-white shadow-[0_2px_0_#1e293b] [text-shadow:0_1px_0_rgba(0,0,0,.35)]">
              Pos layanan
            </h2>
            <p className="mt-1.5 text-xs font-bold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.85)]">Bantuan dan pengaturan aplikasi</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {layanan.map((it) => (
              <Stall key={it.label} it={it} onTap={tap(it)} />
            ))}
          </div>

          {/* Copyright & Info Versi */}
          <div className="mt-8 mb-4 text-center">
            <p className="text-xs font-bold text-amber-200 [text-shadow:0_1px_2px_rgba(0,0,0,0.85)]">
              PECAH-IN · Petualangan Pecahan di Pasar
            </p>
            <p className="text-[11px] font-semibold text-white/70 [text-shadow:0_1px_2px_rgba(0,0,0,0.85)]">
              versi 0.1.0 · FIP Championship 2026
            </p>
          </div>
        </section>
      </div>

      <InfoModalCard isOpen={bantuan} onClose={() => setBantuan(false)} title="PANDUAN PASAR" icon="📜" confirmText="Siap Berpetualang!">
        <div className="space-y-2.5 text-xs font-bold text-[#78350f]">
          <div className="flex items-center gap-2.5 rounded-xl border border-amber-300 bg-amber-50/90 p-2.5 shadow-2xs">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-600 font-display font-black text-white">1</span>
            <span>Jelajahi <b>3 Lapak Pasar</b>: Ayo Belajar → Ayo Coba → Ayo Latihan.</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-teal-300 bg-teal-50/90 p-2.5 shadow-2xs">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-teal-700 font-display font-black text-white">2</span>
            <span>Kerjakan <b>10 Soal</b> di setiap lapak untuk membuka petualangan berikutnya.</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-orange-300 bg-orange-50/90 p-2.5 shadow-2xs">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-orange-600 font-display font-black text-white">3</span>
            <span>Raih koin emas untuk belanja di <b>Toko Souvenir</b> & tingkatkan maskotmu!</span>
          </div>
        </div>
      </InfoModalCard>

      <InfoModalCard
        isOpen={showConfirmReset}
        onClose={() => setShowConfirmReset(false)}
        title="BERSIHKAN LAPAK"
        icon="🧹"
        type="danger"
        confirmText="Ya, Bersihkan Lapak"
        cancelText="Batal, Tetap Buka"
        onConfirm={() => {
          setShowConfirmReset(false);
          sfx("tap");
          resetAll();
          navigate("profil");
        }}
      >
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-amber-400 bg-amber-100/90 text-3xl shadow-inner">
            🧺
          </div>
          <div className="space-y-1">
            <h4 className="font-display text-base font-black text-[#78350f]">
              Mulai Petualangan Dari Awal?
            </h4>
            <p className="text-xs font-bold leading-relaxed text-[#78350f]/80">
              Wah Saudagar! Apakah kamu yakin ingin menghapus seluruh data akun dan progres pasar?
            </p>
          </div>
          <div className="flex items-start gap-2 rounded-xl border-2 border-red-300 bg-red-50/90 p-2.5 text-left text-xs font-bold text-red-800 shadow-xs">
            <span className="shrink-0 text-sm">⚠️</span>
            <span>
              Semua <b>skor</b>, <b>bintang</b>, <b>koleksi toko</b>, dan <b>progres lapak</b> akan dihapus bersih, lalu kamu akan kembali ke gerbang masuk.
            </span>
          </div>
        </div>
      </InfoModalCard>

      <BottomNav />
    </div>
  );
}
