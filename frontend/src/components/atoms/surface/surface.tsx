import { Box } from "@/components/atoms/box/box";

type SurfaceProps = {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
};

export function Surface({ children, className, padding = "md" }: SurfaceProps) {
  return (
    <Box
      padding={padding}
      rounded="lg"
      border="subtle"
      shadow="sm"
      background="surface"
      className={className}
    >
      {children}
    </Box>
  );
}
