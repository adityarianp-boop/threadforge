import { cn } from "@/lib/utils/cn";
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-borderSoft bg-surface p-5", className)} {...props} />;
}
