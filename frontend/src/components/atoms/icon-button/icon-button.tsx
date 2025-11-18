import { cn } from "@/lib/cn";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  variant?: "ghost" | "subtle";
};

export function IconButton({
  icon,
  className,
  variant = "ghost",
  ...props
}: IconButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 h-10 w-10";
  const palette =
    variant === "ghost"
      ? "bg-white border-neutral-200 hover:bg-neutral-100 focus-visible:outline-neutral-300"
      : "bg-neutral-100 border-neutral-200 hover:bg-neutral-200 focus-visible:outline-neutral-300";

  return (
    <button className={cn(base, palette, className)} {...props}>
      {icon}
    </button>
  );
}
