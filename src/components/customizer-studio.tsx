"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, OrbitControls, RoundedBox } from "@react-three/drei";
import { ChangeEvent, Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { ImportedShirtModel } from "@/components/imported-shirt-model";
import { shirtModels, type ShirtModel } from "@/lib/shirt-models";

type ShirtColor = { name: string; hex: string };
type ViewPreset = "front" | "back" | "left" | "right" | "top" | "iso";
type PrintZone = "centerChest" | "leftChest" | "backCenter" | "sleeve";

const shirtColors: ShirtColor[] = [
  { name: "Ivory White", hex: "#f5f1e6" },
  { name: "Midnight Black", hex: "#171717" },
  { name: "Ocean Navy", hex: "#213a63" },
  { name: "Signal Red", hex: "#c44536" },
  { name: "Forest Green", hex: "#2f6b47" },
];

const printZones = [
  { value: "centerChest" as const, label: "Center chest", description: "Main front print for logos, slogans, and bold graphics." },
  { value: "leftChest" as const, label: "Left chest", description: "Compact placement for club crests or corporate marks." },
  { value: "backCenter" as const, label: "Back center", description: "Large rear print for names, campaigns, or event branding." },
  { value: "sleeve" as const, label: "Sleeve", description: "Accent area for icons, tags, and secondary branding." },
];

const viewLabels: Record<ViewPreset, string> = { front: "Front", back: "Back", left: "Left", right: "Right", top: "Top", iso: "3D" };
const viewPositions: Record<ViewPreset, THREE.Vector3Tuple> = {
  front: [0, 0.15, 4.5],
  back: [0, 0.15, -4.5],
  left: [-4.5, 0.2, 0],
  right: [4.5, 0.2, 0],
  top: [0, 4.3, 1.2],
  iso: [3.4, 1.5, 3.8],
};

export function CustomizerStudio() {
  const [selectedModel, setSelectedModel] = useState<ShirtModel>(shirtModels[0]);
  const [selectedColor, setSelectedColor] = useState(shirtColors[0]);
  const [selectedZone, setSelectedZone] = useState<PrintZone>("centerChest");
  const [activeView, setActiveView] = useState<ViewPreset>("iso");
  const [designText, setDesignText] = useState("POSH Apparel");
  const [designIdea, setDesignIdea] = useState("Streetwear drop for a team launch with a minimal front graphic and bold back messaging.");
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");
  const [quantity, setQuantity] = useState("50");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("Need a clean mockup for approval first, then we can move into production quantities.");
  const [submitted, setSubmitted] = useState(false);
  const [hasModelAsset, setHasModelAsset] = useState(false);

  useEffect(() => {
    let active = true;

    fetch(selectedModel.modelPath, { method: "HEAD" })
      .then((response) => {
        if (active) {
          setHasModelAsset(response.ok);
        }
      })
      .catch(() => {
        if (active) {
          setHasModelAsset(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedModel.modelPath]);

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  return (
    <main className="relative overflow-hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-[1560px] flex-col px-4 py-6 sm:px-6 lg:px-10">
        <section className="glass-panel section-grid relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-r from-[rgba(208,111,47,0.18)] via-transparent to-[rgba(18,53,47,0.18)]" />
          <div className="relative grid gap-10 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-deep)]">
                TeeCraft 3D <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> MVP Apparel Customizer
              </div>
              <div className="max-w-3xl space-y-4">
                <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">Turn apparel ideas into a 3D order-ready concept before your team prints.</h1>
                <p className="max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">Customers can pick a shirt model, switch colors, add a logo or text, inspect the concept from every angle, and submit a design request with production notes.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="5 apparel bases" value="Round, polo, V, raglan, long sleeve" />
                <StatCard label="Fixed print zones" value="Chest, back, sleeve placements" />
                <StatCard label="Fast MVP flow" value="Preview, summarize, then submit" />
              </div>
              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <section className="glass-panel rounded-[1.6rem] p-5 sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500">3D Preview</p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Interactive product viewer</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] ${hasModelAsset ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}>
                        {hasModelAsset ? "GLB ready" : "Fallback preview"}
                      </div>
                      <div className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 font-mono text-xs uppercase tracking-[0.22em] text-slate-600">{viewLabels[activeView]} view</div>
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_top,#fff8ef,transparent_45%),linear-gradient(180deg,#1f3b37_0%,#132320_100%)]">
                    <div className="absolute left-6 top-6 z-10 max-w-[17rem] rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white/88 backdrop-blur">
                      <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-white/60">Current design</p>
                      <p className="mt-2 text-sm leading-6">{selectedModel.name} in {selectedColor.name} with {printZones.find((zone) => zone.value === selectedZone)?.label.toLowerCase()} placement.</p>
                      <p className="mt-2 text-xs leading-5 text-white/70">Expected asset: {selectedModel.modelPath}</p>
                    </div>
                    <div className="h-[460px] w-full">
                      <Canvas camera={{ position: [3.4, 1.5, 3.8], fov: 38 }}>
                        <color attach="background" args={["#132320"]} />
                        <fog attach="fog" args={["#132320", 8, 18]} />
                        <ambientLight intensity={1.2} />
                        <directionalLight position={[3, 5, 4]} intensity={1.6} />
                        <directionalLight position={[-4, 2, -3]} intensity={0.45} color="#f7d3ae" />
                        <Suspense fallback={null}>
                          <Environment preset="studio" />
                          <Float speed={2.4} floatIntensity={0.22} rotationIntensity={0.08}>
                            <ShirtRenderer model={selectedModel} hasModelAsset={hasModelAsset} color={selectedColor.hex} text={designText} logoDataUrl={logoDataUrl} zone={selectedZone} />
                          </Float>
                        </Suspense>
                        <CameraRig view={activeView} />
                        <OrbitControls enablePan={false} minDistance={2.5} maxDistance={7} minPolarAngle={0.3} maxPolarAngle={Math.PI - 0.3} />
                      </Canvas>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {(Object.keys(viewLabels) as ViewPreset[]).map((view) => (
                      <button key={view} type="button" onClick={() => setActiveView(view)} className={`rounded-full px-4 py-2 text-sm transition ${activeView === view ? "bg-[var(--accent-deep)] text-white" : "border border-[var(--line)] bg-white/70 text-slate-700 hover:bg-white"}`}>
                        {viewLabels[view]}
                      </button>
                    ))}
                  </div>
                </section>
                <section className="space-y-5">
                  <ConfiguratorCard title="Choose a model" eyebrow="Step 1">
                    <div className="grid gap-3">
                      {shirtModels.map((model) => (
                        <button key={model.id} type="button" onClick={() => setSelectedModel(model)} className={`rounded-[1.4rem] border px-4 py-4 text-left transition ${selectedModel.id === model.id ? "border-[var(--accent)] bg-[rgba(208,111,47,0.12)]" : "border-[var(--line)] bg-white/70 hover:bg-white"}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-base font-semibold text-slate-900">{model.name}</h3>
                              <p className="mt-1 text-sm leading-6 text-slate-600">{model.description}</p>
                              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">{model.modelPath}</p>
                            </div>
                            <span className="rounded-full bg-slate-900 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white">{model.badge}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ConfiguratorCard>
                  <ConfiguratorCard title="Pick a color" eyebrow="Step 2">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {shirtColors.map((color) => (
                        <button key={color.hex} type="button" onClick={() => setSelectedColor(color)} className={`rounded-[1.3rem] border p-3 text-left transition ${selectedColor.hex === color.hex ? "border-[var(--accent)] bg-[rgba(208,111,47,0.1)]" : "border-[var(--line)] bg-white/70 hover:bg-white"}`}>
                          <div className="mb-3 h-12 rounded-xl border border-black/5" style={{ backgroundColor: color.hex }} />
                          <p className="text-sm font-medium text-slate-800">{color.name}</p>
                        </button>
                      ))}
                    </div>
                  </ConfiguratorCard>
                </section>
              </div>
            </div>
            <div className="space-y-6">
              <ConfiguratorCard title="Build the design" eyebrow="Step 3">
                <div className="space-y-4">
                  <Field label="Design text" value={designText} onChange={setDesignText} placeholder="Add slogan or brand name" />
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Design direction</span>
                    <textarea value={designIdea} onChange={(event) => setDesignIdea(event.target.value)} rows={4} placeholder="Describe the concept you want refined" className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--accent)]" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Print zone</span>
                    <select value={selectedZone} onChange={(event) => setSelectedZone(event.target.value as PrintZone)} className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--accent)]">
                      {printZones.map((zone) => <option key={zone.value} value={zone.value}>{zone.label}</option>)}
                    </select>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{printZones.find((zone) => zone.value === selectedZone)?.description}</p>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Upload logo or reference</span>
                    <div className="rounded-[1.4rem] border border-dashed border-[var(--line)] bg-white/60 p-4">
                      <input type="file" accept="image/*" onChange={handleLogoUpload} />
                      <p className="mt-3 text-sm leading-6 text-slate-600">PNG works best for transparent logos. Uploaded art is shown in the active print zone on the 3D mockup.</p>
                    </div>
                  </label>
                  <div className="rounded-[1.4rem] border border-[var(--line)] bg-white/70 p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-slate-500">Model generation prompt</p>
                    <p className="mt-3 text-sm leading-6 text-slate-700">Use the selected model&apos;s GLB slot and keep the chest UV flat so dynamic logo placement stays predictable.</p>
                    <pre className="mt-3 overflow-auto rounded-2xl bg-slate-950/95 p-4 font-mono text-xs leading-6 text-slate-100">{selectedModel.assetPrompt}</pre>
                  </div>
                </div>
              </ConfiguratorCard>
              <ConfiguratorCard title="Submit design request" eyebrow="Step 4">
                <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Customer name" value={customerName} onChange={setCustomerName} placeholder="Jane Perera" />
                    <Field label="Phone or email" value={contact} onChange={setContact} placeholder="+94 77 123 4567" />
                    <Field label="Quantity" value={quantity} onChange={setQuantity} placeholder="50" />
                    <Field label="Deadline" value={deadline} onChange={setDeadline} placeholder="May 20" />
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Production notes</span>
                    <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} placeholder="Sizing, event details, print notes" className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--accent)]" />
                  </label>
                  <button type="submit" className="w-full rounded-[1.4rem] bg-[var(--accent-deep)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#0e2925]">Submit Design Request</button>
                  {submitted ? <div className="rounded-[1.4rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900">Concept captured. You can wire this form to email, Supabase, or a CRM next without changing the customizer flow.</div> : null}
                </form>
              </ConfiguratorCard>
              <ConfiguratorCard title="Order summary" eyebrow="Step 5">
                <div className="grid gap-3">
                  <SummaryRow label="Model" value={selectedModel.name} />
                  <SummaryRow label="Color" value={selectedColor.name} />
                  <SummaryRow label="Placement" value={printZones.find((zone) => zone.value === selectedZone)?.label ?? "Not selected"} />
                  <SummaryRow label="Asset slot" value={selectedModel.modelPath} />
                  <SummaryRow label="Text" value={designText || "No text added"} />
                  <SummaryRow label="Quantity" value={quantity} />
                </div>
                <div className="mt-5 rounded-[1.4rem] border border-[var(--line)] bg-white/70 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-slate-500">Design notes</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{designIdea || "No design notes added yet."}</p>
                </div>
              </ConfiguratorCard>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ShirtRenderer({ model, hasModelAsset, color, text, logoDataUrl, zone }: { model: ShirtModel; hasModelAsset: boolean; color: string; text: string; logoDataUrl: string | null; zone: PrintZone }) {
  const frontTexture = useDesignTexture(zone === "centerChest" ? text : "", zone === "centerChest" ? logoDataUrl : null);
  const leftTexture = useDesignTexture(zone === "leftChest" ? text : "", zone === "leftChest" ? logoDataUrl : null);
  const backTexture = useDesignTexture(zone === "backCenter" ? text : "", zone === "backCenter" ? logoDataUrl : null);
  const sleeveTexture = useDesignTexture(zone === "sleeve" ? text : "", zone === "sleeve" ? logoDataUrl : null);

  if (hasModelAsset) {
    return <ImportedShirtModel modelPath={model.modelPath} color={color} frontTexture={frontTexture} leftTexture={leftTexture} backTexture={backTexture} sleeveTexture={sleeveTexture} />;
  }

  return <ProceduralShirtModel modelId={model.id} color={color} frontTexture={frontTexture} leftTexture={leftTexture} backTexture={backTexture} sleeveTexture={sleeveTexture} />;
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--accent)]" />
    </label>
  );
}

function ConfiguratorCard({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <section className="glass-panel rounded-[1.6rem] p-5 sm:p-6"><p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500">{eyebrow}</p><h2 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h2><div className="mt-5">{children}</div></section>;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[1.4rem] border border-[var(--line)] bg-white/72 px-4 py-5"><p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">{label}</p><p className="mt-3 text-sm leading-6 text-slate-800">{value}</p></div>;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-4 rounded-[1.1rem] border border-[var(--line)] bg-white/70 px-4 py-3"><span className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">{label}</span><span className="max-w-[16rem] text-right text-sm leading-6 text-slate-800">{value}</span></div>;
}

function CameraRig({ view }: { view: ViewPreset }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(...viewPositions[view]), [view]);
  const lookAtTarget = useMemo(() => new THREE.Vector3(0, 0.2, 0), []);
  useFrame(() => {
    camera.position.lerp(target, 0.08);
    camera.lookAt(lookAtTarget);
  });
  return null;
}

function ProceduralShirtModel({ modelId, color, frontTexture, leftTexture, backTexture, sleeveTexture }: { modelId: string; color: string; frontTexture: THREE.Texture | null; leftTexture: THREE.Texture | null; backTexture: THREE.Texture | null; sleeveTexture: THREE.Texture | null }) {
  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color, roughness: 0.86, metalness: 0.06 }), [color]);
  const sleeveColor = modelId === "raglan" ? "#efe5d5" : color;
  const sleeveScale = modelId === "longsleeve" ? 1.45 : 1;

  return (
    <group>
      <mesh position={[0, -1.08, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[2.1, 64]} /><meshStandardMaterial color="#224640" roughness={0.95} metalness={0.02} /></mesh>
      <RoundedBox args={[1.85, 2.25, 0.62]} radius={0.16} smoothness={6} position={[0, 0, 0]}><primitive object={bodyMaterial} attach="material" /></RoundedBox>
      <RoundedBox args={[0.62, 1.18 * sleeveScale, 0.58]} radius={0.12} smoothness={4} position={[-1.15, 0.2 - (sleeveScale - 1) * 0.22, 0]} rotation={[0, 0, 0.24]}><meshStandardMaterial color={sleeveColor} roughness={0.84} metalness={0.05} /></RoundedBox>
      <RoundedBox args={[0.62, 1.18 * sleeveScale, 0.58]} radius={0.12} smoothness={4} position={[1.15, 0.2 - (sleeveScale - 1) * 0.22, 0]} rotation={[0, 0, -0.24]}><meshStandardMaterial color={sleeveColor} roughness={0.84} metalness={0.05} /></RoundedBox>
      <Neckline modelId={modelId} />
      {modelId === "polo" ? <PoloPlacket /> : null}
      {modelId === "longsleeve" ? <HemBand y={-1.18} /> : null}
      <DesignPlane texture={frontTexture} position={[0, 0.18, 0.34]} scale={[0.9, 0.9, 0.9]} />
      <DesignPlane texture={leftTexture} position={[-0.43, 0.42, 0.34]} scale={[0.45, 0.45, 0.45]} />
      <DesignPlane texture={backTexture} position={[0, 0.2, -0.34]} scale={[0.98, 0.98, 0.98]} rotation={[0, Math.PI, 0]} />
      <DesignPlane texture={sleeveTexture} position={[1.46, 0.16, 0]} scale={[0.46, 0.46, 0.46]} rotation={[0, -Math.PI / 2, 0]} />
      <DesignPlane texture={sleeveTexture} position={[-1.46, 0.16, 0]} scale={[0.46, 0.46, 0.46]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
}

function DesignPlane({ texture, position, rotation = [0, 0, 0], scale }: { texture: THREE.Texture | null; position: THREE.Vector3Tuple; rotation?: THREE.EulerTuple; scale: THREE.Vector3Tuple }) {
  if (!texture) return null;
  return <mesh position={position} rotation={rotation} scale={scale}><planeGeometry args={[1, 1]} /><meshBasicMaterial transparent map={texture} alphaTest={0.02} /></mesh>;
}

function Neckline({ modelId }: { modelId: string }) {
  if (modelId === "polo") return <><mesh position={[0, 1.24, 0.08]} rotation={[0.28, 0, 0]}><boxGeometry args={[0.9, 0.18, 0.1]} /><meshStandardMaterial color="#f0e7db" roughness={0.86} /></mesh><mesh position={[-0.22, 1.08, 0.22]} rotation={[0, 0, 0.48]}><boxGeometry args={[0.46, 0.12, 0.06]} /><meshStandardMaterial color="#eadfce" roughness={0.86} /></mesh><mesh position={[0.22, 1.08, 0.22]} rotation={[0, 0, -0.48]}><boxGeometry args={[0.46, 0.12, 0.06]} /><meshStandardMaterial color="#eadfce" roughness={0.86} /></mesh></>;
  if (modelId === "vneck") return <><mesh position={[-0.2, 1.04, 0.28]} rotation={[0, 0, 0.88]}><boxGeometry args={[0.56, 0.08, 0.08]} /><meshStandardMaterial color="#ece2d4" roughness={0.88} /></mesh><mesh position={[0.2, 1.04, 0.28]} rotation={[0, 0, -0.88]}><boxGeometry args={[0.56, 0.08, 0.08]} /><meshStandardMaterial color="#ece2d4" roughness={0.88} /></mesh></>;
  return <mesh position={[0, 1.08, 0.28]}><torusGeometry args={[0.34, 0.06, 18, 48, Math.PI]} /><meshStandardMaterial color="#ece2d4" roughness={0.88} /></mesh>;
}

function PoloPlacket() {
  return <><mesh position={[0, 0.82, 0.33]}><boxGeometry args={[0.15, 0.52, 0.02]} /><meshStandardMaterial color="#eadfce" roughness={0.84} /></mesh>{[-0.16, 0, 0.16].map((offset) => <mesh key={offset} position={[0, 0.92 - offset, 0.35]}><sphereGeometry args={[0.028, 16, 16]} /><meshStandardMaterial color="#d06f2f" roughness={0.5} metalness={0.18} /></mesh>)}</>;
}

function HemBand({ y }: { y: number }) {
  return <mesh position={[0, y, 0]}><boxGeometry args={[1.9, 0.1, 0.64]} /><meshStandardMaterial color="#e7dcca" roughness={0.86} /></mesh>;
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
      const image = new Image();
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
