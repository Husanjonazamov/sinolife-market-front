// lib/utils.ts
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * ClassName birlashtirish uchun helper funksiya
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}
