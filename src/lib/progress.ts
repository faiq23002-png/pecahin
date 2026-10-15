/** Progres materi + aturan unlock. */
import type { ProgressMateri } from "./types";
import { MATERI } from "./content";

export const KRITERIA_SELESAI = 7; // minimal 7 benar dari 10
export const MAKS_PERCOBAAN = 3;

export function defaultProgress(): Record<string, ProgressMateri> {
  const p: Record<string, ProgressMateri> = {};
  for (const m of MATERI) {
    p[m.id] = {
      materiId: m.id,
      tahapBelajar: m.urutan === 1 ? "terbuka" : "terkunci",
      tahapCoba: "terkunci",
      tahapLatihan: "terkunci",
      selesai: false,
      percobaanLatihan: 0,
    };
  }
  return p;
}

export function nextMateri(id: string): string | null {
  const idx = MATERI.findIndex((m) => m.id === id);
  return idx >= 0 && idx < MATERI.length - 1 ? MATERI[idx + 1].id : null;
}

/** Materi terbuka bila tahapBelajar-nya bukan "terkunci". */
export function isMateriTerbuka(progress: Record<string, ProgressMateri>, materiId: string): boolean {
  const p = progress[materiId];
  if (!p) return false;
  return p.tahapBelajar !== "terkunci";
}

export function semuaSelesai(progress: Record<string, ProgressMateri>): boolean {
  return MATERI.every((m) => progress[m.id]?.selesai);
}

/** Tahap berikutnya dalam satu materi (belajar→coba→latihan). */
export function tahapBerikutnya(tahap: keyof Pick<ProgressMateri, "tahapBelajar" | "tahapCoba" | "tahapLatihan">) {
  if (tahap === "tahapBelajar") return "tahapCoba" as const;
  if (tahap === "tahapCoba") return "tahapLatihan" as const;
  return null;
}

export function tahapSebelumnya(tahap: "tahapBelajar" | "tahapCoba" | "tahapLatihan") {
  if (tahap === "tahapCoba") return "tahapBelajar" as const;
  if (tahap === "tahapLatihan") return "tahapCoba" as const;
  return null;
}

/** Persen progres sebuah materi = jumlah tahap selesai / 3. */
export function progresMateri(p: ProgressMateri | undefined): number {
  if (!p) return 0;
  let n = 0;
  if (p.tahapBelajar === "selesai") n++;
  if (p.tahapCoba === "selesai") n++;
  if (p.tahapLatihan === "selesai") n++;
  return Math.round((n / 3) * 100);
}

/** Jumlah tahap yang sudah selesai (0..3). */
export function tahapSelesai(p: ProgressMateri | undefined): number {
  if (!p) return 0;
  let n = 0;
  if (p.tahapBelajar === "selesai") n++;
  if (p.tahapCoba === "selesai") n++;
  if (p.tahapLatihan === "selesai") n++;
  return n;
}
