import Link from "next/link"
import { ArrowRight, Zap, Shield, Layers } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Zap,
    title: "빠른 시작",
    description: "헤더·푸터·사이드바·다크모드·네비·404·에러 페이지를 선제 구현. clone 후 즉시 개발 시작 가능합니다.",
  },
  {
    icon: Layers,
    title: "모던 스택",
    description: "Next.js 16 + React 19 + Tailwind v4 + shadcn/ui(radix-nova). 최신 App Router와 Server Components를 활용합니다.",
  },
  {
    icon: Shield,
    title: "타입 안전",
    description: "TypeScript strict 모드 + zod 환경변수 검증. 런타임 오류를 빌드 타임에 잡아냅니다.",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:py-40 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          {siteConfig.name}
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground text-lg md:text-xl mb-10">
          {siteConfig.description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/dashboard">
              대시보드 보기 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/about">소개 보기</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/40 border-t">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">주요 특징</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">지금 바로 시작하세요</h2>
        <p className="text-muted-foreground mb-8">
          스타터킷을 clone하고 원하는 앱을 만들어보세요.
        </p>
        <Button asChild size="lg" variant="outline">
          <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
            GitHub에서 보기 <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </section>
    </div>
  )
}
