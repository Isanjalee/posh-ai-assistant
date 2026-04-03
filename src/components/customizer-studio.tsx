"use client";

import Image from "next/image";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, OrbitControls } from "@react-three/drei";
import { ChangeEvent, Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { ImportedShirtModel } from "@/components/imported-shirt-model";
import { shirtModels, type ShirtModel } from "@/lib/shirt-models";

type ShirtColor = { name: string; hex: string };
type ViewPreset = "front" | "back" | "left" | "right" | "top" | "iso";
type PrintZone = "centerChest" | "leftChest" | "backCenter" | "sleeve";
type PreviewMode = "2d" | "3d";
type ProductTab = "model" | "color";
type WorkspaceTab = "design" | "request" | "summary";

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
  const [activeView, setActiveView] = useState<ViewPreset>("front");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("2d");
  const [productTab, setProductTab] = useState<ProductTab>("model");
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("design");
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
    <main className="h-[100dvh] w-full overflow-hidden p-3 sm:p-4 lg:p-5">
      <div className="glass-panel section-grid mx-auto flex h-full w-full max-w-[1600px] flex-col overflow-hidden rounded-[2rem] p-4 sm:p-5 lg:p-6">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--accent-deep)]">
              TeeCraft 3D <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Apparel Studio
            </div>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">Custom apparel in a fixed-screen workspace</h1>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">2D first for quick approval, 3D when the customer wants a closer product look.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-600">
            <Pill>{selectedModel.name}</Pill>
            <Pill>{selectedColor.name}</Pill>
            <Pill>{printZones.find((zone) => zone.value === selectedZone)?.label ?? "Placement"}</Pill>
          </div>
        </header>

        <div className="mt-4 grid min-h-0 flex-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="min-h-0 grid gap-4 lg:grid-rows-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="glass-panel flex min-h-0 flex-col rounded-[1.6rem] p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-500">Preview</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">Design viewer</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ModeButton active={previewMode === "2d"} onClick={() => setPreviewMode("2d")}>2D</ModeButton>
                  <ModeButton active={previewMode === "3d"} onClick={() => setPreviewMode("3d")}>3D</ModeButton>
                  <div className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] ${hasModelAsset ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}>
                    {hasModelAsset ? "GLB ready" : "Fallback preview"}
                  </div>
                </div>
              </div>

              <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1.4rem] bg-[radial-gradient(circle_at_top,#fff8ef,transparent_45%),linear-gradient(180deg,#1f3b37_0%,#132320_100%)]">
                <div className="absolute left-4 top-4 z-10 max-w-[16rem] rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white/88 backdrop-blur">
                  <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-white/60">Current design</p>
                  <p className="mt-2 text-sm leading-6">{selectedModel.name} in {selectedColor.name} with {printZones.find((zone) => zone.value === selectedZone)?.label.toLowerCase()} placement.</p>
                </div>

                {previewMode === "2d" ? (
                  <FlatPreviewCard color={selectedColor.hex} text={designText} logoDataUrl={logoDataUrl} zone={selectedZone} />
                ) : (
                  <div className="h-full w-full">
                    <Canvas camera={{ position: [0, 0.15, 4.5], fov: 38 }}>
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
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(Object.keys(viewLabels) as ViewPreset[]).map((view) => (
                  <button key={view} type="button" onClick={() => { setPreviewMode("3d"); setActiveView(view); }} className={`rounded-full px-3 py-2 text-sm transition ${activeView === view && previewMode === "3d" ? "bg-[var(--accent-deep)] text-white" : "border border-[var(--line)] bg-white/70 text-slate-700 hover:bg-white"}`}>
                    {viewLabels[view]}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-panel min-h-0 rounded-[1.6rem] p-4">
              <div className="mb-4 flex flex-wrap gap-2">
                <ModeButton active={productTab === "model"} onClick={() => setProductTab("model")}>Models</ModeButton>
                <ModeButton active={productTab === "color"} onClick={() => setProductTab("color")}>Colors</ModeButton>
              </div>

              <div className="h-[calc(100%-3.25rem)] overflow-hidden">
                {productTab === "model" ? (
                  <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                    {shirtModels.map((model) => (
                      <button key={model.id} type="button" onClick={() => setSelectedModel(model)} className={`rounded-[1.3rem] border px-4 py-3 text-left transition ${selectedModel.id === model.id ? "border-[var(--accent)] bg-[rgba(208,111,47,0.12)]" : "border-[var(--line)] bg-white/70 hover:bg-white"}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">{model.name}</h3>
                            <p className="mt-1 text-xs leading-5 text-slate-600">{model.description}</p>
                          </div>
                          <span className="rounded-full bg-slate-900 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white">{model.badge}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid h-full grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
                    {shirtColors.map((color) => (
                      <button key={color.hex} type="button" onClick={() => setSelectedColor(color)} className={`rounded-[1.2rem] border p-3 text-left transition ${selectedColor.hex === color.hex ? "border-[var(--accent)] bg-[rgba(208,111,47,0.1)]" : "border-[var(--line)] bg-white/70 hover:bg-white"}`}>
                        <div className="mb-3 h-10 rounded-xl border border-black/5" style={{ backgroundColor: color.hex }} />
                        <p className="text-sm font-medium text-slate-800">{color.name}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="glass-panel min-h-0 rounded-[1.6rem] p-4">
            <div className="mb-4 flex flex-wrap gap-2">
              <ModeButton active={workspaceTab === "design"} onClick={() => setWorkspaceTab("design")}>Design</ModeButton>
              <ModeButton active={workspaceTab === "request"} onClick={() => setWorkspaceTab("request")}>Request</ModeButton>
              <ModeButton active={workspaceTab === "summary"} onClick={() => setWorkspaceTab("summary")}>Summary</ModeButton>
            </div>

            <div className="h-[calc(100%-3.25rem)] overflow-hidden">
              {workspaceTab === "design" ? (
                <div className="grid h-full gap-4 lg:grid-rows-[auto_auto_1fr_auto]">
                  <Field label="Design text" value={designText} onChange={setDesignText} placeholder="Add slogan or brand name" />
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Print zone</span>
                    <select value={selectedZone} onChange={(event) => setSelectedZone(event.target.value as PrintZone)} className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--accent)]">
                      {printZones.map((zone) => <option key={zone.value} value={zone.value}>{zone.label}</option>)}
                    </select>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{printZones.find((zone) => zone.value === selectedZone)?.description}</p>
                  </label>
                  <label className="block min-h-0">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Design direction</span>
                    <textarea value={designIdea} onChange={(event) => setDesignIdea(event.target.value)} rows={7} placeholder="Describe the concept you want refined" className="h-full min-h-[140px] w-full resize-none rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--accent)]" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Upload logo or reference</span>
                    <div className="rounded-[1.4rem] border border-dashed border-[var(--line)] bg-white/60 p-4">
                      <input type="file" accept="image/*" onChange={handleLogoUpload} />
                    </div>
                  </label>
                </div>
              ) : null}

              {workspaceTab === "request" ? (
                <form className="grid h-full gap-4 lg:grid-rows-[auto_auto_1fr_auto]" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Customer name" value={customerName} onChange={setCustomerName} placeholder="Jane Perera" />
                    <Field label="Phone or email" value={contact} onChange={setContact} placeholder="+94 77 123 4567" />
                    <Field label="Quantity" value={quantity} onChange={setQuantity} placeholder="50" />
                    <Field label="Deadline" value={deadline} onChange={setDeadline} placeholder="May 20" />
                  </div>
                  <div className="rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm text-slate-700">Asset slot: {selectedModel.modelPath}</div>
                  <label className="block min-h-0">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Production notes</span>
                    <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={8} placeholder="Sizing, event details, print notes" className="h-full min-h-[160px] w-full resize-none rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--accent)]" />
                  </label>
                  <div className="space-y-3">
                    <button type="submit" className="w-full rounded-[1.4rem] bg-[var(--accent-deep)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#0e2925]">Submit Design Request</button>
                    {submitted ? <div className="rounded-[1.4rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900">Concept captured. You can wire this form to email, Supabase, or a CRM next without changing the customizer flow.</div> : null}
                  </div>
                </form>
              ) : null}

              {workspaceTab === "summary" ? (
                <div className="grid h-full gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                  <SummaryRow label="Model" value={selectedModel.name} />
                  <SummaryRow label="Color" value={selectedColor.name} />
                  <SummaryRow label="Placement" value={printZones.find((zone) => zone.value === selectedZone)?.label ?? "Not selected"} />
                  <SummaryRow label="Asset slot" value={selectedModel.modelPath} />
                  <SummaryRow label="Text" value={designText || "No text added"} />
                  <SummaryRow label="Quantity" value={quantity} />
                  <div className="sm:col-span-2 xl:col-span-1 2xl:col-span-2 rounded-[1.2rem] border border-[var(--line)] bg-white/70 p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">Design notes</p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{designIdea || "No design notes added yet."}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function FlatPreviewCard({ color, text, logoDataUrl, zone }: { color: string; text: string; logoDataUrl: string | null; zone: PrintZone }) {
  const placement = {
    centerChest: "left-1/2 top-[33%] h-24 w-24 -translate-x-1/2",
    leftChest: "left-[42%] top-[28%] h-14 w-14 -translate-x-1/2",
    backCenter: "left-1/2 top-[34%] h-24 w-24 -translate-x-1/2 opacity-80",
    sleeve: "right-[23%] top-[26%] h-12 w-12",
  }[zone];

  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="relative h-[92%] aspect-[0.9] max-w-full">
        <div className="absolute left-1/2 top-[6%] h-[16%] w-[16%] -translate-x-1/2 rounded-full border-4 border-[#ece2d4] bg-transparent" />
        <div className="absolute left-[16%] top-[14%] h-[20%] w-[16%] -rotate-[32deg] rounded-[999px]" style={{ backgroundColor: color }} />
        <div className="absolute right-[16%] top-[14%] h-[20%] w-[16%] rotate-[32deg] rounded-[999px]" style={{ backgroundColor: color }} />
        <div className="absolute inset-x-[24%] top-[12%] bottom-[12%] rounded-[22%_22%_18%_18%/10%_10%_16%_16%] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]" style={{ backgroundColor: color }} />
        <div className="absolute inset-x-[23%] bottom-[10%] h-[3%] rounded-full bg-[#e7dcca]/80" />
        <div className={`absolute ${placement} flex items-center justify-center overflow-hidden rounded-xl bg-white/10 p-1`}>
          {logoDataUrl ? <Image src={logoDataUrl} alt="Uploaded logo" fill unoptimized className="object-contain p-1" /> : null}
          {text ? <span className="px-1 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-900 mix-blend-multiply">{text}</span> : null}
        </div>
      </div>
    </div>
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

function Pill({ children }: { children: React.ReactNode }) {
  return <div className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-2">{children}</div>;
}

function ModeButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`rounded-full px-4 py-2 text-sm transition ${active ? "bg-[var(--accent-deep)] text-white" : "border border-[var(--line)] bg-white/70 text-slate-700 hover:bg-white"}`}>{children}</button>;
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--accent)]" />
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[1.1rem] border border-[var(--line)] bg-white/70 px-4 py-3"><span className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">{label}</span><p className="mt-2 text-sm leading-6 text-slate-800">{value}</p></div>;
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
  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color, roughness: 0.94, metalness: 0.02 }), [color]);
  const trimMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ece2d4", roughness: 0.96, metalness: 0.01 }), []);
  const sleeveColor = modelId === "raglan" ? "#e7ddd0" : color;
  const sleeveScale = modelId === "longsleeve" ? 1.45 : 1;

  return (
    <group>
      <mesh position={[0, -1.12, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.05, 64]} />
        <meshStandardMaterial color="#224640" roughness={0.95} metalness={0.02} />
      </mesh>
      <mesh position={[0, 0.02, 0]} material={bodyMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[0.98, 1.08, 2.18, 12, 6]} />
      </mesh>
      <mesh position={[0, 0.82, 0]} scale={[1.02, 0.38, 0.72]} material={bodyMaterial} castShadow receiveShadow>
        <sphereGeometry args={[0.98, 20, 14]} />
      </mesh>
      <mesh position={[-1.1, 0.18 - (sleeveScale - 1) * 0.24, 0]} rotation={[0, 0, 0.52]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.36, 1.36 * sleeveScale, 10, 4]} />
        <meshStandardMaterial color={sleeveColor} roughness={0.94} metalness={0.02} />
      </mesh>
      <mesh position={[1.1, 0.18 - (sleeveScale - 1) * 0.24, 0]} rotation={[0, 0, -0.52]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.36, 1.36 * sleeveScale, 10, 4]} />
        <meshStandardMaterial color={sleeveColor} roughness={0.94} metalness={0.02} />
      </mesh>
      <mesh position={[0, -1.02, 0]} material={trimMaterial} castShadow receiveShadow>
        <torusGeometry args={[0.98, 0.035, 14, 40, Math.PI]} />
      </mesh>
      <Neckline modelId={modelId} />
      {modelId === "polo" ? <PoloPlacket /> : null}
      {modelId === "longsleeve" ? <HemBand y={-1.12} /> : null}
      <DesignPlane texture={frontTexture} position={[0, 0.12, 0.46]} scale={[0.86, 0.86, 0.86]} />
      <DesignPlane texture={leftTexture} position={[-0.38, 0.34, 0.46]} scale={[0.4, 0.4, 0.4]} />
      <DesignPlane texture={backTexture} position={[0, 0.16, -0.46]} scale={[0.94, 0.94, 0.94]} rotation={[0, Math.PI, 0]} />
      <DesignPlane texture={sleeveTexture} position={[1.32, 0.12, 0.04]} scale={[0.36, 0.36, 0.36]} rotation={[0, -Math.PI / 2, 0.08]} />
      <DesignPlane texture={sleeveTexture} position={[-1.32, 0.12, 0.04]} scale={[0.36, 0.36, 0.36]} rotation={[0, Math.PI / 2, -0.08]} />
    </group>
  );
}

function DesignPlane({ texture, position, rotation = [0, 0, 0], scale }: { texture: THREE.Texture | null; position: THREE.Vector3Tuple; rotation?: THREE.EulerTuple; scale: THREE.Vector3Tuple }) {
  if (!texture) return null;
  return <mesh position={position} rotation={rotation} scale={scale}><planeGeometry args={[1, 1]} /><meshBasicMaterial transparent map={texture} alphaTest={0.02} /></mesh>;
}

function Neckline({ modelId }: { modelId: string }) {
  if (modelId === "polo") return <><mesh position={[0, 1.14, 0.08]} rotation={[0.3, 0, 0]}><boxGeometry args={[0.92, 0.16, 0.1]} /><meshStandardMaterial color="#f0e7db" roughness={0.94} /></mesh><mesh position={[-0.22, 1.0, 0.2]} rotation={[0, 0, 0.56]}><boxGeometry args={[0.42, 0.09, 0.05]} /><meshStandardMaterial color="#eadfce" roughness={0.94} /></mesh><mesh position={[0.22, 1.0, 0.2]} rotation={[0, 0, -0.56]}><boxGeometry args={[0.42, 0.09, 0.05]} /><meshStandardMaterial color="#eadfce" roughness={0.94} /></mesh></>;
  if (modelId === "vneck") return <><mesh position={[-0.18, 0.96, 0.36]} rotation={[0, 0, 0.92]}><boxGeometry args={[0.46, 0.06, 0.06]} /><meshStandardMaterial color="#ece2d4" roughness={0.96} /></mesh><mesh position={[0.18, 0.96, 0.36]} rotation={[0, 0, -0.92]}><boxGeometry args={[0.46, 0.06, 0.06]} /><meshStandardMaterial color="#ece2d4" roughness={0.96} /></mesh></>;
  return <mesh position={[0, 1.02, 0.34]}><torusGeometry args={[0.32, 0.045, 18, 42, Math.PI]} /><meshStandardMaterial color="#ece2d4" roughness={0.96} /></mesh>;
}

function PoloPlacket() {
  return <><mesh position={[0, 0.78, 0.46]}><boxGeometry args={[0.12, 0.5, 0.02]} /><meshStandardMaterial color="#eadfce" roughness={0.94} /></mesh>{[-0.14, 0, 0.14].map((offset) => <mesh key={offset} position={[0, 0.88 - offset, 0.48]}><sphereGeometry args={[0.024, 16, 16]} /><meshStandardMaterial color="#d06f2f" roughness={0.5} metalness={0.12} /></mesh>)}</>;
}

function HemBand({ y }: { y: number }) {
  return <mesh position={[0, y, 0]}><torusGeometry args={[0.98, 0.04, 14, 38, Math.PI]} /><meshStandardMaterial color="#e7dcca" roughness={0.96} /></mesh>;
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


