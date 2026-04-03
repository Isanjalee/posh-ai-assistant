"use client";

type StepperProps = {
  currentStep: number;
  steps: { id: number; title: string; helper: string }[];
};

export function OrderStepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="grid gap-3 md:grid-cols-7">
      {steps.map((step) => {
        const active = step.id === currentStep;
        const complete = step.id < currentStep;

        return (
          <div
            key={step.id}
            className={`rounded-2xl border px-3 py-3 transition ${
              active
                ? "border-[var(--accent)] bg-[rgba(208,111,47,0.14)]"
                : complete
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-[var(--line)] bg-white/65"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  active
                    ? "bg-[var(--accent-deep)] text-white"
                    : complete
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-700"
                }`}
              >
                {step.id}
              </span>
              <p className="text-sm font-semibold text-slate-900">{step.title}</p>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-600">{step.helper}</p>
          </div>
        );
      })}
    </div>
  );
}
