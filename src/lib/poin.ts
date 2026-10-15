/** Sistem poin total (maks 100) — dari Ayo Latihan + game. */
import type { ProfilGame, RiwayatJawaban } from "./types";

/** 30 soal Ayo Latihan × 1 poin. */
export const POIN_LATIHAN_MAX = 30;

/** Poin maksimum per game (total game = 70). */
export const POIN_GAME_MAX: Record<string, number> = {
  g1: 15,
  g2: 15,
  g3: 15,
  gCampuran: 25,
};

export const POIN_TOTAL_MAX = 100;
export const GAME_ROUNDS = 10;

/** Poin dari Ayo Latihan: jumlah soal unik yang PERNAH dijawab benar (maks 30). */
export function poinLatihan(riwayat: RiwayatJawaban[]): number {
  const benar = new Set(riwayat.filter((r) => r.benar).map((r) => r.soalId));
  return Math.min(benar.size, POIN_LATIHAN_MAX);
}

/** Poin dari game: proporsional ke skor terbaik tiap game (anti-farming, hanya naik). */
export function poinGame(game: Record<string, ProfilGame>): number {
  let total = 0;
  for (const [id, max] of Object.entries(POIN_GAME_MAX)) {
    const g = game[id];
    if (!g) continue;
    const bagian = Math.min(Math.max(g.skorTerbaik, 0), GAME_ROUNDS) / GAME_ROUNDS;
    total += Math.round(max * bagian);
  }
  return total;
}

export function totalPoin(riwayat: RiwayatJawaban[], game: Record<string, ProfilGame>): number {
  return Math.min(POIN_TOTAL_MAX, poinLatihan(riwayat) + poinGame(game));
}

/** Bintang yang sudah didapat dari sebuah materi (latihan soal unik yang benar). */
export function poinMateri(riwayat: RiwayatJawaban[], daftarSoalId: string[]): number {
  const set = new Set(daftarSoalId);
  const benar = new Set(riwayat.filter((r) => r.benar && set.has(r.soalId)).map((r) => r.soalId));
  return Math.min(benar.size, daftarSoalId.length);
}
