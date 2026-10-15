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

interface Fraction3DProps {
  n: number; // jumlah total bagian (penyebut)
  k: number; // jumlah bagian yang diarsir / diambil
  onSliceCut?: () => void;
  className?: string;
  allowSwipeCut?: boolean;
}

export function Fraction3DSlice({
  n = 4,
  k = 1,
  onSliceCut,
  className = "",
  allowSwipeCut = true,
}: Fraction3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cutFx, setCutFx] = useState(false);

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

    const matFlesh = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.4 });
    const matActive = new THREE.MeshStandardMaterial({ color: 0xff1744, roughness: 0.3, emissive: 0x881337, emissiveIntensity: 0.4 });
    const matWhite = new THREE.MeshStandardMaterial({ color: 0xfef9c3, roughness: 0.6 });
    const matGreen = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 });
    const matSeed = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.5 });
    const seedGeo = new THREE.SphereGeometry(0.045, 10, 8);

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

      // Biji di atas daging
      const seedSpots = [
        { r: radius * 0.45, a: mid },
        { r: radius * 0.7, a: start + sliceAngle * 0.35 },
        { r: radius * 0.7, a: start + sliceAngle * 0.65 },
      ];
      for (const sp of seedSpots) {
        const seed = new THREE.Mesh(seedGeo, matSeed);
        seed.position.set(Math.cos(sp.a) * sp.r, Math.sin(sp.a) * sp.r, sliceHeight + 0.02);
        seed.scale.set(1, 1, 0.42);
        group.add(seed);
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

    // ===== Interaksi putar (drag horizontal) =====
    let dragging = false;
    let prevX = 0;
    let autoRotate = true;
    let autoTimer: number | undefined;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      prevX = e.clientX;
      autoRotate = false;
      if (autoTimer) window.clearTimeout(autoTimer);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - prevX;
      slicesGroup.rotation.y += dx * 0.012;
      prevX = e.clientX;
    };
    const onUp = () => {
      dragging = false;
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

  const potong = () => {
    if (!onSliceCut) return;
    setCutFx(true);
    sfx("whoosh");
    onSliceCut();
    window.setTimeout(() => setCutFx(false), 420);
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <div
        ref={containerRef}
        className="w-full h-56 cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden relative touch-none"
      />

      {/* Kilat pisau saat memotong */}
      {cutFx && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="animate-pop text-5xl drop-shadow-[0_0_12px_#fef08a]">🔪</span>
        </div>
      )}

      <div className="mt-1.5 flex items-center gap-2">
        {allowSwipeCut && onSliceCut && (
          <button
            type="button"
            onClick={potong}
            className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-4 py-1.5 font-display text-xs font-extrabold text-white shadow-md transition active:scale-95"
          >
            🔪 Potong Semangka
          </button>
        )}
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/60 px-3 py-1 text-[11px] font-bold text-amber-200 border border-amber-300/30">
          🔄 Geser untuk memutar
        </span>
      </div>
    </div>
  );
}
