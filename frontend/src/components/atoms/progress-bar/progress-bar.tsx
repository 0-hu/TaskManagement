import { cn } from "@/lib/cn";

type ProgressBarProps = {
  value: number;
  tone?: "info" | "warning" | "danger" | "success";
  className?: string;
};

const toneMap: Record<Required<ProgressBarProps>["tone"], string> = {
  info: "bg-blue-500",
  warning: "bg-amber-400",
  danger: "bg-rose-500",
  success: "bg-emerald-500"
};

export function ProgressBar({ value, tone = "info", className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-neutral-200",
        className
      )}
    >
      <div
        className={cn("h-full rounded-full", toneMap[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
