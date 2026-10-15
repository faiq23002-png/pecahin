/**
 * Validasi integritas konten (dijalankan manual, bukan bagian build).
 * Run: npx tsx scripts/validate.ts
 */
import { MISKONSEPSI, SOAL, getSoalByMateri, MATERI } from "../src/lib/content";

const errors: string[] = [];

// 1. jumlah miskonsepsi
if (MISKONSEPSI.length !== 18) errors.push(`Miskonsepsi: ${MISKONSEPSI.length} (harus 18)`);

// 2. jumlah soal
if (SOAL.length !== 30) errors.push(`Soal: ${SOAL.length} (harus 30)`);

// 3. 10 soal per materi
for (const m of MATERI) {
  const n = getSoalByMateri(m.id).length;
  if (n !== 10) errors.push(`${m.id}: ${n} soal (harus 10)`);
}

// 4. tiap soal punya tepat 1 benar
for (const s of SOAL) {
  const benar = s.pilihan.filter((p) => p.benar);
  if (benar.length !== 1) errors.push(`${s.id}: ${benar.length} jawaban benar (harus 1)`);
}

// 5. miskonsepsiId valid
const ids = new Set(MISKONSEPSI.map((m) => m.id));
for (const s of SOAL) {
  for (const p of s.pilihan) {
    if (p.miskonsepsiId && !ids.has(p.miskonsepsiId)) {
      errors.push(`${s.id}: miskonsepsi tak dikenal "${p.miskonsepsiId}"`);
    }
  }
}

// 6. coverage miskonsepsi (semua terpakai minimal sekali)
const used = new Set<string>();
for (const s of SOAL) for (const p of s.pilihan) if (p.miskonsepsiId) used.add(p.miskonsepsiId);
for (const m of MISKONSEPSI) if (!used.has(m.id)) errors.push(`Miskonsepsi ${m.id} tidak pernah dipakai`);

// 7. pengecoh bernilai beda dalam satu soal (tak ada duplikat teks pilihan)
for (const s of SOAL) {
  const seen = new Set<string>();
  for (const p of s.pilihan) {
    if (seen.has(p.teks)) errors.push(`${s.id}: pilihan duplikat "${p.teks}"`);
    seen.add(p.teks);
  }
}

// 8. jawabanBenar ada di pilihan
for (const s of SOAL) {
  if (!s.pilihan.some((p) => p.teks === s.jawabanBenar)) {
    errors.push(`${s.id}: jawabanBenar "${s.jawabanBenar}" tidak ada di pilihan`);
  }
}

// rangkuman
console.log(`Miskonsepsi: ${MISKONSEPSI.length}`);
console.log(`Soal: ${SOAL.length}`);
for (const m of MATERI) console.log(`  ${m.id}: ${getSoalByMateri(m.id).length} soal`);
console.log(`Miskonsepsi terpakai: ${used.size}/${MISKONSEPSI.length}`);

if (errors.length) {
  console.log("\n❌ ERROR:");
  errors.forEach((e) => console.log("  - " + e));
  process.exit(1);
} else {
  console.log("\n✅ Semua validasi lolos.");
}
