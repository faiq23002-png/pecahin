/** Misi Harian + kalender streak. */
import React from "react";
import { useRouter } from "@/lib/router-context";
import { useApp } from "@/lib/profil-context";
import { todayStr } from "@/lib/util";
import { IconFlame } from "@/components/icons";
import { PageBoothHeader } from "@/components/MarketBoothHeader";
import { BottomNav } from "@/components/BottomNav";

export default function Misi() {
  const { navigate, goBack } = useRouter();
  const { profil, harian } = useApp();
  if (!profil) return null;

  const today = harian[todayStr()] ?? { soalDijawab: 0, misiSelesai: false, bintangHari: 0, koinHari: 0, menitAktif: 0, tanggal: todayStr() };
  const target = 5;
  const misiSelesai = today.soalDijawab >= target;

  return (
    <div className="min-h-screen bg-krim pb-24 select-none">
      <PageBoothHeader
        title="PAPAN MISI PASAR"
        subtitle="Selesaikan target harian lapak!"
        icon="📋"
        onBack={() => goBack("menu")}
        colorScheme="orange"
      />


      <div className="mx-auto max-w-md px-4">
        <div className="rounded-3xl bg-white p-6 shadow">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-orange-100">
              <IconFlame size={26} className="text-orange-500" />
            </span>
            <div>
              <div className="font-display text-base font-extrabold text-ink">Kerjakan {target} soal hari ini</div>
              <div className="text-sm font-semibold text-muted">Hadiah: ⭐ 1 bintang</div>
            </div>
          </div>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${Math.min(100, (today.soalDijawab / target) * 100)}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-xs font-bold text-muted">
            <span>{today.soalDijawab}/{target} soal</span>
            <span>{misiSelesai ? "✅ Selesai!" : "Lanjutkan!"}</span>
          </div>
        </div>

        <div className="mt-4 rounded-3xl bg-white p-6 shadow">
          <div className="font-display text-base font-extrabold text-ink">Streak 🔥</div>
          <div className="mt-1 text-3xl font-extrabold text-orange-600">{profil.streak} hari</div>
          <p className="text-xs font-semibold text-muted">Rajin belajar setiap hari agar streak-nya terus naik!</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
