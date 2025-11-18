"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

type AvatarProps = {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md";
  className?: string;
};

const sizeMap: Record<Required<AvatarProps>["size"], { size: string; pixels: number }> = {
  sm: { size: "h-8 w-8 text-sm", pixels: 32 },
  md: { size: "h-10 w-10 text-base", pixels: 40 }
};

export function Avatar({ name, imageUrl, size = "md", className }: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizeConfig = sizeMap[size];

  if (imageUrl && !imageError) {
    return (
      <div className={cn("relative rounded-full overflow-hidden border border-neutral-200", sizeConfig.size, className)}>
        <Image
          src={imageUrl}
          alt={name}
          width={sizeConfig.pixels}
          height={sizeConfig.pixels}
          onError={() => setImageError(true)}
          className="object-cover"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200 font-semibold",
        sizeConfig.size,
        className
      )}
    >
      {initials}
    </div>
  );
}
