import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface AiCoachOrb3DProps {
  isThinking?: boolean;
}

export default function AiCoachOrb3D({ isThinking = false }: AiCoachOrb3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isThinkingRef = useRef(isThinking);
  isThinkingRef.current = isThinking;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Core Sphere
    const orbGeo = new THREE.SphereGeometry(1.2, 48, 48);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x0066ff,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: false,
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    scene.add(orb);

    // Outer Wireframe Lattice Halo
    const wireGeo = new THREE.IcosahedronGeometry(1.45, 3);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireMesh);

    // Orbiting Satellites / Neural Nodes
    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);

    const satMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const satCount = 4;
    for (let i = 0; i < satCount; i++) {
      const satGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const satMesh = new THREE.Mesh(satGeo, satMat);
      const angle = (i / satCount) * Math.PI * 2;
      satMesh.position.set(Math.cos(angle) * 1.8, Math.sin(angle) * 0.9, Math.sin(angle) * 1.8);
      satelliteGroup.add(satMesh);
    }

    // Lights
    const p1 = new THREE.PointLight(0x00f0ff, 4, 10);
    p1.position.set(2, 3, 2);
    scene.add(p1);

    const p2 = new THREE.PointLight(0x8b5cf6, 3, 10);
    p2.position.set(-2, -2, 2);
    scene.add(p2);

    const ambient = new THREE.AmbientLight(0x060b13, 2);
    scene.add(ambient);

    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const speed = isThinkingRef.current ? 2.5 : 1.0;

      // Pulse
      const pulse = 1 + Math.sin(t * 3 * speed) * (isThinkingRef.current ? 0.08 : 0.04);
      orb.scale.set(pulse, pulse, pulse);

      // Rotate meshes
      orb.rotation.y = t * 0.4 * speed;
      orb.rotation.x = Math.sin(t * 0.2) * 0.2;

      wireMesh.rotation.y = -t * 0.3 * speed;
      wireMesh.rotation.z = t * 0.15;

      satelliteGroup.rotation.y = t * 0.8 * speed;
      satelliteGroup.rotation.x = Math.sin(t * 0.5) * 0.3;

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
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      orbGeo.dispose();
      wireGeo.dispose();
      orbMat.dispose();
      wireMat.dispose();
      satMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[260px] flex items-center justify-center relative select-none"
    />
  );
}
