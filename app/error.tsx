"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("앱 에러:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center px-6">
      <h1 className="text-4xl font-bold">문제가 발생했습니다</h1>
      <p className="text-muted-foreground max-w-sm">
        예기치 않은 오류가 발생했습니다. 다시 시도해 주세요.
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground font-mono">오류 ID: {error.digest}</p>
      )}
      <Button onClick={reset}>다시 시도</Button>
    </div>
  )
}
