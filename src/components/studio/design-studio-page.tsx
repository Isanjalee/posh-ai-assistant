"use client";

import Link from "next/link";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { colorOptions, orderTypes, printPlacements, shirtModels } from "@/config/shirt-models";
import { useApprovalWorkflow } from "@/hooks/use-approval-workflow";
import { useSaveDraft } from "@/hooks/use-save-draft";
import { orderRequestSchema, type OrderRequestFormValues } from "@/schemas/order-request";
import { useStudioStore } from "@/store/use-studio-store";
import type { OrderType, PrintPlacement, ShirtModelId } from "@/types/order";
import { OrderStepper } from "@/components/studio/order-stepper";
import { OrderSummaryPanel } from "@/components/studio/order-summary-panel";
import { TshirtPreview } from "@/components/studio/tshirt-preview";
import { AppTopNav } from "@/components/shared/app-top-nav";

const steps = [
  { id: 1, title: "Order type", helper: "Start with the business context." },
  { id: 2, title: "T-shirt model", helper: "Pick the garment base." },
  { id: 3, title: "Base color", helper: "Choose the safest starting color." },
  { id: 4, title: "Logo + text", helper: "Add identity elements." },
  { id: 5, title: "Placement", helper: "Confirm print position." },
  { id: 6, title: "Bulk details", helper: "Capture quantities and contact info." },
  { id: 7, title: "Review", helper: "Check and submit." },
] as const;

export function DesignStudioPage() {
  const {
    currentStep,
    draft,
    setStep,
    nextStep,
    previousStep,
    patchDraft,
    setOrderType,
    setModel,
    setPlacement,
    submitDraft,
  } = useStudioStore();
  const { saveDraft } = useSaveDraft();
  const { requestApproval } = useApprovalWorkflow();

  const form = useForm<OrderRequestFormValues>({
    resolver: zodResolver(orderRequestSchema),
    defaultValues: {
      quantity: draft.quantity,
      sizeBreakdown: draft.sizeBreakdown,
      fitSplit: draft.fitSplit,
      notes: draft.notes,
      deadline: draft.deadline,
      customerName: draft.customerName,
      companyName: draft.companyName,
      email: draft.email,
      phone: draft.phone,
    },
  });

  useEffect(() => {
    form.reset({
      quantity: draft.quantity,
      sizeBreakdown: draft.sizeBreakdown,
      fitSplit: draft.fitSplit,
      notes: draft.notes,
      deadline: draft.deadline,
      customerName: draft.customerName,
      companyName: draft.companyName,
      email: draft.email,
      phone: draft.phone,
    });
  }, [draft, form]);

  const activeModel = shirtModels.find((item) => item.id === draft.shirtModelId) ?? shirtModels[0];

  const persistBulkForm = async () => {
    const valid = await form.trigger();
    if (!valid) return false;
    patchDraft(form.getValues());
    return true;
  };

  const handleNext = async () => {
    if (currentStep === 6) {
      const ok = await persistBulkForm();
      if (!ok) return;
    }
    nextStep();
  };

  const handleSubmit = async () => {
    const ok = await persistBulkForm();
    if (!ok) {
      setStep(6);
      return;
    }
    await saveDraft();
    await requestApproval();
    submitDraft();
  };

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4">`r`n        <AppTopNav />
        <section className="glass-panel rounded-[1.8rem] p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-slate-500">Design Studio</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Guided B2B apparel ordering workflow</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Opinionated step-by-step flow for company uniforms, campus batch orders, and custom T-shirt requests. The goal is fewer wrong turns and clearer handoff to sales, design, and production.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/landing" className="rounded-full border border-[var(--line)] bg-white/75 px-4 py-2 text-sm text-slate-700 transition hover:bg-white">View landing page</Link>
              <Link href="/requests" className="rounded-full bg-[var(--accent-deep)] px-4 py-2 text-sm text-white transition hover:bg-[#0e2925]">Request summary</Link>
            </div>
          </div>
          <div className="mt-5">
            <OrderStepper currentStep={currentStep} steps={[...steps]} />
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
          <div className="grid gap-4 2xl:grid-rows-[minmax(360px,0.9fr)_minmax(320px,1.1fr)]">
            <TshirtPreview draft={draft} model={activeModel} />
            <section className="glass-panel rounded-[1.6rem] p-5">
              <div className="flex flex-col">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-slate-500">Step {currentStep}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">{steps[currentStep - 1].title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{steps[currentStep - 1].helper}</p>
                </div>

                <div className="mt-5">
                  {currentStep === 1 ? <OrderTypeStep value={draft.orderType} onChange={setOrderType} /> : null}
                  {currentStep === 2 ? <ModelStep value={draft.shirtModelId} orderType={draft.orderType} onChange={setModel} /> : null}
                  {currentStep === 3 ? <ColorStep value={draft.baseColorId} onChange={(baseColorId) => patchDraft({ baseColorId })} /> : null}
                  {currentStep === 4 ? <DesignStep draft={draft} onPatch={patchDraft} /> : null}
                  {currentStep === 5 ? <PlacementStep value={draft.printPlacement} onChange={setPlacement} /> : null}
                  {currentStep === 6 ? <BulkOrderStep form={form} /> : null}
                  {currentStep === 7 ? <ReviewStep draft={draft} modelName={activeModel.name} /> : null}
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
                  <button type="button" onClick={previousStep} disabled={currentStep === 1} className="rounded-full border border-[var(--line)] bg-white/70 px-5 py-3 text-sm text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => void saveDraft()} className="rounded-full border border-[var(--line)] bg-white/70 px-5 py-3 text-sm text-slate-700 transition hover:bg-white">Save draft</button>
                    {currentStep < 7 ? (
                      <button type="button" onClick={() => void handleNext()} className="rounded-full bg-[var(--accent-deep)] px-5 py-3 text-sm text-white transition hover:bg-[#0e2925]">Continue</button>
                    ) : (
                      <button type="button" onClick={() => void handleSubmit()} className="rounded-full bg-[var(--accent-deep)] px-5 py-3 text-sm text-white transition hover:bg-[#0e2925]">Submit request</button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="hidden xl:block xl:min-h-0">
            <OrderSummaryPanel draft={draft} />
          </div>
        </div>
      </div>
    </main>
  );
}

function OrderTypeStep({ value, onChange }: { value: OrderType; onChange: (value: OrderType) => void }) {
  return <div className="grid gap-3 md:grid-cols-3">{orderTypes.map((item) => <button key={item.id} type="button" onClick={() => onChange(item.id)} className={`rounded-[1.4rem] border p-5 text-left transition ${value === item.id ? "border-[var(--accent)] bg-[rgba(208,111,47,0.12)]" : "border-[var(--line)] bg-white/70 hover:bg-white"}`}><p className="font-semibold text-slate-900">{item.name}</p><p className="mt-1 text-sm text-[var(--accent-deep)]">{item.subtitle}</p><p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p></button>)}</div>;
}

function ModelStep({ value, orderType, onChange }: { value: ShirtModelId; orderType: OrderType; onChange: (value: ShirtModelId) => void }) {
  const filtered = shirtModels.filter((item) => item.suitableFor.includes(orderType));
  return <div className="grid gap-3 md:grid-cols-2">{filtered.map((item) => <button key={item.id} type="button" onClick={() => onChange(item.id)} className={`rounded-[1.4rem] border p-5 text-left transition ${value === item.id ? "border-[var(--accent)] bg-[rgba(208,111,47,0.12)]" : "border-[var(--line)] bg-white/70 hover:bg-white"}`}><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-slate-900">{item.name}</p><p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p></div><span className="rounded-full bg-slate-900 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white">{item.badge}</span></div></button>)}</div>;
}

function ColorStep({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <div className="grid gap-3 md:grid-cols-5">{colorOptions.map((item) => <button key={item.id} type="button" onClick={() => onChange(item.id)} className={`rounded-[1.3rem] border p-4 text-left transition ${value === item.id ? "border-[var(--accent)] bg-[rgba(208,111,47,0.1)]" : "border-[var(--line)] bg-white/70 hover:bg-white"}`}><div className="h-12 rounded-xl border border-black/5" style={{ backgroundColor: item.hex }} /><p className="mt-3 text-sm font-medium text-slate-800">{item.name}</p></button>)}</div>;
}

function DesignStep({ draft, onPatch }: { draft: { customText: string; designIdea: string; logoDataUrl: string | null }; onPatch: (patch: { customText?: string; designIdea?: string; logoDataUrl?: string | null }) => void }) {
  return (
    <div className="grid h-full gap-4 lg:grid-rows-[auto_1fr_auto]">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Custom text</span>
        <input value={draft.customText} onChange={(event) => onPatch({ customText: event.target.value })} placeholder="Company slogan, club name, or drop title" className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--accent)]" />
      </label>
      <label className="block min-h-0">
        <span className="mb-2 block text-sm font-medium text-slate-700">Design direction</span>
        <textarea value={draft.designIdea} onChange={(event) => onPatch({ designIdea: event.target.value })} rows={8} placeholder="Keep this short and practical so your design team can act on it quickly." className="h-full min-h-[180px] w-full resize-none rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--accent)]" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Logo upload</span>
        <div className="rounded-[1.4rem] border border-dashed border-[var(--line)] bg-white/60 p-4">
          <input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => onPatch({ logoDataUrl: typeof reader.result === "string" ? reader.result : null }); reader.readAsDataURL(file); }} />
          <p className="mt-3 text-sm text-slate-600">PNG works best for transparent brand marks. TODO: Add image crop and background removal.</p>
        </div>
      </label>
    </div>
  );
}

function PlacementStep({ value, onChange }: { value: PrintPlacement; onChange: (value: PrintPlacement) => void }) {
  return <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{printPlacements.map((item) => <button key={item.id} type="button" onClick={() => onChange(item.id)} className={`rounded-[1.3rem] border p-5 text-left transition ${value === item.id ? "border-[var(--accent)] bg-[rgba(208,111,47,0.12)]" : "border-[var(--line)] bg-white/70 hover:bg-white"}`}><p className="font-semibold text-slate-900">{item.name}</p><p className="mt-3 text-sm leading-6 text-slate-600">{item.helper}</p></button>)}</div>;
}

function BulkOrderStep({ form }: { form: UseFormReturn<OrderRequestFormValues> }) {
  const { register, formState: { errors } } = form;
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <Field label="Quantity" error={errors.quantity?.message}><input type="number" {...register("quantity", { valueAsNumber: true })} className={inputClass} /></Field>
      <Field label="Deadline" error={errors.deadline?.message}><input type="date" {...register("deadline")} className={inputClass} /></Field>
      <Field label="Customer name" error={errors.customerName?.message}><input {...register("customerName")} className={inputClass} /></Field>
      <Field label="Company / Campus / Group" error={errors.companyName?.message}><input {...register("companyName")} className={inputClass} /></Field>
      <Field label="Email" error={errors.email?.message}><input {...register("email")} className={inputClass} /></Field>
      <Field label="Phone" error={errors.phone?.message}><input {...register("phone")} className={inputClass} /></Field>
      <div className="rounded-[1.3rem] border border-[var(--line)] bg-white/75 p-4 lg:col-span-2">
        <p className="text-sm font-semibold text-slate-900">Size breakdown</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">{(["xs","s","m","l","xl","xxl"] as const).map((size) => <Field key={size} label={size.toUpperCase()} error={errors.sizeBreakdown?.[size]?.message}><input type="number" {...register(`sizeBreakdown.${size}`, { valueAsNumber: true })} className={inputClass} /></Field>)}</div>
      </div>
      <div className="rounded-[1.3rem] border border-[var(--line)] bg-white/75 p-4 lg:col-span-2">
        <p className="text-sm font-semibold text-slate-900">Optional male / female fit split</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Male fit" error={errors.fitSplit?.male?.message}><input type="number" {...register("fitSplit.male", { valueAsNumber: true })} className={inputClass} /></Field>
          <Field label="Female fit" error={errors.fitSplit?.female?.message}><input type="number" {...register("fitSplit.female", { valueAsNumber: true })} className={inputClass} /></Field>
        </div>
      </div>
      <div className="lg:col-span-2">
        <Field label="Notes" error={errors.notes?.message}><textarea {...register("notes")} rows={6} className={`${inputClass} resize-none`} /></Field>
      </div>
    </div>
  );
}

function ReviewStep({ draft, modelName }: { draft: { orderType: string; customText: string; designIdea: string; quantity: number; notes: string; companyName: string }; modelName: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ReviewCard title="Order type" value={draft.orderType} />
      <ReviewCard title="Garment" value={modelName} />
      <ReviewCard title="Text" value={draft.customText || "No custom text"} />
      <ReviewCard title="Bulk quantity" value={String(draft.quantity)} />
      <ReviewCard title="Organization" value={draft.companyName || "Pending"} />
      <ReviewCard title="Notes" value={draft.notes} />
      <div className="md:col-span-2 rounded-[1.4rem] border border-[var(--line)] bg-white/75 p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">Design brief</p>
        <p className="mt-3 text-sm leading-7 text-slate-700">{draft.designIdea}</p>
        <p className="mt-4 text-sm text-slate-600">TODO: Add generated PDF summary and internal handoff checklist before the admin dashboard phase.</p>
      </div>
    </div>
  );
}

function ReviewCard({ title, value }: { title: string; value: string }) {
  return <div className="rounded-[1.3rem] border border-[var(--line)] bg-white/75 p-4"><p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">{title}</p><p className="mt-3 text-sm leading-6 text-slate-800">{value}</p></div>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>{children}{error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}</label>;
}

const inputClass = "w-full rounded-2xl border border-[var(--line)] bg-white/85 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--accent)]";






