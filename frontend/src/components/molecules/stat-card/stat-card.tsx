import { Surface } from "@/components/atoms/surface/surface";
import { Text } from "@/components/atoms/text/text";
import { ProgressBar } from "@/components/atoms/progress-bar/progress-bar";
import { Box } from "@/components/atoms/box/box";
import { cn } from "@/lib/cn";

type StatCardProps = {
  label: string;
  value: number;
  sublabel: string;
  tone?: "info" | "warning" | "danger" | "success";
  progress?: number;
  icon?: React.ReactNode;
};

const toneClass: Record<NonNullable<StatCardProps["tone"]>, string> = {
  info: "text-blue-600",
  warning: "text-amber-500",
  danger: "text-rose-500",
  success: "text-emerald-600"
};

const barTone: Record<NonNullable<StatCardProps["tone"]>, "info" | "warning" | "danger" | "success"> = {
  info: "info",
  warning: "warning",
  danger: "danger",
  success: "success"
};

export function StatCard({
  label,
  value,
  sublabel,
  tone = "info",
  progress,
  icon
}: StatCardProps) {
  return (
    <Surface className="w-full p-4">
      <Box className="mb-3 flex items-center justify-between">
        <Text size="sm" weight="medium" color="subtle">
          {label}
        </Text>
        {icon}
      </Box>
      <Box className="flex items-center gap-2">
        <Text as="div" size="lg" weight="bold" className={cn("text-2xl", toneClass[tone])}>
          {value}
        </Text>
      </Box>
      <Text as="div" size="sm" color="subtle" className="mt-1">
        {sublabel}
      </Text>
      {typeof progress === "number" ? (
        <Box className="mt-3">
          <ProgressBar value={progress} tone={barTone[tone]} />
        </Box>
      ) : null}
    </Surface>
  );
}
