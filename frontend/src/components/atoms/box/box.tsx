import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";

const boxStyles = cva("", {
  variants: {
    padding: {
      none: "",
      sm: "p-2",
      md: "p-4",
      lg: "p-6"
    },
    rounded: {
      none: "",
      sm: "rounded-md",
      md: "rounded-lg",
      lg: "rounded-xl",
      full: "rounded-full"
    },
    border: {
      none: "",
      subtle: "border border-neutral-200",
      strong: "border border-neutral-300"
    },
    shadow: {
      none: "",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg"
    },
    background: {
      none: "",
      surface: "bg-white",
      muted: "bg-neutral-50"
    }
  },
  defaultVariants: {
    padding: "none",
    rounded: "none",
    border: "none",
    shadow: "none",
    background: "none"
  }
});

type BoxProps = VariantProps<typeof boxStyles> & React.HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
};

export function Box({
  asChild,
  className,
  padding,
  rounded,
  border,
  shadow,
  background,
  ...props
}: BoxProps) {
  const Component = asChild ? Slot : "div";
  return (
    <Component
      className={cn(boxStyles({ padding, rounded, border, shadow, background }), className)}
      {...props}
    />
  );
}
