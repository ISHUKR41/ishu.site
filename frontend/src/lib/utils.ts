/**
 * utils.ts - Shared Utility Functions
 * 
 * cn() - Combines CSS class names intelligently.
 * Merges Tailwind classes without conflicts (e.g., "p-2 p-4" → "p-4").
 * Handles conditional classes: cn("base", isActive && "active-class")
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
