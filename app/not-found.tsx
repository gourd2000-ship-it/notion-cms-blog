import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center px-6">
      <h1 className="text-8xl font-bold text-muted-foreground">404</h1>
      <h2 className="text-2xl font-semibold">페이지를 찾을 수 없습니다</h2>
      <p className="text-muted-foreground max-w-sm">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Button asChild>
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  )
}
