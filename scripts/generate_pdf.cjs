const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT_DIR = path.resolve(__dirname, "..");
const MD_PATH = path.join(ROOT_DIR, "DOKUMENTASI_LENGKAP_PECAH_IN.md");
const HTML_OUT = path.join(ROOT_DIR, "dokumentasi_temp.html");
const PDF_OUT = path.join(ROOT_DIR, "DOKUMENTASI_LENGKAP_PECAH_IN.pdf");
const LOGO_PATH = path.join(ROOT_DIR, "public", "logo-pecahin-trans.png");

// Base64 logo
let logoBase64 = "";
if (fs.existsSync(LOGO_PATH)) {
  logoBase64 = "data:image/png;base64," + fs.readFileSync(LOGO_PATH).toString("base64");
}

const mdContent = fs.readFileSync(MD_PATH, "utf-8");

const htmlTemplate = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Dokumentasi Lengkap PECAH-IN</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>

  <style>
    @page {
      size: A4 portrait;
      margin: 18mm 14mm 20mm 14mm;
      @bottom-right {
        content: counter(page);
      }
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 10.5pt;
      line-height: 1.6;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }

    /* ================= COVER PAGE ================= */
    .cover-page {
      page-break-after: always;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 92vh;
      text-align: center;
      padding: 40px 20px;
      border: 8px double #b45309;
      border-radius: 24px;
      background: linear-gradient(180deg, #fffbeb 0%, #ffffff 60%, #fff7ed 100%);
      box-shadow: inset 0 0 40px rgba(180, 83, 9, 0.05);
      position: relative;
    }

    .cover-logo {
      max-width: 260px;
      height: auto;
      margin-bottom: 24px;
      filter: drop-shadow(0 10px 15px rgba(0,0,0,0.12));
    }

    .cover-badge {
      display: inline-block;
      background: #78350f;
      color: #fef3c7;
      font-family: 'Baloo 2', sans-serif;
      font-size: 11pt;
      font-weight: 800;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 6px 20px;
      border-radius: 9999px;
      margin-bottom: 20px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .cover-title {
      font-family: 'Baloo 2', cursive, sans-serif;
      font-size: 28pt;
      font-weight: 800;
      line-height: 1.2;
      color: #78350f;
      margin: 0 0 12px 0;
    }

    .cover-subtitle {
      font-family: 'Baloo 2', sans-serif;
      font-size: 16pt;
      font-weight: 700;
      color: #c2410c;
      margin: 0 0 28px 0;
    }

    .cover-divider {
      width: 140px;
      height: 4px;
      background: linear-gradient(90deg, #f59e0b, #b45309);
      border-radius: 4px;
      margin: 0 auto 30px auto;
    }

    .cover-desc {
      max-width: 540px;
      font-size: 11pt;
      color: #475569;
      line-height: 1.6;
      margin-bottom: 40px;
    }

    .cover-meta {
      margin-top: auto;
      padding-top: 24px;
      border-top: 1px solid #fde68a;
      width: 100%;
      max-width: 480px;
      display: flex;
      justify-content: space-between;
      font-size: 9.5pt;
      color: #64748b;
      font-weight: 700;
    }

    /* ================= MAIN CONTENT TYPOGRAPHY ================= */
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Baloo 2', cursive, sans-serif;
      color: #78350f;
      margin-top: 1.6em;
      margin-bottom: 0.5em;
      line-height: 1.25;
    }

    h1 {
      font-size: 20pt;
      font-weight: 800;
      border-bottom: 3px solid #f59e0b;
      padding-bottom: 8px;
      margin-top: 0;
    }

    h2 {
      font-size: 15pt;
      font-weight: 800;
      color: #92400e;
      border-bottom: 1.5px solid #fed7aa;
      padding-bottom: 6px;
      page-break-before: always;
    }

    /* Biar bab awal tidak page break berlebih */
    .content > h2:first-of-type {
      page-break-before: avoid;
    }

    h3 {
      font-size: 12.5pt;
      font-weight: 700;
      color: #0f766e;
    }

    p {
      margin: 0 0 10pt 0;
      text-align: justify;
    }

    ul, ol {
      margin: 0 0 10pt 0;
      padding-left: 22px;
    }

    li {
      margin-bottom: 4pt;
    }

    strong, b {
      font-weight: 800;
      color: #0f172a;
    }

    /* ================= TABLES ================= */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16pt 0;
      font-size: 9.5pt;
      page-break-inside: avoid;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #cbd5e1;
    }

    th {
      background: #78350f;
      color: #ffffff;
      font-family: 'Baloo 2', sans-serif;
      font-weight: 700;
      text-align: left;
      padding: 8pt 10pt;
      border: 1px solid #78350f;
    }

    td {
      padding: 7pt 10pt;
      border: 1px solid #e2e8f0;
      vertical-align: top;
    }

    tr:nth-child(even) {
      background: #fffbeb;
    }

    /* ================= BLOCKQUOTES / CALLOUTS ================= */
    blockquote {
      margin: 14pt 0;
      padding: 10pt 16pt;
      background: #f0fdfa;
      border-left: 5px solid #0f766e;
      border-radius: 0 12px 12px 0;
      color: #134e4a;
      font-size: 9.5pt;
    }

    blockquote p {
      margin: 0;
    }

    /* ================= CODE & MERMAID ================= */
    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9pt;
      background: #f1f5f9;
      color: #b45309;
      padding: 2px 5px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    pre {
      background: #1e293b;
      color: #f8fafc;
      padding: 12pt;
      border-radius: 12px;
      overflow-x: auto;
      font-size: 8.5pt;
      margin: 12pt 0;
      page-break-inside: avoid;
    }

    pre code {
      background: transparent;
      color: inherit;
      padding: 0;
      border: none;
    }

    .mermaid {
      text-align: center;
      margin: 20pt auto;
      padding: 16pt 10pt;
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.04);
      page-break-inside: avoid;
    }

    .mermaid svg {
      max-width: 100% !important;
      height: auto !important;
    }

    hr {
      border: none;
      height: 1px;
      background: #e2e8f0;
      margin: 24pt 0;
    }

    /* Footer / Running Header */
    .doc-footer {
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 8pt;
      margin-top: 30pt;
    }
  </style>
</head>
<body>

  <!-- ================= HALAMAN SAMPUL RESMI ================= -->
  <div class="cover-page">
    ${logoBase64 ? `<img src="${logoBase64}" class="cover-logo" alt="Logo PECAH-IN" />` : ''}
    <div class="cover-badge">BUKU DOKUMENTASI SISTEM & PEDAGOGIS</div>
    <h1 class="cover-title">PECAH-IN</h1>
    <div class="cover-subtitle">Petualangan Pecahan di Pasar Tradisional</div>
    <div class="cover-divider"></div>
    <div class="cover-desc">
      Dokumentasi Lengkap Rancangan Sistem, Arsitektur Teknologi, Modul Pembelajaran Interaktif 3D, Diagnosis Miskonsepsi, Gamifikasi, dan Alur Perjalanan Pengguna.
    </div>
    <div class="cover-meta">
      <span>Edisi: FIP Championship 2026</span>
      <span>Versi: 0.1.0</span>
      <span>Tahun: 2026</span>
    </div>
  </div>

  <!-- ================= KONTEN MARKDOWN TERFORMAT ================= -->
  <div class="content" id="doc-container">
    <div style="text-align: center; padding: 40px; color: #64748b;">Memformat dokumen...</div>
  </div>

  <textarea id="markdown-raw" style="display: none;">${mdContent.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</textarea>

  <script>
    document.addEventListener("DOMContentLoaded", function() {
      const rawText = document.getElementById("markdown-raw").value
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");

      const renderer = new marked.Renderer();
      
      // Override renderer code block untuk mengenali mermaid
      renderer.code = function({ text, lang }) {
        if (lang === "mermaid") {
          return '<div class="mermaid">' + text + '</div>';
        }
        return '<pre><code class="language-' + (lang || 'text') + '">' + text + '</code></pre>';
      };

      marked.use({ renderer });
      document.getElementById("doc-container").innerHTML = marked.parse(rawText);

      // Inisialisasi Mermaid
      mermaid.initialize({
        startOnLoad: false,
        theme: 'forest',
        securityLevel: 'loose',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis'
        },
        sequence: {
          useMaxWidth: true,
          showSequenceNumbers: true
        }
      });

      mermaid.run().then(() => {
        window.STATUS_READY = true;
      });
    });
  </script>
</body>
</html>`;

fs.writeFileSync(HTML_OUT, htmlTemplate, "utf-8");
console.log("HTML berhasil dibuat di:", HTML_OUT);

// Eksekusi Headless Chrome untuk export PDF
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const cmd = `"${chromePath}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --virtual-time-budget=8000 --print-to-pdf="${PDF_OUT}" "${HTML_OUT}"`;

console.log("Menjalankan Google Chrome Headless untuk cetak PDF...");
try {
  execSync(cmd, { stdio: "inherit" });
  console.log("✅ PDF Berhasil Dibuat di:", PDF_OUT);
  const stats = fs.statSync(PDF_OUT);
  console.log("Ukuran Berkas PDF:", (stats.size / 1024 / 1024).toFixed(2), "MB (" + stats.size + " bytes)");
} catch (err) {
  console.error("Gagal mencetak PDF:", err);
  process.exit(1);
}
