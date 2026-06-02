import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * @description 이미지 URL이 렌더링하기 안전한지 검증합니다.
 * https: 프로토콜만 허용하여 javascript:, data: 등 위험 스킴을 차단합니다.
 * @param {string} url - 검증할 이미지 URL
 * @returns {boolean} https: 프로토콜이면 true
 */
export function isSafeImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "https:"
  } catch {
    return false
  }
}
