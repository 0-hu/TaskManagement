import { cn } from "@/lib/cn";

type BadgeProps = {
  tone?: "info" | "warning" | "danger" | "success" | "muted";
  children: React.ReactNode;
  className?: string;
};

const toneMap: Record<Required<BadgeProps>["tone"], string> = {
  info: "bg-blue-50 text-blue-700 border-blue-100",
  warning: "bg-amber-50 text-amber-700 border-amber-100",
  danger: "bg-rose-50 text-rose-700 border-rose-100",
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  muted: "bg-neutral-100 text-neutral-700 border-neutral-200"
};

export function Badge({ tone = "muted", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        toneMap[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
