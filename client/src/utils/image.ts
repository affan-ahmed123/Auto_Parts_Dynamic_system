import React from "react";

export const getCategoryFallbackImage = (categoryName?: string): string => {
  if (!categoryName) return "/uploads/seed/default-part.svg";
  const name = categoryName.toLowerCase();

  if (name.includes("brake")) return "/uploads/seed/brakes.svg";
  if (name.includes("engine")) return "/uploads/seed/engine.svg";
  if (name.includes("suspension")) return "/uploads/seed/suspension.svg";
  if (name.includes("filter")) return "/uploads/seed/filters.svg";
  if (name.includes("electr") || name.includes("battery") || name.includes("spark"))
    return "/uploads/seed/electrical.svg";
  if (name.includes("light") || name.includes("lamp")) return "/uploads/seed/lights.svg";
  if (name.includes("body") || name.includes("bumper") || name.includes("mirror"))
    return "/uploads/seed/body.svg";
  if (name.includes("tyre") || name.includes("tire") || name.includes("wheel"))
    return "/uploads/seed/tyres-wheels.svg";
  if (name.includes("oil") || name.includes("fluid") || name.includes("lubricant"))
    return "/uploads/seed/oils-fluids.svg";

  return "/uploads/seed/default-part.svg";
};

export const resolveImageUrl = (
  rawUrl?: string | null,
  categoryName?: string
): string => {
  if (!rawUrl || typeof rawUrl !== "string" || !rawUrl.trim()) {
    return getCategoryFallbackImage(categoryName);
  }

  const trimmed = rawUrl.trim();

  // If already full URL or data URI
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  // If starts with /uploads/ or /
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return `/${trimmed}`;
};

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  categoryName?: string
): void => {
  const target = e.currentTarget;
  const fallback = getCategoryFallbackImage(categoryName);
  if (target.src !== fallback && !target.src.endsWith(fallback)) {
    target.src = fallback;
  }
};

