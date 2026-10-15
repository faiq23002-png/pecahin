/** Turunkan operand dari teks soal untuk garis bilangan (Cek Masuk Akal). */
import type { Soal } from "./types";

/**
 * Mengembalikan dua operand pecahan (nilai 0..1) bila teks soal memuat pecahan
 * (penjumlahan, perbandingan, senilai, atau arsir visual), selain itu null.
 */
export function operandDari(soal: Soal): [number, number] | null {
  if (!soal || !soal.teks) return null;

  // 1. Penjumlahan: "1/4 + 2/4"
  const mAdd = soal.teks.match(/(\d+)\/(\d+)\s*\+\s*(\d+)\/(\d+)/);
  if (mAdd) {
    const a = Number(mAdd[1]) / Number(mAdd[2]);
    const c = Number(mAdd[3]) / Number(mAdd[4]);
    return [a, c];
  }

  // 2. Dua pecahan (perbandingan / senilai): "1/2 dan 2/4", "3/8 dengan 5/8"
  const allFracs = Array.from(soal.teks.matchAll(/(\d+)\/(\d+)/g));
  if (allFracs.length >= 2) {
    const v1 = Number(allFracs[0][1]) / Number(allFracs[0][2]);
    const v2 = Number(allFracs[1][1]) / Number(allFracs[1][2]);
    return [v1, v2];
  }

  // 3. Satu pecahan tunggal (misal arsir 3/4)
  if (allFracs.length === 1) {
    const v = Number(allFracs[0][1]) / Number(allFracs[0][2]);
    return [0, v];
  }

  return null;
}

