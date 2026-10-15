/** Status per-soal Ayo Latihan (tersimpan lewat riwayat). */
import type { RiwayatJawaban } from "./types";

export interface StatusSoal {
  dijawab: boolean; // pernah dijawab (benar atau salah)
  benar: boolean; // pernah dijawab benar
}

/**
 * Hitung status tiap soal sebuah materi dari riwayat.
 * "benar" bersifat lengket: sekali benar, tetap benar (tidak perlu diulang).
 */
export function statusSoalMateri(riwayat: RiwayatJawaban[], soalIds: string[]): Record<string, StatusSoal> {
  const map: Record<string, StatusSoal> = {};
  for (const id of soalIds) map[id] = { dijawab: false, benar: false };
  for (const r of riwayat) {
    const s = map[r.soalId];
    if (!s) continue;
    s.dijawab = true;
    if (r.benar) s.benar = true;
  }
  return map;
}
