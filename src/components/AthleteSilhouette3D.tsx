import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Flame, Zap, ArrowRight, Dumbbell } from "lucide-react";

interface AthleteSilhouette3DProps {
  onGetStarted?: () => void;
  showOverlayUI?: boolean;
}

export default function AthleteSilhouette3D({ onGetStarted, showOverlayUI = true }: AthleteSilhouette3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCallout, setActiveCallout] = useState<string | null>("bicep");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 580;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(-0.3, 0.2, 5.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Lighting for Muscular Sculpting
    const ambientLight = new THREE.AmbientLight(0x1a1a24, 2.2);
    scene.add(ambientLight);

    // Key Light (warm highlight)
    const keyLight = new THREE.DirectionalLight(0xffeedd, 3.5);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    // Rim Light (cool back edge)
    const rimLight = new THREE.DirectionalLight(0x7dd3fc, 2.8);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    // Orange Muscle Glow Fill Light
    const orangeGlowLight = new THREE.PointLight(0xff7a00, 4.0, 6);
    orangeGlowLight.position.set(-0.8, 0.8, 1.2);
    scene.add(orangeGlowLight);

    const legGlowLight = new THREE.PointLight(0xff9500, 3.5, 6);
    legGlowLight.position.set(0.6, -0.6, 1.2);
    scene.add(legGlowLight);

    // 3. Athlete Running Mannequin Group
    const runnerGroup = new THREE.Group();
    // Running stride forward lean
    runnerGroup.rotation.y = 0.45;
    runnerGroup.rotation.x = 0.08;
    runnerGroup.position.set(0.1, -0.15, 0);
    scene.add(runnerGroup);

    // Materials matching reference image:
    // Matte White/Clay Muscular Body
    const clayMuscularMat = new THREE.MeshStandardMaterial({
      color: 0xdedfe5,
      metalness: 0.15,
      roughness: 0.38,
    });

    // Dark Athletic Compression Shorts
    const shortsMat = new THREE.MeshStandardMaterial({
      color: 0x111625,
      roughness: 0.7,
      metalness: 0.2,
    });

    // Glowing Orange Active Muscle Material
    const glowingMuscleMat = new THREE.MeshStandardMaterial({
      color: 0xff6b00,
      emissive: 0xff5500,
      emissiveIntensity: 1.4,
      roughness: 0.2,
      metalness: 0.1,
    });

    // Head
    const headGeo = new THREE.SphereGeometry(0.32, 24, 24);
    headGeo.scale(0.85, 1.1, 0.95);
    const head = new THREE.Mesh(headGeo, clayMuscularMat);
    head.position.set(-0.25, 1.85, 0.35);
    runnerGroup.add(head);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.18, 0.24, 0.32, 16);
    const neck = new THREE.Mesh(neckGeo, clayMuscularMat);
    neck.position.set(-0.2, 1.55, 0.28);
    neck.rotation.x = 0.2;
    runnerGroup.add(neck);

    // Upper Torso / Ribcage (Athletic V-Taper, tilted forward in run)
    const chestGeo = new THREE.CylinderGeometry(0.55, 0.42, 0.8, 16);
    const chest = new THREE.Mesh(chestGeo, clayMuscularMat);
    chest.position.set(-0.1, 1.05, 0.18);
    chest.rotation.x = 0.28;
    chest.rotation.z = -0.05;
    runnerGroup.add(chest);

    // Pectoral Muscle Plates
    const pecGeo = new THREE.BoxGeometry(0.38, 0.25, 0.18);
    const leftPec = new THREE.Mesh(pecGeo, clayMuscularMat);
    leftPec.position.set(-0.28, 1.18, 0.45);
    leftPec.rotation.x = 0.25;
    leftPec.rotation.y = -0.15;
    runnerGroup.add(leftPec);

    const rightPec = new THREE.Mesh(pecGeo, clayMuscularMat);
    rightPec.position.set(0.12, 1.18, 0.42);
    rightPec.rotation.x = 0.25;
    rightPec.rotation.y = 0.15;
    runnerGroup.add(rightPec);

    // Abdominal Core
    const absGeo = new THREE.CylinderGeometry(0.42, 0.38, 0.55, 16);
    const abs = new THREE.Mesh(absGeo, clayMuscularMat);
    abs.position.set(-0.02, 0.5, 0.05);
    abs.rotation.x = 0.15;
    runnerGroup.add(abs);

    // Pelvis / Compression Running Shorts (Black)
    const pelvisGeo = new THREE.CylinderGeometry(0.42, 0.44, 0.5, 16);
    const pelvis = new THREE.Mesh(pelvisGeo, shortsMat);
    pelvis.position.set(0, 0.05, -0.05);
    runnerGroup.add(pelvis);

    // LEFT ARM (Pumping Forward - HIGHLIGHTED ACTIVE BICEP in reference image!)
    // Left Shoulder / Deltoid
    const shoulderGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const leftShoulder = new THREE.Mesh(shoulderGeo, clayMuscularMat);
    leftShoulder.position.set(-0.65, 1.25, 0.25);
    runnerGroup.add(leftShoulder);

    // Left Bicep (Glowing Orange as in reference image)
    const upperArmGeo = new THREE.CylinderGeometry(0.18, 0.15, 0.55, 16);
    const leftBicep = new THREE.Mesh(upperArmGeo, glowingMuscleMat);
    leftBicep.position.set(-0.85, 0.95, 0.5);
    leftBicep.rotation.x = -0.7;
    leftBicep.rotation.z = 0.3;
    runnerGroup.add(leftBicep);

    // Left Forearm (Bent up in running pump)
    const forearmGeo = new THREE.CylinderGeometry(0.14, 0.11, 0.55, 16);
    const leftForearm = new THREE.Mesh(forearmGeo, clayMuscularMat);
    leftForearm.position.set(-0.95, 0.65, 0.85);
    leftForearm.rotation.x = 1.1;
    leftForearm.rotation.z = 0.1;
    runnerGroup.add(leftForearm);

    // Left Fist
    const fistGeo = new THREE.SphereGeometry(0.11, 12, 12);
    const leftFist = new THREE.Mesh(fistGeo, clayMuscularMat);
    leftFist.position.set(-0.98, 0.85, 1.1);
    runnerGroup.add(leftFist);

    // RIGHT ARM (Pumping Backward)
    const rightShoulder = new THREE.Mesh(shoulderGeo, clayMuscularMat);
    rightShoulder.position.set(0.55, 1.25, 0.1);
    runnerGroup.add(rightShoulder);

    const rightBicep = new THREE.Mesh(upperArmGeo, clayMuscularMat);
    rightBicep.position.set(0.75, 0.9, -0.15);
    rightBicep.rotation.x = 0.85;
    rightBicep.rotation.z = -0.3;
    runnerGroup.add(rightBicep);

    // Right Forearm (Highlighted glowing tricep/arm in reference)
    const rightForearm = new THREE.Mesh(forearmGeo, glowingMuscleMat);
    rightForearm.position.set(0.85, 0.6, -0.55);
    rightForearm.rotation.x = -0.65;
    rightForearm.rotation.z = -0.2;
    runnerGroup.add(rightForearm);

    const rightFist = new THREE.Mesh(fistGeo, clayMuscularMat);
    rightFist.position.set(0.9, 0.45, -0.8);
    runnerGroup.add(rightFist);

    // LEGS: Dynamic Running Stride
    // Left Leg: Driving Forward (Bent Knee - HIGHLIGHTED GLOWING QUAD in reference!)
    const thighGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.75, 16);
    const leftThigh = new THREE.Mesh(thighGeo, shortsMat);
    leftThigh.position.set(-0.35, -0.28, 0.35);
    leftThigh.rotation.x = -0.95;
    leftThigh.rotation.z = 0.2;
    runnerGroup.add(leftThigh);

    // Left Knee & Quad Peak (Glowing Orange as in reference image)
    const kneeGeo = new THREE.SphereGeometry(0.19, 16, 16);
    const leftKnee = new THREE.Mesh(kneeGeo, glowingMuscleMat);
    leftKnee.position.set(-0.42, -0.65, 0.75);
    runnerGroup.add(leftKnee);

    // Left Shin (Tucked back)
    const shinGeo = new THREE.CylinderGeometry(0.16, 0.11, 0.8, 16);
    const leftShin = new THREE.Mesh(shinGeo, clayMuscularMat);
    leftShin.position.set(-0.45, -1.15, 0.55);
    leftShin.rotation.x = 0.7;
    runnerGroup.add(leftShin);

    // Right Leg: Driving Backward (Full Extension)
    const rightThigh = new THREE.Mesh(thighGeo, shortsMat);
    rightThigh.position.set(0.35, -0.35, -0.35);
    rightThigh.rotation.x = 0.85;
    rightThigh.rotation.z = -0.15;
    runnerGroup.add(rightThigh);

    const rightShin = new THREE.Mesh(shinGeo, glowingMuscleMat);
    rightShin.position.set(0.48, -1.05, -0.85);
    rightShin.rotation.x = -0.4;
    runnerGroup.add(rightShin);

    // Floor Soft Shadow Disk
    const shadowGeo = new THREE.CircleGeometry(1.6, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.5,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.75;
    scene.add(shadowMesh);

    // 4. Subtle Interactive Orbiting Drag & Breathing Animation
    let isDragging = false;
    let prevX = 0;
    let targetRotationY = runnerGroup.rotation.y;

    const onDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
    };

    const onMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      prevX = e.clientX;
      targetRotationY += dx * 0.01;
    };

    const onUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth inertia rotation
      runnerGroup.rotation.y += (targetRotationY - runnerGroup.rotation.y) * 0.08;

      // Subtle dynamic running cadence oscillation
      runnerGroup.position.y = -0.15 + Math.sin(elapsed * 2.2) * 0.04;
      runnerGroup.rotation.z = Math.sin(elapsed * 2.2) * 0.02;

      // Pulse muscle glowing materials
      glowingMuscleMat.emissiveIntensity = 1.3 + Math.sin(elapsed * 3.5) * 0.35;
      orangeGlowLight.intensity = 3.5 + Math.sin(elapsed * 3.5) * 1.0;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      dom.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      clayMuscularMat.dispose();
      shortsMat.dispose();
      glowingMuscleMat.dispose();
      shadowMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[520px] sm:min-h-[580px] flex items-center justify-center select-none overflow-hidden">
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing"
      />

      {/* CALLOUT PIN 1: 200 Kcal Burn (Pointing to Left Bicep) */}
      <div
        onClick={() => setActiveCallout("bicep")}
        className="absolute top-[32%] left-[28%] sm:left-[30%] -translate-x-1/2 flex items-center gap-2 z-20 cursor-pointer group"
      >
        <div className="relative flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-orange-500 animate-ping opacity-75 absolute" />
          <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-orange-500 shadow-md shadow-orange-500/50 relative z-10" />
        </div>
        <div className="px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono-tech font-bold tracking-tight shadow-xl flex items-center gap-1.5 group-hover:border-orange-400 transition-all">
          <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
          <span>200 Kcal Burn</span>
        </div>
      </div>

      {/* CALLOUT PIN 2: 400 Kcal Burn (Pointing to Left Quadricep/Knee) */}
      <div
        onClick={() => setActiveCallout("quad")}
        className="absolute top-[58%] right-[22%] sm:right-[26%] translate-x-1/2 flex items-center gap-2 z-20 cursor-pointer group"
      >
        <div className="px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono-tech font-bold tracking-tight shadow-xl flex items-center gap-1.5 group-hover:border-orange-400 transition-all order-1">
          <Zap className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
          <span>400 Kcal Burn</span>
        </div>
        <div className="relative flex items-center justify-center order-2">
          <div className="w-4 h-4 rounded-full bg-orange-500 animate-ping opacity-75 absolute" />
          <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-orange-500 shadow-md shadow-orange-500/50 relative z-10" />
        </div>
      </div>

      {/* Subtle Drag Rotation Hint */}
      <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-slate-950/70 border border-white/10 text-[10px] font-mono-tech text-slate-400 pointer-events-none backdrop-blur-xs">
        360° Drag to Rotate
      </div>

      {/* Screen 1 Bottom Overlay (Title & Signature Get Started Button from Reference) */}
      {showOverlayUI && (
        <div className="absolute bottom-6 left-0 right-0 px-6 z-20 flex flex-col items-center text-center space-y-4 pointer-events-auto">
          {/* Main Title matching reference: "The Journey That Never Stops" */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight leading-tight drop-shadow-md">
            The Journey That <br />
            <span className="text-slate-100">Never Stops</span>
          </h2>

          {/* Signature Reference Pill Button: Orange dumbbell circle + "Get Started" + ">>>" */}
          <button
            onClick={onGetStarted}
            className="w-full max-w-xs py-2.5 pl-2 pr-5 rounded-full bg-slate-900/95 hover:bg-slate-850 active:scale-98 border border-white/15 shadow-2xl transition-all flex items-center justify-between group cursor-pointer"
          >
            {/* Left Orange Circle with Dumbbell */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/40 group-hover:scale-105 transition-transform flex-shrink-0">
              <Dumbbell className="w-5 h-5 fill-white text-white" />
            </div>

            {/* Center Text */}
            <span className="text-sm font-bold text-white tracking-wide">
              Get Started
            </span>

            {/* Right Arrows */}
            <div className="flex items-center text-slate-400 group-hover:text-orange-400 group-hover:translate-x-1 transition-all text-xs font-mono-tech font-bold">
              <span>&gt;&gt;&gt;</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
