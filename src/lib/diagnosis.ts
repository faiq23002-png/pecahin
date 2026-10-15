/** Agregasi diagnosis dari riwayat jawaban. */
import type { Domain, RiwayatJawaban } from "./types";
import { MISKONSEPSI } from "./content";

export interface DomainStat {
  domain: Domain;
  benar: number;
  total: number;
}

const EMPTY: Record<Domain, DomainStat> = {
  konsep: { domain: "konsep", benar: 0, total: 0 },
  prinsip: { domain: "prinsip", benar: 0, total: 0 },
  verbal: { domain: "verbal", benar: 0, total: 0 },
};

export function hitungPenguasaan(riwayat: RiwayatJawaban[]): Record<Domain, DomainStat> {
  const stat: Record<Domain, DomainStat> = {
    konsep: { ...EMPTY.konsep },
    prinsip: { ...EMPTY.prinsip },
    verbal: { ...EMPTY.verbal },
  };
  for (const r of riwayat) {
    const s = stat[r.domain];
    if (!s) continue;
    s.total++;
    if (r.benar) s.benar++;
  }
  return stat;
}

/** Miskonsepsi tersering (diurut menurun). */
export function miskonsepsiTersering(riwayat: RiwayatJawaban[]): { id: string; nama: string; count: number }[] {
  const map: Record<string, number> = {};
  for (const r of riwayat) if (r.miskonsepsiId) map[r.miskonsepsiId] = (map[r.miskonsepsiId] || 0) + 1;
  return Object.entries(map)
    .map(([id, count]) => ({
      id,
      count,
      nama: MISKONSEPSI.find((m) => m.id === id)?.nama ?? id,
    }))
    .sort((a, b) => b.count - a.count);
}

/** Persen penguasaan (0..100), -1 bila belum ada data. */
export function persenPenguasaan(s: DomainStat): number {
  if (s.total === 0) return -1;
  return Math.round((s.benar / s.total) * 100);
}

export const MIN_JAWABAN_LABEL = 4; // label "perlu latihan" baru muncul setelah >= 4 jawaban
