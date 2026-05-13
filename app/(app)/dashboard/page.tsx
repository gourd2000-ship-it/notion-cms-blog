import type { Metadata } from "next"
import { Users, TrendingUp, ShoppingCart, DollarSign } from "lucide-react"

import { PageHeader } from "@/components/common/page-header"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "대시보드",
}

const stats = [
  {
    title: "총 사용자",
    value: "12,345",
    change: "+12%",
    icon: Users,
    trend: "up",
  },
  {
    title: "이번 달 매출",
    value: "₩2,450,000",
    change: "+8%",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "신규 주문",
    value: "284",
    change: "-3%",
    icon: ShoppingCart,
    trend: "down",
  },
  {
    title: "성장률",
    value: "23.5%",
    change: "+5%",
    icon: TrendingUp,
    trend: "up",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="대시보드" description="주요 지표를 한눈에 확인하세요." />

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>{stat.title}</CardDescription>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Badge
                variant={stat.trend === "up" ? "default" : "destructive"}
                className="mt-1 text-xs"
              >
                {stat.change} 전월 대비
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 스켈레톤 데모 */}
      <div>
        <h2 className="text-lg font-semibold mb-4">최근 활동 (로딩 중 예시)</h2>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
