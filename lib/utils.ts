import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateIframeCode(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return `<iframe
  src="${baseUrl}${path}"
  width="100%"
  height="600"
  frameborder="0"
  style="border:none;overflow:hidden;"
  loading="lazy">
</iframe>`;
}
