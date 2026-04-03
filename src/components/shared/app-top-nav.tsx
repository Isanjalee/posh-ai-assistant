"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/landing", label: "Landing" },
  { href: "/", label: "Studio" },
  { href: "/requests", label: "Requests" },
];

export function AppTopNav() {
  const pathname = usePathname();

  return (
    <nav className="glass-panel rounded-[1.2rem] px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent-deep)]">
          TeeCraft 3D
        </Link>
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active
                    ? "bg-[var(--accent-deep)] text-white"
                    : "border border-[var(--line)] bg-white/70 text-slate-700 hover:bg-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
