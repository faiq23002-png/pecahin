/** Rumah Peco & Pica: evolusi maskot. */
import React from "react";
import { useRouter } from "@/lib/router-context";
import { useApp } from "@/lib/profil-context";
import { MASKOT_STAGES, levelDariPoin } from "@/lib/content";
import { Mascot } from "@/components/Mascot";
import { ProgressBar } from "@/components/ui";
import { IconLock } from "@/components/icons";
import { PageBoothHeader } from "@/components/MarketBoothHeader";
import { BottomNav } from "@/components/BottomNav";

export default function RumahMaskot() {
  const { navigate, goBack } = useRouter();
  const { profil, poin } = useApp();
  if (!profil) return null;

  const level = levelDariPoin(poin);
  const stage = MASKOT_STAGES[level];
  const next = MASKOT_STAGES[level + 1];
  const progres = next ? Math.min(100, ((poin - stage.ambangBintang) / (next.ambangBintang - stage.ambangBintang)) * 100) : 100;

  return (
    <div className="min-h-screen bg-krim pb-24 select-none">
      <PageBoothHeader
        title="STAN MASKOT PASAR"
        subtitle={`Rumah ${profil.gender === "cowo" ? "Peco" : "Pica"} · Level ${level + 1}`}
        icon="🐥"
        onBack={() => goBack("menu")}
        colorScheme="orange"
      />


      <div className="mx-auto max-w-md px-4">
        <div className="rounded-3xl bg-white p-6 text-center shadow">
          <Mascot gender={profil.gender} level={level} pose="senang" size={120} className="mx-auto animate-float" />
          <div className="mt-2 font-display text-xl font-extrabold text-teal-700">{stage.nama}</div>
          {next ? (
            <>
              <div className="mt-2 text-sm font-semibold text-muted">
                ⭐ {poin}/{next.ambangBintang} menuju {next.nama}
              </div>
              <ProgressBar value={progres} className="mt-2" />
            </>
          ) : (
            <div className="mt-2 text-sm font-bold text-amber-600">⭐ Level tertinggi! {poin} poin</div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {MASKOT_STAGES.map((s) => {
            const tercapai = level >= s.level;
            const aktif = level === s.level;
            return (
              <div
                key={s.level}
                className={`rounded-3xl p-4 text-center ${aktif ? "bg-orange-50 ring-2 ring-orange-500" : tercapai ? "bg-green-50" : "bg-slate-100"}`}
              >
                <Mascot gender={profil.gender} level={s.level} size={72} className="mx-auto" />
                <div className="mt-1 font-display text-sm font-bold text-ink">{s.nama}</div>
                <div className={`text-xs font-semibold ${tercapai ? "text-muted" : "text-amber-700"}`}>
                  {tercapai ? "✓ tercapai" : `⭐ ${poin}/${s.ambangBintang}`}
                </div>
                {!tercapai && <IconLock size={14} className="mx-auto mt-1 text-slate-400" />}
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
