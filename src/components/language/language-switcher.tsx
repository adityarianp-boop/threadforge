"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const switchLocale = (next: string) => {
    const parts = pathname.split("/");
    parts[1] = next;
    router.push(parts.join("/"));
  };
  return (
    <select value={locale} onChange={(e) => switchLocale(e.target.value)} className="rounded-lg border border-borderSoft bg-surfaceSecondary px-3 py-2 text-sm">
      <option value="en">English</option><option value="id">Indonesia</option>
    </select>
  );
}
