import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MuscleGroupDetail } from "../types.ts";
import { RotateCw, CheckCircle2, Zap, Flame, Activity, Info, ChevronRight, Play } from "lucide-react";

interface BodyMuscleViewer3DProps {
  activeMuscleFilter?: string | null;
  onSelectMuscle?: (muscleName: string) => void;
  onStartMuscleWorkout?: (muscleName: string) => void;
}

const MUSCLE_DATABASE: Record<string, MuscleGroupDetail> = {
  Chest: {
    name: "Pectoralis Major & Minor",
    category: "Push",
    activationScore: 94,
    status: "Peak Pump",
    recoveryHours: 24,
    primaryExercises: ["Incline Barbell Bench Press", "Dumbbell Hex Press", "Cable Crossover Flyes", "Weighted Dips"],
    biomechanicsNote: "Keep shoulder blades retracted and depressed. Flare elbows at a 45° angle to minimize anterior capsule impingement.",
    color: "#ff7a00",
  },
  Back: {
    name: "Latissimus Dorsi & Rhomboids",
    category: "Pull",
    activationScore: 88,
    status: "Primed",
    recoveryHours: 0,
    primaryExercises: ["Overhand Barbell Rows", "Neutral-Grip Lat Pulldowns", "Single-Arm Dumbbell Row", "Deadlifts"],
    biomechanicsNote: "Initiate movement by depressing the scapulae before driving elbows towards the iliac crest.",
    color: "#f59e0b",
  },
  Shoulders: {
    name: "Anterior, Lateral & Posterior Deltoids",
    category: "Push",
    activationScore: 91,
    status: "Primed",
    recoveryHours: 0,
    primaryExercises: ["Standing Overhead Press", "Dumbbell Lateral Raises", "Cable Face Pulls", "Rear Delt Flyes"],
    biomechanicsNote: "In lateral raises, tilt thumb slightly upward and lead with elbows in the scaption plane (30° forward).",
    color: "#ea580c",
  },
  Biceps: {
    name: "Biceps Brachii & Brachialis",
    category: "Pull",
    activationScore: 82,
    status: "Recovered",
    recoveryHours: 0,
    primaryExercises: ["Incline Dumbbell Curls", "EZ-Bar Preacher Curls", "Hammer Curls", "Spider Curls"],
    biomechanicsNote: "Supinate wrist forcefully at the top of the contraction for peak long-head recruitment.",
    color: "#fb923c",
  },
  Triceps: {
    name: "Triceps Brachii (Lateral, Long & Medial)",
    category: "Push",
    activationScore: 86,
    status: "Trained",
    recoveryHours: 14,
    primaryExercises: ["Overhead Cable Extensions", "Close-Grip Bench Press", "Rope Pushdowns", "Skull Crushers"],
    biomechanicsNote: "Overhead angles stretch the long head across both shoulder and elbow joints for maximal hypertrophy.",
    color: "#f97316",
  },
  Core: {
    name: "Rectus Abdominis & Obliques",
    category: "Core",
    activationScore: 85,
    status: "Engaged",
    recoveryHours: 6,
    primaryExercises: ["Hanging Leg Raises", "Cable Woodchops", "Ab Wheel Rollouts", "Pallof Press"],
    biomechanicsNote: "Focus on posterior pelvic tilt and diaphragm brace rather than flexion of hip flexors.",
    color: "#10b981",
  },
  Quadriceps: {
    name: "Rectus Femoris & Vastus Group",
    category: "Legs",
    activationScore: 95,
    status: "Ready",
    recoveryHours: 0,
    primaryExercises: ["Barbell Back Squats", "Leg Press", "Bulgarian Split Squats", "Hack Squats"],
    biomechanicsNote: "Drive through mid-foot and keep knees tracking in alignment with second toe during full knee excursion.",
    color: "#f59e0b",
  },
  Hamstrings: {
    name: "Biceps Femoris & Semitendinosus",
    category: "Legs",
    activationScore: 80,
    status: "Ready",
    recoveryHours: 0,
    primaryExercises: ["Romanian Deadlifts", "Seated Leg Curls", "Nordic Hamstring Curls", "Glute-Ham Raises"],
    biomechanicsNote: "Hinge at the hips with minimal knee bend to maximize tension on the proximal hamstring attachment.",
    color: "#ea580c",
  },
  Glutes: {
    name: "Gluteus Maximus & Medius",
    category: "Legs",
    activationScore: 89,
    status: "Ready",
    recoveryHours: 0,
    primaryExercises: ["Barbell Hip Thrusts", "Walking Lunges", "Cable Kickbacks", "Sumo Squats"],
    biomechanicsNote: "Squeeze glutes at top lockout with neutral spine; avoid hyperextending lumbar spine.",
    color: "#fb923c",
  },
  Calves: {
    name: "Gastrocnemius & Soleus",
    category: "Legs",
    activationScore: 78,
    status: "Conditioned",
    recoveryHours: 0,
    primaryExercises: ["Standing Calf Raises", "Seated Soleus Raises", "Donkey Calf Raises", "Jump Rope"],
    biomechanicsNote: "Pause for 2 full seconds in the bottom stretch position to eliminate Achilles tendon elastic rebound.",
    color: "#f97316",
  },
};

export default function BodyMuscleViewer3D({
  activeMuscleFilter,
  onSelectMuscle,
  onStartMuscleWorkout,
}: BodyMuscleViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<string>("Chest");
  const [viewOrientation, setViewOrientation] = useState<"front" | "back">("front");
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // Sync external filter with internal state
  useEffect(() => {
    if (activeMuscleFilter && MUSCLE_DATABASE[activeMuscleFilter]) {
      setSelectedMuscle(activeMuscleFilter);
    }
  }, [activeMuscleFilter]);

  const selectedData = MUSCLE_DATABASE[selectedMuscle] || MUSCLE_DATABASE["Chest"];

  // Three.js interactive 3D anatomy figure
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 480;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.1, 5.0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Lighting for Muscular Sculpting
    const ambientLight = new THREE.AmbientLight(0x1e1b18, 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 3.2);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xff7a00, 2.8);
    rimLight.position.set(-3, -1, -3);
    scene.add(rimLight);

    const activePointLight = new THREE.PointLight(0xff7a00, 3.5, 5);
    activePointLight.position.set(0, 0.8, 1.5);
    scene.add(activePointLight);

    // 3. Human Mannequin Group
    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);

    // Base Unselected Muscle Material (Dark Graphite with metallic reflection)
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      metalness: 0.7,
      roughness: 0.35,
    });

    // Active Glowing Muscle Material (Vibrant Warm Amber/Orange as in reference)
    const activeMat = new THREE.MeshStandardMaterial({
      color: 0xff7a00,
      emissive: 0xea580c,
      emissiveIntensity: 1.25,
      metalness: 0.3,
      roughness: 0.2,
    });

    // Anatomical Body Meshes mapped to Muscle Groups
    const muscleMeshes: Record<string, THREE.Mesh[]> = {
      Chest: [],
      Back: [],
      Shoulders: [],
      Biceps: [],
      Triceps: [],
      Core: [],
      Quadriceps: [],
      Hamstrings: [],
      Glutes: [],
      Calves: [],
    };

    // Helper for tagging meshes with muscle name for raycasting
    const registerMesh = (mesh: THREE.Mesh, groupName: string) => {
      mesh.userData = { muscleGroup: groupName };
      muscleMeshes[groupName].push(mesh);
      bodyGroup.add(mesh);
    };

    // HEAD
    const headGeo = new THREE.SphereGeometry(0.32, 20, 20);
    headGeo.scale(0.85, 1.1, 0.95);
    const head = new THREE.Mesh(headGeo, baseMat);
    head.position.y = 1.68;
    bodyGroup.add(head);

    // NECK
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.28, 16), baseMat);
    neck.position.y = 1.38;
    bodyGroup.add(neck);

    // CHEST (Pectoralis Major)
    const pecGeo = new THREE.BoxGeometry(0.36, 0.35, 0.16);
    const chestL = new THREE.Mesh(pecGeo, baseMat);
    chestL.position.set(-0.2, 1.05, 0.18);
    chestL.rotation.z = -0.08;
    registerMesh(chestL, "Chest");

    const chestR = new THREE.Mesh(pecGeo, baseMat);
    chestR.position.set(0.2, 1.05, 0.18);
    chestR.rotation.z = 0.08;
    registerMesh(chestR, "Chest");

    // BACK (Latissimus Dorsi & Rhomboids - Posterior)
    const backGeo = new THREE.BoxGeometry(0.42, 0.62, 0.18);
    const backL = new THREE.Mesh(backGeo, baseMat);
    backL.position.set(-0.24, 0.95, -0.16);
    backL.rotation.y = 0.15;
    registerMesh(backL, "Back");

    const backR = new THREE.Mesh(backGeo, baseMat);
    backR.position.set(0.24, 0.95, -0.16);
    backR.rotation.y = -0.15;
    registerMesh(backR, "Back");

    // SHOULDERS (Deltoids)
    const deltGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const shoulderL = new THREE.Mesh(deltGeo, baseMat);
    shoulderL.position.set(-0.65, 1.18, 0.02);
    registerMesh(shoulderL, "Shoulders");

    const shoulderR = new THREE.Mesh(deltGeo, baseMat);
    shoulderR.position.set(0.65, 1.18, 0.02);
    registerMesh(shoulderR, "Shoulders");

    // BICEPS (Anterior Arm)
    const armGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.45, 12);
    const bicepL = new THREE.Mesh(armGeo, baseMat);
    bicepL.position.set(-0.76, 0.82, 0.08);
    registerMesh(bicepL, "Biceps");

    const bicepR = new THREE.Mesh(armGeo, baseMat);
    bicepR.position.set(0.76, 0.82, 0.08);
    registerMesh(bicepR, "Biceps");

    // TRICEPS (Posterior Arm)
    const tricepL = new THREE.Mesh(armGeo, baseMat);
    tricepL.position.set(-0.76, 0.82, -0.08);
    registerMesh(tricepL, "Triceps");

    const tricepR = new THREE.Mesh(armGeo, baseMat);
    tricepR.position.set(0.76, 0.82, -0.08);
    registerMesh(tricepR, "Triceps");

    // FOREARMS
    const forearmGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.48, 12);
    const forearmL = new THREE.Mesh(forearmGeo, baseMat);
    forearmL.position.set(-0.76, 0.35, 0);
    bodyGroup.add(forearmL);

    const forearmR = new THREE.Mesh(forearmGeo, baseMat);
    forearmR.position.set(0.76, 0.35, 0);
    bodyGroup.add(forearmR);

    // CORE / ABDOMINALS
    const coreGeo = new THREE.BoxGeometry(0.48, 0.52, 0.2);
    const absMesh = new THREE.Mesh(coreGeo, baseMat);
    absMesh.position.set(0, 0.48, 0.1);
    registerMesh(absMesh, "Core");

    // GLUTES (Posterior Pelvis)
    const gluteGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const gluteL = new THREE.Mesh(gluteGeo, baseMat);
    gluteL.position.set(-0.2, 0.08, -0.16);
    registerMesh(gluteL, "Glutes");

    const gluteR = new THREE.Mesh(gluteGeo, baseMat);
    gluteR.position.set(0.2, 0.08, -0.16);
    registerMesh(gluteR, "Glutes");

    // QUADRICEPS (Anterior Thighs)
    const quadGeo = new THREE.CylinderGeometry(0.21, 0.16, 0.72, 14);
    const quadL = new THREE.Mesh(quadGeo, baseMat);
    quadL.position.set(-0.28, -0.42, 0.08);
    registerMesh(quadL, "Quadriceps");

    const quadR = new THREE.Mesh(quadGeo, baseMat);
    quadR.position.set(0.28, -0.42, 0.08);
    registerMesh(quadR, "Quadriceps");

    // HAMSTRINGS (Posterior Thighs)
    const hamGeo = new THREE.CylinderGeometry(0.2, 0.15, 0.72, 14);
    const hamL = new THREE.Mesh(hamGeo, baseMat);
    hamL.position.set(-0.28, -0.42, -0.08);
    registerMesh(hamL, "Hamstrings");

    const hamR = new THREE.Mesh(hamGeo, baseMat);
    hamR.position.set(0.28, -0.42, -0.08);
    registerMesh(hamR, "Hamstrings");

    // CALVES
    const calfGeo = new THREE.CylinderGeometry(0.16, 0.11, 0.75, 12);
    const calfL = new THREE.Mesh(calfGeo, baseMat);
    calfL.position.set(-0.3, -1.2, 0);
    registerMesh(calfL, "Calves");

    const calfR = new THREE.Mesh(calfGeo, baseMat);
    calfR.position.set(0.3, -1.2, 0);
    registerMesh(calfR, "Calves");

    // Circular Floor Platform
    const floorGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.05, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0c0f17,
      metalness: 0.8,
      roughness: 0.3,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -1.65;
    scene.add(floorMesh);

    // Interactive Drag Rotation Variables (Declared before usage in applyMuscleHighlight)
    let targetRotationY = viewOrientation === "front" ? 0 : Math.PI;
    let currentRotationY = targetRotationY;
    let isDragging = false;
    let prevX = 0;

    // Update active highlight when selectedMuscle changes
    const applyMuscleHighlight = (target: string) => {
      Object.entries(muscleMeshes).forEach(([groupName, meshes]) => {
        const isSelected = groupName.toLowerCase() === target.toLowerCase();
        meshes.forEach((m) => {
          m.material = isSelected ? activeMat : baseMat;
          m.scale.set(isSelected ? 1.08 : 1.0, isSelected ? 1.08 : 1.0, isSelected ? 1.08 : 1.0);
        });
      });

      // Smoothly orient front or back based on anatomical placement
      const posteriorMuscles = ["Back", "Triceps", "Glutes", "Hamstrings"];
      if (posteriorMuscles.includes(target)) {
        targetRotationY = Math.PI;
        setViewOrientation("back");
      } else {
        targetRotationY = 0;
        setViewOrientation("front");
      }
    };

    applyMuscleHighlight(selectedMuscle);

    const domEl = renderer.domElement;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      setIsRotating(false);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      prevX = e.clientX;
      targetRotationY += dx * 0.012;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    // Click raycasting to select muscle directly on the 3D model!
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = domEl.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const allMeshes: THREE.Mesh[] = [];
      Object.values(muscleMeshes).forEach((list) => allMeshes.push(...list));

      const intersects = raycaster.intersectObjects(allMeshes);
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        if (hit.userData && hit.userData.muscleGroup) {
          const muscle = hit.userData.muscleGroup;
          setSelectedMuscle(muscle);
          onSelectMuscle?.(muscle);
        }
      }
    };

    domEl.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    domEl.addEventListener("click", onClick);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth inertia rotation
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      bodyGroup.rotation.y = currentRotationY;

      // Subtle breathing floating
      bodyGroup.position.y = Math.sin(elapsed * 1.6) * 0.03;

      // Pulse active glowing muscle
      activeMat.emissiveIntensity = 1.1 + Math.sin(elapsed * 3.2) * 0.35;
      activePointLight.intensity = 3.2 + Math.sin(elapsed * 3.2) * 0.8;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    return () => {
      domEl.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      domEl.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      baseMat.dispose();
      activeMat.dispose();
      floorMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [selectedMuscle]);

  const handleSelectGroup = (name: string) => {
    setSelectedMuscle(name);
    onSelectMuscle?.(name);
  };

  const muscleList = Object.keys(MUSCLE_DATABASE);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[11px] font-mono-tech uppercase font-bold text-orange-400 tracking-wider">
              Neural Biomechanics Engine • 3D Muscle Map
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
            Interactive 3D Anatomical Human
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Select any muscle group to visually inspect activation, biomechanical firing angles, and kinetic cues.
          </p>
        </div>

        {/* View Orientation Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono-tech">
            <button
              onClick={() => {
                setViewOrientation("front");
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewOrientation === "front"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-md shadow-orange-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Anterior (Front)
            </button>
            <button
              onClick={() => {
                setViewOrientation("back");
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewOrientation === "back"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-md shadow-orange-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Posterior (Back)
            </button>
          </div>
        </div>
      </div>

      {/* Muscle Group Horizontal Pill Selector */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {muscleList.map((m) => {
          const isSelected = selectedMuscle.toLowerCase() === m.toLowerCase();
          return (
            <button
              key={m}
              onClick={() => handleSelectGroup(m)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                isSelected
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 border-orange-400 text-white shadow-md shadow-orange-500/30 scale-105"
                  : "bg-slate-900/90 border-white/10 text-slate-400 hover:text-white hover:border-orange-500/40"
              }`}
            >
              {isSelected && <Zap className="w-3 h-3 fill-current" />}
              <span>{m}</span>
            </button>
          );
        })}
      </div>

      {/* Main Dual-Column Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3D Interactive Human Figure */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-950/80 border border-white/10 shadow-2xl relative min-h-[460px] sm:min-h-[500px] flex items-center justify-center overflow-hidden">
          {/* Ambient Warm Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* 3D Canvas */}
          <div
            ref={containerRef}
            className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing"
          />

          {/* Micro HUD Overlay */}
          <div className="absolute top-4 left-4 z-10 space-y-1 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span className="text-[11px] font-mono-tech uppercase font-bold text-orange-400">
                ACTIVE TARGET: {selectedMuscle.toUpperCase()}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block font-mono-tech">
              Click any muscle directly or drag 360° to inspect
            </span>
          </div>

          <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-slate-900/90 border border-white/10 text-[10px] font-mono-tech text-slate-400 pointer-events-none backdrop-blur-xs">
            360° Drag to Rotate • Click Muscle to Select
          </div>
        </div>

        {/* Right Column: Detailed Biomechanical Muscle Intelligence Panel */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/90 border border-orange-500/20 shadow-xl space-y-5">
          {/* Muscle Detail Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-mono-tech font-bold uppercase tracking-wider inline-block mb-1">
                {selectedData.category} Chain
              </span>
              <h3 className="text-xl font-black text-white font-display">
                {selectedData.name}
              </h3>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black font-mono-tech text-orange-400">
                {selectedData.activationScore}%
              </div>
              <span className="text-[10px] font-mono-tech text-slate-400 uppercase">
                Firing Index
              </span>
            </div>
          </div>

          {/* Quick Stats: Status & Recovery */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-mono-tech uppercase">Current Status</span>
              <div className="text-sm font-bold font-mono-tech text-emerald-400">
                {selectedData.status}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-mono-tech uppercase">Recovery Window</span>
              <div className="text-sm font-bold font-mono-tech text-amber-400">
                {selectedData.recoveryHours > 0 ? `${selectedData.recoveryHours} Hours` : "Fully Primed (0h)"}
              </div>
            </div>
          </div>

          {/* Biomechanical Coaching Cue */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-white/10 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono-tech text-orange-400 font-bold">
              <Info className="w-3.5 h-3.5" />
              <span>BIOMECHANICAL FIRING CUE</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedData.biomechanicsNote}
            </p>
          </div>

          {/* Primary Hypertrophy & Strength Exercises */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono-tech uppercase text-slate-400 font-bold block">
              Optimal Recruitment Exercises:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedData.primaryExercises.map((ex) => (
                <div
                  key={ex}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-200 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                  <span className="truncate">{ex}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Trigger: Start Custom Plan for this Muscle */}
          {onStartMuscleWorkout && (
            <button
              onClick={() => onStartMuscleWorkout(selectedMuscle)}
              className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-98 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Flame className="w-4 h-4 fill-current" />
              <span>Train {selectedMuscle} Today</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
