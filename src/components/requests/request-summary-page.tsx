"use client";

import Link from "next/link";
import { colorOptions, printPlacements, shirtModels } from "@/config/shirt-models";
import { useStudioStore } from "@/store/use-studio-store";
import { AppTopNav } from "@/components/shared/app-top-nav";

const statusTone = {
  new: "bg-sky-100 text-sky-900",
  "design-review": "bg-amber-100 text-amber-900",
  quoted: "bg-violet-100 text-violet-900",
  "production-ready": "bg-emerald-100 text-emerald-900",
} as const;

export function RequestSummaryPage() {
  const orders = useStudioStore((state) => state.submittedOrders);

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1600px] flex-col gap-4">`r`n        <AppTopNav />
        <section className="glass-panel rounded-[1.8rem] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-slate-500">Request summary</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Admin-style order intake view</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">This page is intentionally shaped like an internal request monitor so the app can evolve into a real dashboard later without rethinking the data model.</p>
            </div>
            <div className="flex gap-2">
              <Link href="/landing" className="rounded-full border border-[var(--line)] bg-white/75 px-4 py-2 text-sm text-slate-700 transition hover:bg-white">Landing</Link>
              <Link href="/" className="rounded-full bg-[var(--accent-deep)] px-4 py-2 text-sm text-white transition hover:bg-[#0e2925]">Open studio</Link>
            </div>
          </div>
        </section>

        <section className="grid flex-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="glass-panel rounded-[1.8rem] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Requests</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Submitted order concepts</h2>
              </div>
              <div className="rounded-full border border-[var(--line)] bg-white/72 px-4 py-2 text-sm text-slate-700">{orders.length} request(s)</div>
            </div>
            <div className="mt-5 grid gap-3">
              {orders.length === 0 ? (
                <div className="rounded-[1.4rem] border border-dashed border-[var(--line)] bg-white/65 p-8 text-sm leading-7 text-slate-600">No requests yet. Submit one from the design studio to see how the sales and design summary will look.</div>
              ) : (
                orders.map((order) => {
                  const model = shirtModels.find((item) => item.id === order.shirtModelId);
                  const color = colorOptions.find((item) => item.id === order.baseColorId);
                  const placement = printPlacements.find((item) => item.id === order.printPlacement);
                  return (
                    <article key={order.id} className="rounded-[1.4rem] border border-[var(--line)] bg-white/72 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">{order.id}</p>
                          <h3 className="mt-2 text-xl font-semibold text-slate-900">{order.companyName || order.customerName || "Untitled request"}</h3>
                          <p className="mt-1 text-sm text-slate-600">{model?.name ?? "Round Neck"} in {color?.name ?? "White"} with {placement?.name ?? "Center chest"} placement.</p>
                        </div>
                        <span className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${statusTone[order.status]}`}>{order.status}</span>
                      </div>
                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <Metric label="Order type" value={order.orderType} />
                        <Metric label="Quantity" value={String(order.quantity)} />
                        <Metric label="Deadline" value={order.deadline || "Pending"} />
                      </div>
                      <div className="mt-4 rounded-[1.2rem] border border-[var(--line)] bg-white p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Notes</p>
                        <p className="mt-3 text-sm leading-7 text-slate-700">{order.notes}</p>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
          <aside className="glass-panel rounded-[1.8rem] p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Roadmap hooks</p>
            <div className="mt-4 grid gap-3">
              <RoadmapCard title="Sales triage" text="TODO: connect quote generation, margin rules, and CRM sync." />
              <RoadmapCard title="Design review" text="TODO: attach artwork revisions, comments, and approval requests." />
              <RoadmapCard title="Production planning" text="TODO: convert approved requests into print-ready production jobs." />
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-[var(--line)] bg-white p-4"><p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</p><p className="mt-2 text-sm font-medium text-slate-800">{value}</p></div>;
}

function RoadmapCard({ title, text }: { title: string; text: string }) {
  return <div className="rounded-[1.2rem] border border-[var(--line)] bg-white/72 p-4"><p className="font-semibold text-slate-900">{title}</p><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>;
}




