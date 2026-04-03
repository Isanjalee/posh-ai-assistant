"use client";

import Image from "next/image";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { colorOptions, previewViews } from "@/config/shirt-models";
import { ImportedShirtModel } from "@/components/imported-shirt-model";
import { useStudioStore } from "@/store/use-studio-store";
import type { OrderDraft, PreviewView, ShirtModel } from "@/types/order";

type PreviewSheetMode = "catalog" | "interactive";

const cameraMap: Record<PreviewView, THREE.Vector3Tuple> = {
  front: [0, 0.15, 4.5],
  back: [0, 0.15, -4.5],
  left: [-4.5, 0.2, 0],
  right: [4.5, 0.2, 0],
  "front-angle": [3.6, 1.25, 3.8],
  "back-angle": [-3.6, 1.25, -3.8],
};

export function TshirtPreview({ draft, model }: { draft: OrderDraft; model: ShirtModel }) {
  const [hasModelAsset, setHasModelAsset] = useState(false);
  const [mode, setMode] = useState<PreviewSheetMode>("catalog");
  const setPreviewView = useStudioStore((state) => state.setPreviewView);

  useEffect(() => {
    let active = true;

    fetch(model.modelPath, { method: "HEAD" })
      .then((response) => active && setHasModelAsset(response.ok))
      .catch(() => active && setHasModelAsset(false));

    return () => {
      active = false;
    };
  }, [model.modelPath]);

  const activeColor = colorOptions.find((item) => item.id === draft.baseColorId)?.hex ?? "#f5f1e6";

  return (
    <section className="glass-panel flex flex-col rounded-[1.6rem] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-500">Preview system</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Catalog-style product views</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Start with fixed mockup angles for quick decision-making, then switch to interactive 3D when users want to inspect the garment more closely.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PreviewModeButton active={mode === "catalog"} onClick={() => setMode("catalog")}>Multi-view sheet</PreviewModeButton>
          <PreviewModeButton active={mode === "interactive"} onClick={() => setMode("interactive")}>Interactive 3D</PreviewModeButton>
          <div className={`rounded-full px-3 py-2 font-mono text-[11px] uppercase tracking-[0.22em] ${hasModelAsset ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}>
            {hasModelAsset ? "GLB loaded" : "Mock viewer"}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-[1.5rem] bg-[radial-gradient(circle_at_top,#fff8ef,transparent_45%),linear-gradient(180deg,#1f3b37_0%,#132320_100%)] p-4">
        {mode === "catalog" ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {previewViews.map((view) => (
              <MockupCard key={view.id} title={view.name} draft={draft} color={activeColor} view={view.id} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
            <div className="relative min-h-[320px] overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/10">
              <div className="absolute left-4 top-4 z-10 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-white/85 backdrop-blur">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Interactive view</p>
                <p className="mt-1 text-sm">{model.name} in {colorOptions.find((item) => item.id === draft.baseColorId)?.name ?? "White"}</p>
              </div>
              <Canvas camera={{ position: cameraMap[draft.activeView], fov: 38 }}>
                <color attach="background" args={["#132320"]} />
                <fog attach="fog" args={["#132320", 8, 18]} />
                <ambientLight intensity={1.15} />
                <directionalLight position={[3, 5, 4]} intensity={1.5} />
                <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#f7d3ae" />
                <Suspense fallback={null}>
                  <Environment preset="studio" />
                  <Float speed={2.2} floatIntensity={0.18} rotationIntensity={0.06}>
                    <PreviewShirtRenderer draft={draft} model={model} hasModelAsset={hasModelAsset} color={activeColor} />
                  </Float>
                </Suspense>
                <CameraRig view={draft.activeView} />
                <OrbitControls enablePan={false} minDistance={2.5} maxDistance={7} minPolarAngle={0.3} maxPolarAngle={Math.PI - 0.3} />
              </Canvas>
            </div>
            <div className="grid gap-2">
              {previewViews.map((view) => (
                <button key={view.id} type="button" onClick={() => setPreviewView(view.id)} className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${draft.activeView === view.id ? "border-[var(--accent)] bg-[rgba(208,111,47,0.14)]" : "border-[var(--line)] bg-white/70 hover:bg-white"}`}>
                  <p className="font-semibold text-slate-900">{view.name}</p>
                  <p className="mt-1 text-xs text-slate-600">Fixed catalog camera for {view.name.toLowerCase()}.</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function PreviewModeButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`rounded-full px-4 py-2 text-sm transition ${active ? "bg-[var(--accent-deep)] text-white" : "border border-[var(--line)] bg-white/70 text-slate-700 hover:bg-white"}`}>{children}</button>;
}

function MockupCard({ draft, color, title, view }: { draft: OrderDraft; color: string; title: string; view: PreviewView }) {
  const placementClass: Record<PreviewView, string> = {
    front: "left-1/2 top-[36%] h-20 w-20 -translate-x-1/2",
    back: "left-1/2 top-[40%] h-20 w-20 -translate-x-1/2",
    left: "left-[47%] top-[38%] h-10 w-10 -translate-x-1/2",
    right: "left-[53%] top-[38%] h-10 w-10 -translate-x-1/2",
    "front-angle": "left-[53%] top-[37%] h-16 w-16 -translate-x-1/2",
    "back-angle": "left-[47%] top-[39%] h-16 w-16 -translate-x-1/2",
  };

  return (
    <div className="rounded-[1.3rem] border border-white/10 bg-black/12 p-3 text-white/88">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">{title}</p>
      <div className="relative mt-3 h-[170px] overflow-hidden rounded-2xl bg-white/6">
        <div className={`absolute inset-x-[26%] top-[16%] bottom-[12%] rounded-[22%_22%_18%_18%/10%_10%_16%_16%] ${view === "left" || view === "right" ? "inset-x-[34%]" : ""}`} style={{ backgroundColor: color, transform: sheetTransform(view) }} />
        <div className={`absolute ${placementClass[view]} overflow-hidden rounded-xl bg-white/10`}>
          {draft.logoDataUrl ? <Image src={draft.logoDataUrl} alt="Logo preview" fill unoptimized className="object-contain p-1" /> : null}
          {draft.customText ? <span className="absolute inset-0 flex items-center justify-center px-1 text-center text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-900 mix-blend-multiply">{draft.customText}</span> : null}
        </div>
      </div>
    </div>
  );
}

function sheetTransform(view: PreviewView) {
  if (view === "left") return "perspective(500px) rotateY(68deg)";
  if (view === "right") return "perspective(500px) rotateY(-68deg)";
  if (view === "front-angle") return "perspective(500px) rotateY(-28deg)";
  if (view === "back-angle") return "perspective(500px) rotateY(28deg)";
  if (view === "back") return "rotateY(180deg)";
  return "none";
}

function PreviewShirtRenderer({ draft, model, hasModelAsset, color }: { draft: OrderDraft; model: ShirtModel; hasModelAsset: boolean; color: string }) {
  const frontTexture = useDesignTexture(draft.printPlacement === "center-chest" ? draft.customText : "", draft.printPlacement === "center-chest" ? draft.logoDataUrl : null);
  const leftTexture = useDesignTexture(draft.printPlacement === "left-chest" ? draft.customText : "", draft.printPlacement === "left-chest" ? draft.logoDataUrl : null);
  const backTexture = useDesignTexture(draft.printPlacement === "full-back" ? draft.customText : "", draft.printPlacement === "full-back" ? draft.logoDataUrl : null);
  const sleeveTexture = useDesignTexture(draft.printPlacement === "left-sleeve" || draft.printPlacement === "right-sleeve" ? draft.customText : "", draft.printPlacement === "left-sleeve" || draft.printPlacement === "right-sleeve" ? draft.logoDataUrl : null);

  if (hasModelAsset) {
    return <ImportedShirtModel modelPath={model.modelPath} color={color} frontTexture={frontTexture} leftTexture={leftTexture} backTexture={backTexture} sleeveTexture={sleeveTexture} />;
  }

  return <ProceduralShirtModel modelId={model.id} color={color} frontTexture={frontTexture} leftTexture={leftTexture} backTexture={backTexture} sleeveTexture={sleeveTexture} />;
}

function CameraRig({ view }: { view: PreviewView }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(...cameraMap[view]), [view]);
  const lookAtTarget = useMemo(() => new THREE.Vector3(0, 0.12, -0.2), []);

  useFrame(() => {
    camera.position.lerp(target, 0.08);
    camera.lookAt(lookAtTarget);
  });

  return null;
}

function ProceduralShirtModel({ modelId, color, frontTexture, leftTexture, backTexture, sleeveTexture }: { modelId: ShirtModel["id"]; color: string; frontTexture: THREE.Texture | null; leftTexture: THREE.Texture | null; backTexture: THREE.Texture | null; sleeveTexture: THREE.Texture | null }) {
  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color, roughness: 0.94, metalness: 0.02 }), [color]);
  const trimMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ece2d4", roughness: 0.96, metalness: 0.01 }), []);
  const geometry = useMemo(() => createTshirtGeometry(modelId), [modelId]);
  const verticalScale = modelId === "long-sleeve" ? 1.08 : 1;

  return (
    <group>
      <mesh position={[0, -1.12, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.05, 64]} />
        <meshStandardMaterial color="#224640" roughness={0.95} metalness={0.02} />
      </mesh>

      <mesh geometry={geometry} material={bodyMaterial} position={[0, 0.02, -0.28]} scale={[1, verticalScale, 1]} castShadow receiveShadow />

      <mesh position={[0, -1.07, -0.03]} material={trimMaterial} castShadow receiveShadow>
        <boxGeometry args={[1.44, 0.06, 0.46]} />
      </mesh>

      <Neckline modelId={modelId} />
      {modelId === "polo" ? <PoloPlacket /> : null}
      {modelId === "long-sleeve" ? <HemBand y={-1.11} /> : null}

      <DesignPlane texture={frontTexture} position={[0, 0.1, 0.26]} scale={[0.82, 0.82, 0.82]} />
      <DesignPlane texture={leftTexture} position={[-0.34, 0.32, 0.26]} scale={[0.34, 0.34, 0.34]} />
      <DesignPlane texture={backTexture} position={[0, 0.14, -0.84]} scale={[0.88, 0.88, 0.88]} rotation={[0, Math.PI, 0]} />
      <DesignPlane texture={sleeveTexture} position={[1.02, 0.26, -0.08]} scale={[0.28, 0.28, 0.28]} rotation={[0, -1.18, 0.12]} />
      <DesignPlane texture={sleeveTexture} position={[-1.02, 0.26, -0.08]} scale={[0.28, 0.28, 0.28]} rotation={[0, 1.18, -0.12]} />
    </group>
  );
}

function createTshirtGeometry(modelId: ShirtModel["id"]) {
  const shape = new THREE.Shape();
  shape.moveTo(-0.72, -1.02);
  shape.lineTo(-0.72, -0.2);
  shape.lineTo(-1.14, 0.24);
  shape.lineTo(-0.98, 0.56);
  shape.lineTo(-0.62, 0.82);
  shape.quadraticCurveTo(-0.34, 1.02, -0.16, 1.02);
  shape.lineTo(-0.08, 0.87);
  shape.lineTo(0.08, 0.87);
  shape.lineTo(0.16, 1.02);
  shape.quadraticCurveTo(0.34, 1.02, 0.62, 0.82);
  shape.lineTo(0.98, 0.56);
  shape.lineTo(1.14, 0.24);
  shape.lineTo(0.72, -0.2);
  shape.lineTo(0.72, -1.02);
  shape.closePath();

  if (modelId === "long-sleeve") {
    shape.moveTo(-0.72, -1.02);
  }

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.56,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.025,
    bevelThickness: 0.025,
  });

  geometry.center();
  geometry.rotateX(0.04);
  return geometry;
}

function DesignPlane({ texture, position, rotation = [0, 0, 0], scale }: { texture: THREE.Texture | null; position: THREE.Vector3Tuple; rotation?: THREE.EulerTuple; scale: THREE.Vector3Tuple }) {
  if (!texture) return null;
  return <mesh position={position} rotation={rotation} scale={scale}><planeGeometry args={[1, 1]} /><meshBasicMaterial transparent map={texture} alphaTest={0.02} /></mesh>;
}

function Neckline({ modelId }: { modelId: string }) {
  if (modelId === "polo") return <><mesh position={[0, 1.06, -0.02]} rotation={[0.34, 0, 0]}><boxGeometry args={[0.92, 0.14, 0.12]} /><meshStandardMaterial color="#f0e7db" roughness={0.94} /></mesh><mesh position={[-0.22, 0.9, 0.1]} rotation={[0, 0, 0.62]}><boxGeometry args={[0.38, 0.08, 0.05]} /><meshStandardMaterial color="#eadfce" roughness={0.94} /></mesh><mesh position={[0.22, 0.9, 0.1]} rotation={[0, 0, -0.62]}><boxGeometry args={[0.38, 0.08, 0.05]} /><meshStandardMaterial color="#eadfce" roughness={0.94} /></mesh></>;
  if (modelId === "v-neck") return <><mesh position={[-0.16, 0.92, 0.16]} rotation={[0, 0, 0.96]}><boxGeometry args={[0.42, 0.05, 0.05]} /><meshStandardMaterial color="#ece2d4" roughness={0.96} /></mesh><mesh position={[0.16, 0.92, 0.16]} rotation={[0, 0, -0.96]}><boxGeometry args={[0.42, 0.05, 0.05]} /><meshStandardMaterial color="#ece2d4" roughness={0.96} /></mesh></>;
  return <mesh position={[0, 0.96, 0.18]}><torusGeometry args={[0.28, 0.04, 18, 42, Math.PI]} /><meshStandardMaterial color="#ece2d4" roughness={0.96} /></mesh>;
}

function PoloPlacket() {
  return <><mesh position={[0, 0.72, 0.28]}><boxGeometry args={[0.11, 0.44, 0.02]} /><meshStandardMaterial color="#eadfce" roughness={0.94} /></mesh>{[-0.12, 0, 0.12].map((offset) => <mesh key={offset} position={[0, 0.8 - offset, 0.3]}><sphereGeometry args={[0.022, 16, 16]} /><meshStandardMaterial color="#d06f2f" roughness={0.5} metalness={0.12} /></mesh>)}</>;
}

function HemBand({ y }: { y: number }) {
  return <mesh position={[0, y, 0]}><boxGeometry args={[1.44, 0.06, 0.46]} /><meshStandardMaterial color="#e7dcca" roughness={0.96} /></mesh>;
}

function useDesignTexture(text: string, logoDataUrl: string | null) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext("2d");
    if (!context) return;
    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.colorSpace = THREE.SRGBColorSpace;

    const finalize = () => {
      if (text.trim()) {
        context.textAlign = "center";
        context.fillStyle = "#111827";
        context.font = "600 86px sans-serif";
        context.fillText(text.trim(), canvas.width / 2, canvas.height * 0.8, canvas.width * 0.82);
      }
      canvasTexture.needsUpdate = true;
      setTexture(canvasTexture);
    };

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (logoDataUrl) {
      const image = new window.Image();
      image.onload = () => {
        const maxWidth = canvas.width * 0.7;
        const maxHeight = canvas.height * 0.45;
        const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
        const width = image.width * scale;
        const height = image.height * scale;
        context.drawImage(image, (canvas.width - width) / 2, canvas.height * 0.18, width, height);
        finalize();
      };
      image.src = logoDataUrl;
      return;
    }

    finalize();
  }, [logoDataUrl, text]);

  return texture;
}

