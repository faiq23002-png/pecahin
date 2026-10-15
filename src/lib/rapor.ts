/** Generate rapor PDF (jspdf). MVP: teks + bar penguasaan sederhana. */
import { jsPDF } from "jspdf";
import type { Profil } from "./types";
import { hitungPenguasaan, miskonsepsiTersering, persenPenguasaan } from "./diagnosis";
import { getMateri } from "./content";
import type { RiwayatJawaban } from "./types";

const DOMAIN_LABEL: Record<string, string> = {
  konsep: "Konsep",
  prinsip: "Prinsip",
  verbal: "Verbal",
};

export function simpanRaporPDF(profil: Profil, riwayat: RiwayatJawaban[], progress: Record<string, { selesai: boolean }>, poin: number) {
  const doc = new jsPDF();
  const W = doc.internal.pageSize.getWidth();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Rapor Belajar PECAH-IN", W / 2, 20, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Nama: ${profil.nama}   ·   Poin: ${poin}/100   ·   Tanggal: ${new Date().toLocaleDateString("id-ID")}`, W / 2, 30, { align: "center" });

  let y = 44;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Penguasaan per domain", 14, y);
  y += 8;

  const stat = hitungPenguasaan(riwayat);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  for (const d of ["konsep", "prinsip", "verbal"] as const) {
    const s = stat[d];
    const pct = persenPenguasaan(s);
    const label = pct < 0 ? "belum ada data" : `${pct}%  (${s.benar} dari ${s.total})`;
    doc.text(`${DOMAIN_LABEL[d]}: ${label}`, 18, y);
    y += 7;
  }

  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Materi selesai", 14, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  for (const m of ["m1", "m2", "m3"] as const) {
    const mat = getMateri(m);
    doc.text(`${mat?.judul ?? m}: ${progress[m]?.selesai ? "Selesai" : "Belum"}`, 18, y);
    y += 7;
  }

  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Miskonsepsi yang perlu diperhatikan", 14, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const top = miskonsepsiTersering(riwayat).slice(0, 5);
  if (top.length === 0) {
    doc.text("Belum ada data.", 18, y);
  } else {
    for (const t of top) {
      doc.text(`- ${t.nama} (${t.count}x)`, 18, y);
      y += 7;
    }
  }

  doc.save("rapor-pecah-in.pdf");
}
