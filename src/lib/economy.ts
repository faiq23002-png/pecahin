/** Ekonomi bintang & koin + anti-farming (sinkron §15 proposal). */

export const CAP_BINTANG_HARIAN = 12;
export const CAP_KOIN_HARIAN = 30;
export const BINTANG_LATIHAN_PER_SESI = 3; // maks 3 bintang per sesi latihan
export const KOIN_PER_GAME_BENAR = 5; // koin per ronde game benar
export const CAP_GAME_PER_HARI = 2; // maks 2 bintang per game per hari

/** Berapa bintang yang boleh ditambahkan hari ini (tidak pernah negatif). */
export function sisaBintangHarian(bintangHariIni: number): number {
  return Math.max(0, CAP_BINTANG_HARIAN - bintangHariIni);
}

export function sisaKoinHarian(koinHariIni: number): number {
  return Math.max(0, CAP_KOIN_HARIAN - koinHariIni);
}
