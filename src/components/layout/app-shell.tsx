"use client";

import { motion } from "framer-motion";
import { Menu, TrendingUp, X } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/language/language-switcher";
import { appNav } from "@/lib/constants/nav";
import { cn } from "@/lib/utils/cn";

const iconByName = {
  TrendingUp
} as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const tNav = useTranslations("nav");
  const tShell = useTranslations("shell");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navLocale = locale as "en" | "id";

  return (
    <div className="min-h-screen bg-background">
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : -320 }}
        className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-borderSoft bg-surface p-4 lg:hidden"
      >
        <button className="mb-4 rounded-lg border border-borderSoft p-2" onClick={() => setOpen(false)}>
          <X size={16} />
        </button>
        <nav className="space-y-1">
          {appNav.map((item) => {
            const href = `/${locale}${item.href}`;
            const active = pathname === href;
            const Icon = typeof item.icon === "string" ? iconByName[item.icon as keyof typeof iconByName] : item.icon;
            const label = "key" in item ? tNav(item.key) : item.label[navLocale];
            return (
              <Link
                key={"key" in item ? item.key : item.href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-textSecondary hover:bg-surfaceSecondary",
                  active && "bg-surfaceSecondary text-textPrimary"
                )}
              >
                {Icon ? <Icon size={16} /> : null}
                {label}
              </Link>
            );
          })}
        </nav>
      </motion.aside>

      <div className="mx-auto flex max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 border-r border-borderSoft bg-surface/60 p-4 backdrop-blur lg:block">
          <h1 className="mb-6 text-lg font-semibold">ThreadForge</h1>
          <nav className="space-y-1">
            {appNav.map((item) => {
              const href = `/${locale}${item.href}`;
              const active = pathname === href;
              const Icon = typeof item.icon === "string" ? iconByName[item.icon as keyof typeof iconByName] : item.icon;
              const label = "key" in item ? tNav(item.key) : item.label[navLocale];
              return (
                <Link
                  key={"key" in item ? item.key : item.href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-textSecondary hover:bg-surfaceSecondary",
                    active && "bg-surfaceSecondary text-textPrimary"
                  )}
                >
                  {Icon ? <Icon size={16} /> : null}
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="w-full p-4 lg:p-8">
          <header className="mb-6 flex items-center justify-between rounded-2xl border border-borderSoft bg-surface p-4">
            <button className="rounded-lg border border-borderSoft p-2 lg:hidden" onClick={() => setOpen(true)}>
              <Menu size={16} />
            </button>
            <p className="text-sm text-textSecondary">{tShell("tagline")}</p>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <button className="rounded-lg border border-borderSoft px-3 py-2 text-sm">{tShell("user")}</button>
            </div>
          </header>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
