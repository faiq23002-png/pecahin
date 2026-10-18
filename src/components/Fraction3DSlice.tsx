/**
 * Fraction3DSlice.tsx
 * Visualisasi Pecahan 3D Interaktif menggunakan Three.js
 * - Semangka 3D: daging merah + lapisan putih + kulit hijau (rind) yang NEMPEL.
 * - Drag horizontal untuk memutar orbital.
 * - Tombol "Potong" untuk menambah pecahan (k/n) + animasi kilat pisau.
 * - Potongan terpilih (k) terangkat keluar & menyala.
 */
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { sfx } from "@/lib/audio";
import type { ObjKind } from "@/lib/types";

interface Fraction3DProps {
  n: number; // jumlah total bagian (penyebut)
  k: number; // jumlah bagian yang diarsir / diambil
  kind?: ObjKind;
  onSliceCut?: () => void;
  className?: string;
  allowSwipeCut?: boolean;
}

// Warna 3D + topping per jenis objek
type Topping = "seeds" | "sesame" | "pepperoni" | "sprinkles" | "leaf" | "none";
const KIND_3D: Record<ObjKind, { flesh: number; active: number; inner: number; outer: number; topping: Topping }> = {
  semangka: { flesh: 0xe11d48, active: 0xff1744, inner: 0xfef9c3, outer: 0x15803d, topping: "seeds" },
  jeruk: { flesh: 0xf97316, active: 0xfdba74, inner: 0xffedc5, outer: 0xc2410c, topping: "leaf" },
  apel: { flesh: 0xfef08a, active: 0xfff9c4, inner: 0xfefce8, outer: 0xdc2626, topping: "seeds" },
  melon: { flesh: 0x84cc16, active: 0xa3e635, inner: 0xecfccb, outer: 0x166534, topping: "seeds" },
  naga: { flesh: 0xd946ef, active: 0xf0abfc, inner: 0xfce7f3, outer: 0x059669, topping: "seeds" },
  "kue-tart": { flesh: 0xec4899, active: 0xf472b6, inner: 0xfce7f3, outer: 0xa16207, topping: "sprinkles" },
  pizza: { flesh: 0xfacc15, active: 0xfde047, inner: 0xfef3c7, outer: 0x92400e, topping: "pepperoni" },
  roti: { flesh: 0xd97706, active: 0xf59e0b, inner: 0xfef3c7, outer: 0xb45309, topping: "sesame" },
  cokelat: { flesh: 0x92400e, active: 0xa16207, inner: 0xd6d3d1, outer: 0x451a03, topping: "sprinkles" },
  keju: { flesh: 0xfde047, active: 0xfef08a, inner: 0xfefce8, outer: 0xca8a04, topping: "sesame" },
  "kue-batang": { flesh: 0xf9a8d4, active: 0xfbcfe8, inner: 0xfce7f3, outer: 0xd97706, topping: "sprinkles" },
};

export function Fraction3DSlice({
  n = 4,
  k = 1,
  kind = "semangka",
  onSliceCut,
  className = "",
  allowSwipeCut = true,
}: Fraction3DProps) {
  const cfg = KIND_3D[kind];
  const containerRef = useRef<HTMLDivElement>(null);
  const [cutFx, setCutFx] = useState(false);
  const [knifeY, setKnifeY] = useState<number | null>(null);
  const doCutRef = useRef<() => void>(() => {});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 240;

    // Fallback bila WebGL tidak tersedia
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      container.innerHTML = '<p class="text-center text-xs font-bold text-slate-500 p-6">⚠️ Perangkat tidak mendukung tampilan 3D</p>';
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.4, 5.2);
    camera.lookAt(0, 0, 0);

    // ===== Pencahayaan =====
    scene.add(new THREE.AmbientLight(0xfff8ee, 1.3));
    const dir = new THREE.DirectionalLight(0xffffff, 1.6);
    dir.position.set(4, 8, 5);
    dir.castShadow = true;
    scene.add(dir);
    const back = new THREE.PointLight(0xfef08a, 0.7, 10);
    back.position.set(-3, 2, -3);
    scene.add(back);

    // ===== Piring kayu =====
    const plate = new THREE.Mesh(
      new THREE.CylinderGeometry(2.05, 2.2, 0.16, 44),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.55, metalness: 0.05 }),
    );
    plate.position.y = -0.55;
    plate.receiveShadow = true;
    scene.add(plate);

    // ===== Potongan semangka =====
    const slicesGroup = new THREE.Group();
    slicesGroup.position.y = -0.3;
    scene.add(slicesGroup);

    const radius = 1.4;
    const rindWhite = 0.05;
    const rindGreen = 0.16;
    const sliceHeight = 0.6;
    const sliceAngle = (Math.PI * 2) / n;

    const matFlesh = new THREE.MeshStandardMaterial({ color: cfg.flesh, roughness: 0.4 });
    const matActive = new THREE.MeshStandardMaterial({ color: cfg.active, roughness: 0.3, emissive: cfg.active, emissiveIntensity: 0.35 });
    const matWhite = new THREE.MeshStandardMaterial({ color: cfg.inner, roughness: 0.6 });
    const matGreen = new THREE.MeshStandardMaterial({ color: cfg.outer, roughness: 0.5 });
    const matSeed = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.5 });
    const seedGeo = new THREE.SphereGeometry(0.045, 10, 8);
    const sesameGeo = new THREE.SphereGeometry(0.028, 8, 6);
    const sesameMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.5 });
    const pepperoniGeo = new THREE.SphereGeometry(0.075, 10, 8);
    const pepperoniMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 });
    const sprinkleGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.06, 6);
    const sprinkleMats = [0xec4899, 0x3b82f6, 0xfbbf24, 0x22c55e, 0xf97316, 0xfef9c3].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.4 }));
    const leafGeo = new THREE.SphereGeometry(0.05, 8, 6);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.5 });

    const sliceGroups: THREE.Group[] = [];

    for (let i = 0; i < n; i++) {
      const group = new THREE.Group();
      const start = i * sliceAngle;
      const end = start + sliceAngle;
      const mid = start + sliceAngle / 2;
      const isActive = i < k;

      // Daging merah (sektor 0..radius) — titik pusat TETAP di origin, jadi membentuk lingkaran
      const fleshShape = new THREE.Shape();
      fleshShape.moveTo(0, 0);
      fleshShape.absarc(0, 0, radius, start, end, false);
      fleshShape.lineTo(0, 0);
      const flesh = new THREE.Mesh(
        new THREE.ExtrudeGeometry(fleshShape, { depth: sliceHeight, bevelEnabled: false }),
        isActive ? matActive : matFlesh,
      );
      flesh.castShadow = true;
      flesh.receiveShadow = true;
      group.add(flesh);

      // Lapisan putih (radius..radius+rindWhite)
      const whiteShape = new THREE.Shape();
      whiteShape.absarc(0, 0, radius + rindWhite, start, end, false);
      whiteShape.absarc(0, 0, radius, end, start, true);
      whiteShape.closePath();
      group.add(new THREE.Mesh(new THREE.ExtrudeGeometry(whiteShape, { depth: sliceHeight, bevelEnabled: false }), matWhite));

      // Kulit hijau (radius+rindWhite .. radius+rindWhite+rindGreen)
      const greenShape = new THREE.Shape();
      greenShape.absarc(0, 0, radius + rindWhite + rindGreen, start, end, false);
      greenShape.absarc(0, 0, radius + rindWhite, end, start, true);
      greenShape.closePath();
      group.add(new THREE.Mesh(new THREE.ExtrudeGeometry(greenShape, { depth: sliceHeight, bevelEnabled: false }), matGreen));

      // Topping di atas objek (biji / wijen / pepperoni / meses / daun)
      if (cfg.topping !== "none") {
        const count = cfg.topping === "sprinkles" ? 4 : cfg.topping === "sesame" ? 3 : cfg.topping === "pepperoni" ? 2 : 3;
        for (let s = 0; s < count; s++) {
          const rr = radius * (0.35 + ((s + 0.5) / count) * 0.55);
          const aa = start + sliceAngle * ((s + 0.5) / count);
          let geo: THREE.BufferGeometry;
          let mat: THREE.Material;
          if (cfg.topping === "seeds") { geo = seedGeo; mat = matSeed; }
          else if (cfg.topping === "sesame") { geo = sesameGeo; mat = sesameMat; }
          else if (cfg.topping === "pepperoni") { geo = pepperoniGeo; mat = pepperoniMat; }
          else if (cfg.topping === "sprinkles") { geo = sprinkleGeo; mat = sprinkleMats[s % sprinkleMats.length]; }
          else { geo = leafGeo; mat = leafMat; }
          const topping = new THREE.Mesh(geo, mat);
          topping.position.set(Math.cos(aa) * rr, Math.sin(aa) * rr, sliceHeight + 0.02);
          if (cfg.topping === "leaf") topping.scale.set(1.4, 0.9, 0.4);
          else if (cfg.topping === "sprinkles") topping.scale.set(1, 1, 1);
          else topping.scale.set(1, 1, 0.45);
          group.add(topping);
        }
      }

      // Rebahkan (lokal XY → dunia XZ, tebal → sumbu Y)
      group.rotation.x = -Math.PI / 2;

      // Potongan terpilih terangkat keluar (arah radial + naik)
      if (isActive) {
        group.position.set(Math.cos(mid) * 0.42, 0.2, -Math.sin(mid) * 0.42);
      }

      slicesGroup.add(group);
      sliceGroups.push(group);
    }

    // ===== Interaksi: putar (drag horizontal) + potong (swipe vertikal) =====
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let mode: "idle" | "rotate" | "cut" = "idle";
    let autoRotate = true;
    let autoTimer: number | undefined;
    let separateUntil = 0;

    doCutRef.current = () => {
      separateUntil = performance.now() + 550;
      setCutFx(true);
      window.setTimeout(() => setCutFx(false), 420);
      if (onSliceCut) {
        sfx("whoosh");
        onSliceCut();
      }
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      lastX = e.clientX;
      mode = "idle";
      autoRotate = false;
      if (autoTimer) window.clearTimeout(autoTimer);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      if (mode === "idle") {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 14) mode = "cut";
        else if (Math.abs(dx) > 10) mode = "rotate";
      }
      if (mode === "rotate") {
        slicesGroup.rotation.y += (e.clientX - lastX) * 0.012;
        lastX = e.clientX;
      } else if (mode === "cut") {
        const rect = container.getBoundingClientRect();
        setKnifeY(e.clientY - rect.top);
      }
    };
    const onUp = () => {
      if (mode === "cut") doCutRef.current();
      dragging = false;
      mode = "idle";
      setKnifeY(null);
      autoTimer = window.setTimeout(() => {
        autoRotate = true;
      }, 3000);
    };

    const dom = renderer.domElement;
    dom.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    container.innerHTML = "";
    container.appendChild(dom);

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (autoRotate) slicesGroup.rotation.y += 0.005;
      const now = performance.now();
      if (now < separateUntil) {
        const t = (separateUntil - now) / 550;
        slicesGroup.scale.setScalar(1 + Math.sin(t * Math.PI) * 0.22);
      } else {
        slicesGroup.scale.setScalar(1);
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      if (autoTimer) window.clearTimeout(autoTimer);
      dom.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else if (m) m.dispose();
      });
      renderer.dispose();
      if (container.contains(dom)) container.removeChild(dom);
    };
  }, [n, k]);

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <div
        ref={containerRef}
        className="w-full h-56 cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden relative touch-none"
      />

      {/* Pisau mengikuti swipe */}
      {knifeY !== null && (
        <div className="pointer-events-none absolute inset-x-0 z-10" style={{ top: knifeY }}>
          <div className="h-[3px] bg-gradient-to-r from-transparent via-amber-100 to-transparent shadow-[0_0_14px_#fef08a]" />
          <span className="absolute -top-3 right-4 text-2xl drop-shadow-[0_0_10px_#fef08a]">🔪</span>
        </div>
      )}

      {/* Kilat pisau saat memotong */}
      {cutFx && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <span className="animate-pop text-5xl drop-shadow-[0_0_12px_#fef08a]">🔪</span>
        </div>
      )}

      <div className="mt-1.5 flex items-center gap-2">
        {allowSwipeCut && onSliceCut && (
          <button
            type="button"
            onClick={() => doCutRef.current()}
            className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-4 py-1.5 font-display text-xs font-extrabold text-white shadow-md transition active:scale-95"
          >
            🔪 Potong
          </button>
        )}
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/60 px-3 py-1 text-[11px] font-bold text-amber-200 border border-amber-300/30">
          {onSliceCut ? "🔪 Swipe bawah = potong · 🔄 geser = putar" : "🔄 Geser untuk memutar"}
        </span>
      </div>
    </div>
  );
}
