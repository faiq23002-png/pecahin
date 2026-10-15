/** Menu: lorong layanan pasar — pintasan fitur dalam bentuk lapak. */
import React, { useState } from "react";
import { useRouter } from "@/lib/router-context";
import { useApp } from "@/lib/profil-context";
import { BottomNav } from "@/components/BottomNav";
import { InfoModalCard } from "@/components/InfoModalCard";
import { Awning, Bunting, HangingSign, PriceTag, Counter, type AwningTone } from "@/components/MarketProps";
import { sfx } from "@/lib/audio";
import { IconChart, IconMaskot, IconFlame, IconRefresh, IconQuestion, IconSound, IconGear } from "@/components/icons";

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
      className="relative flex flex-col overflow-hidden rounded-2xl border-2 border-ink bg-white text-left shadow-[0_3px_0_#1e293b] transition active:translate-y-[2px] active:shadow-[0_1px_0_#1e293b]"
    >
      <Awning tone={it.tone} height={20} stripe={16} outline={false} />
      <div className="flex flex-1 flex-col px-3 pt-2 pb-3">
        <div className="flex items-start justify-between gap-1">
          <span className={`grid h-12 w-12 place-items-center rounded-full border-2 border-ink bg-white shadow-[0_2px_0_#1e293b] ${ICON_TONE[it.tone]}`}>
            {it.icon}
          </span>
          {it.tag && <PriceTag color={it.tag.color}>{it.tag.text}</PriceTag>}
        </div>
        <div className="mt-2.5 font-display text-sm font-extrabold leading-tight text-ink">{it.label}</div>
        <div className="mt-0.5 text-[11px] font-semibold leading-snug text-muted">{it.sub}</div>
      </div>
      <Counter />
    </button>
  );
}

export default function Menu() {
  const { navigate } = useRouter();
  const { profil, toggleSuara } = useApp();
  const [bantuan, setBantuan] = useState(false);

  const belajar: Item[] = [
    { label: "Rapor", sub: "Hasil belajarmu", icon: <IconChart size={24} />, tone: "teal", action: () => navigate("rapor") },
    { label: "Maskot", sub: "Rumah Peco & Pica", icon: <IconMaskot size={24} />, tone: "orange", action: () => navigate("rumah-maskot") },
    { label: "Misi", sub: "Tantangan harian", icon: <IconFlame size={24} />, tone: "rose", action: () => navigate("misi") },
    { label: "Latihan Ulang", sub: "Ulangi materi lapak", icon: <IconRefresh size={24} />, tone: "violet", action: () => navigate("materi") },
  ];

  const layanan: Item[] = [
    { label: "Bantuan", sub: "Cara pakai aplikasi", icon: <IconQuestion size={24} />, tone: "teal", action: () => setBantuan(true) },
    {
      label: "Suara",
      sub: "Musik & efek bunyi",
      icon: <IconSound size={24} off={!profil?.suaraOn} />,
      tone: profil?.suaraOn ? "orange" : "slate",
      action: () => toggleSuara(),
      tag: { text: profil?.suaraOn ? "Nyala" : "Mati", color: profil?.suaraOn ? "green" : "white" },
    },
    { label: "Atur", sub: "Pengaturan aplikasi", icon: <IconGear size={24} />, tone: "violet", action: () => navigate("pengaturan") },
  ];

  const tap = (it: Item) => () => {
    sfx("tap");
    it.action();
  };

  return (
    <div className="min-h-screen pb-28 select-none relative">
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
        <Awning tone="violet" height={32} stripe={22} light="#f5f3ff" />
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
        </section>
      </div>

      <InfoModalCard isOpen={bantuan} onClose={() => setBantuan(false)} title="PANDUAN PECAH-IN" icon="❓" confirmText="Siap!">
        <div className="space-y-2 text-sm font-semibold text-slate-700">
          <p>1. Buka <b>Lapak Pasar</b>: Ayo Belajar → Ayo Coba → Ayo Latihan.</p>
          <p>2. Kerjakan <b>10 soal</b> — progres tersimpan otomatis.</p>
          <p>3. Mainkan <b>Game</b> visual & tukar koin di menu <b>Toko</b>.</p>
        </div>
      </InfoModalCard>

      <BottomNav />
    </div>
  );
}
