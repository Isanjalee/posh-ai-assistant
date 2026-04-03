import { colorOptions, printPlacements, shirtModels } from "@/config/shirt-models";
import type { OrderDraft } from "@/types/order";

export function OrderSummaryPanel({ draft }: { draft: OrderDraft }) {
  const model = shirtModels.find((item) => item.id === draft.shirtModelId);
  const color = colorOptions.find((item) => item.id === draft.baseColorId);
  const placement = printPlacements.find((item) => item.id === draft.printPlacement);

  return (
    <aside className="glass-panel flex h-full flex-col rounded-[1.6rem] p-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-500">Live summary</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Order snapshot</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Always visible on desktop so the sales and design teams can confirm key decisions without re-reading every step.</p>
      </div>

      <div className="mt-5 grid gap-3">
        <SummaryRow label="Order type" value={draft.orderType} />
        <SummaryRow label="Model" value={model?.name ?? "Round Neck"} />
        <SummaryRow label="Color" value={color?.name ?? "White"} />
        <SummaryRow label="Placement" value={placement?.name ?? "Center chest"} />
        <SummaryRow label="Quantity" value={String(draft.quantity)} />
        <SummaryRow label="Text" value={draft.customText || "No custom text"} />
      </div>

      <div className="mt-5 rounded-[1.2rem] border border-[var(--line)] bg-white/70 p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Bulk sizes</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-slate-700">
          <SizeCell size="XS" value={draft.sizeBreakdown.xs} />
          <SizeCell size="S" value={draft.sizeBreakdown.s} />
          <SizeCell size="M" value={draft.sizeBreakdown.m} />
          <SizeCell size="L" value={draft.sizeBreakdown.l} />
          <SizeCell size="XL" value={draft.sizeBreakdown.xl} />
          <SizeCell size="XXL" value={draft.sizeBreakdown.xxl} />
        </div>
      </div>

      <div className="mt-5 rounded-[1.2rem] border border-[var(--line)] bg-white/70 p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Design notes</p>
        <p className="mt-3 text-sm leading-7 text-slate-700">{draft.designIdea || "No design idea added yet."}</p>
      </div>

      <div className="mt-auto rounded-[1.2rem] border border-[var(--line)] bg-[rgba(18,53,47,0.06)] p-4 text-sm leading-6 text-slate-700">
        TODO: Add live pricing, margin guidance, and sales approval checks here when the API layer is introduced.
      </div>
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] border border-[var(--line)] bg-white/72 px-4 py-3">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm text-slate-800">{value}</p>
    </div>
  );
}

function SizeCell({ size, value }: { size: string; value: number }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{size}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}
