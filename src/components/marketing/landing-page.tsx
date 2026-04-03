import Link from "next/link";
import { orderTypes } from "@/config/shirt-models";
import { AppTopNav } from "@/components/shared/app-top-nav";

const process = [
  { title: "Pick the order context", text: "Corporate, campus, or custom. The workflow adjusts the language and recommendations automatically." },
  { title: "Customize the garment", text: "Choose the shirt model, color, placement, logo, and text through one guided path instead of a crowded form." },
  { title: "Review bulk details", text: "Capture sizes, fit split, deadline, and contact data before the request reaches sales and production." },
  { title: "Hand off with clarity", text: "The same request can support future approvals, quoting, design review, and production scheduling." },
];

export function LandingPage() {
  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1600px] flex-col gap-4">`r`n        <AppTopNav />
        <section className="glass-panel section-grid relative overflow-hidden rounded-[2rem] p-6 lg:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-r from-[rgba(208,111,47,0.18)] via-transparent to-[rgba(18,53,47,0.18)]" />
          <div className="relative grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-3 rounded-full border border-[var(--line)] bg-white/75 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--accent-deep)]">
                TeeCraft 3D <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> B2B apparel ordering platform
              </div>
              <div className="max-w-4xl space-y-4">
                <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">Modern ordering for company shirts, campus batches, and custom T-shirt programs.</h1>
                <p className="max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">Built as a real industry-facing workflow: guided customization, clearer handoff for sales and design, and product-style previews that help customers approve faster.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/" className="rounded-full bg-[var(--accent-deep)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0e2925]">Start designing</Link>
                <Link href="/requests" className="rounded-full border border-[var(--line)] bg-white/75 px-6 py-3 text-sm text-slate-700 transition hover:bg-white">View request summary</Link>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {orderTypes.map((type) => (
                  <div key={type.id} className="rounded-[1.4rem] border border-[var(--line)] bg-white/70 p-5">
                    <p className="font-semibold text-slate-900">{type.name}</p>
                    <p className="mt-2 text-sm text-[var(--accent-deep)]">{type.subtitle}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{type.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-1">
              <div className="glass-panel rounded-[1.6rem] p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">Why it works</p>
                <div className="mt-4 grid gap-3">
                  <Feature label="Simple guided workflow" text="One decision at a time so customers do not second-guess the process." />
                  <Feature label="Multi-angle garment preview" text="Catalog-style mockups plus an interactive 3D viewer for confidence before submission." />
                  <Feature label="Team-ready request data" text="Structured bulk details that can feed future quoting, design review, and production planning." />
                </div>
              </div>
              <div className="glass-panel rounded-[1.6rem] p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">Process overview</p>
                <div className="mt-4 grid gap-3">
                  {process.map((item, index) => (
                    <div key={item.title} className="rounded-[1.2rem] border border-[var(--line)] bg-white/72 p-4">
                      <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-deep)] text-sm font-semibold text-white">{index + 1}</span><p className="font-semibold text-slate-900">{item.title}</p></div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Feature({ label, text }: { label: string; text: string }) {
  return <div className="rounded-[1.2rem] border border-[var(--line)] bg-white/72 p-4"><p className="font-semibold text-slate-900">{label}</p><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>;
}




