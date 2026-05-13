import type { Metadata } from "next"

import { PageHeader } from "@/components/common/page-header"

export const metadata: Metadata = {
  title: "소개",
  description: "Next.js Starter Kit 소개 페이지",
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <PageHeader
        title="소개"
        description="Next.js Starter Kit은 빠른 웹 개발을 위한 모던 스타터킷입니다."
      />
      <div className="mt-8 prose prose-neutral dark:prose-invert max-w-2xl">
        <p className="text-muted-foreground leading-7">
          이 스타터킷은 <strong>Next.js 16</strong>, <strong>React 19</strong>,{" "}
          <strong>Tailwind CSS v4</strong>, <strong>shadcn/ui</strong>를 기반으로
          실서비스 개발에 바로 착수할 수 있도록 설계되었습니다.
        </p>
        <p className="text-muted-foreground leading-7 mt-4">
          헤더·푸터·사이드바·다크모드·Route Group 분리 등 반복 작업을 미리 구현해
          실제 비즈니스 로직에 집중할 수 있습니다.
        </p>
      </div>
    </div>
  )
}
