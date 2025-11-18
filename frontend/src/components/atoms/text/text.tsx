import { cn } from "@/lib/cn";

type TextProps = {
  as?: keyof JSX.IntrinsicElements;
  weight?: "normal" | "medium" | "semibold" | "bold";
  size?: "xs" | "sm" | "md" | "lg";
  color?: "default" | "muted" | "subtle";
  children: React.ReactNode;
  className?: string;
};

const sizeMap: Record<Required<TextProps>["size"], string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg"
};

const weightMap: Record<Required<TextProps>["weight"], string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold"
};

const colorMap: Record<Required<TextProps>["color"], string> = {
  default: "text-neutral-800",
  muted: "text-neutral-600",
  subtle: "text-neutral-500"
};

export function Text({
  as = "span",
  children,
  className,
  color = "default",
  size = "md",
  weight = "normal"
}: TextProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        sizeMap[size],
        weightMap[weight],
        colorMap[color],
        className
      )}
    >
      {children}
    </Component>
  );
}
