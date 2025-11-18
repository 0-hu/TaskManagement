import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        solid: "bg-primary text-white hover:bg-primary-600 focus-visible:outline-primary",
        ghost: "bg-white text-neutral-800 hover:bg-neutral-100 focus-visible:outline-neutral-300 border border-neutral-200",
        subtle: "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 focus-visible:outline-neutral-300 border border-neutral-200"
      },
      size: {
        sm: "text-sm h-9 px-3 rounded-md",
        md: "text-sm h-10 px-4 rounded-lg",
        lg: "text-base h-11 px-5 rounded-lg"
      }
    },
    defaultVariants: {
      variant: "solid",
      size: "md"
    }
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles> & {
    asChild?: boolean;
  };

export function Button({
  asChild,
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      className={cn(buttonStyles({ variant, size }), className)}
      {...props}
    />
  );
}
