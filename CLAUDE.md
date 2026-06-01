@AGENTS.md

# 개인 연구 블로그 (Notion CMS)

Notion을 단일 CMS로 활용하여 별도 배포 없이 글을 발행하는 개인 연구 블로그.
Notion에서 `Status = 발행됨`인 글을 작성하면 웹에 자동 반영된다 (Single Source of Truth).

📋 상세 요구사항: @docs/PRD.md
🗺️ 개발 로드맵: @docs/roadmap/ROADMAP.md
🎨 스타일링 가이드: @docs/guides/styling_guide.md

## 🛠️ 핵심 기술 스택

- **Framework**: Next.js 16.2.6 (App Router)
- **Runtime**: React 19.2.4 + TypeScript 5 (strict)
- **Styling**: Tailwind CSS v4 + shadcn/ui (radix-nova 스타일, baseColor: neutral)
- **UI**: Radix UI + Lucide Icons + sonner(토스트) + next-themes(다크모드)
- **Notion**: @notionhq/client 5.21.0 + notion-to-md 3.1.9
- **검증**: Zod 4 + @t3-oss/env-nextjs(환경 변수 스키마)
- **유틸**: clsx + tailwind-merge(cn), class-variance-authority, usehooks-ts
- **품질**: ESLint 9 (eslint-config-next)
- **배포**: Vercel

> ⚠️ react-hook-form, Prettier, Husky, lint-staged는 **미설치**. 폼은 Server Actions 기반으로 처리.

## 📁 디렉터리 구조

```
app/
  (marketing)/              # 블로그 영역 (공개 페이지)
    page.tsx                # 홈 — 글 목록
    posts/[id]/             # 글 상세 (NotionBlockRenderer 연동)
    categories/[category]/  # 카테고리별 목록
  (app)/dashboard/          # 스타터킷 잔존 대시보드 (블로그와 무관)
  api/health/               # 헬스 체크
components/
  features/                 # 블로그 기능 컴포넌트 (PascalCase: PostCard.tsx 등)
  layout/                   # blog-header, site-header/footer, nav (kebab-case)
  ui/                       # shadcn 컴포넌트 (kebab-case)
  theme/                    # 테마 provider/toggle
lib/
  notion.ts                 # getPublishedPosts, getPostById, getPostsByCategory, getCategories
  types.ts                  # Post, PostDetail, NotionBlock, Category
  mock-data.ts              # 환경 변수 미설정 시 폴백 목업
  env.ts                    # @t3-oss/env-nextjs 환경 변수 스키마
  utils.ts                  # cn() 등
```

> 경로 별칭: `@/*` → 프로젝트 루트 (`@/lib`, `@/components`, `@/components/ui`, `@/hooks`)

## ⚡ 자주 사용하는 명령어

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # ESLint 검사

npx shadcn@latest add <component>   # shadcn UI 컴포넌트 추가
```

## 📝 코딩 규칙 (요약)

- **언어**: 주석·커밋·문서는 한국어, 변수·함수명은 영어 / 들여쓰기 2칸
- **컴포넌트**: 기본 Server Component, 상호작용 필요 시에만 `"use client"`
- **파일명 컨벤션**: `features/`는 PascalCase, `ui/`·`layout/`은 kebab-case (기존 패턴 준수)
- **함수형 지향**: 작은 순수 함수, 가독성 우선, 외부 API 호출은 try-catch + 의미 있는 에러 메시지(한국어)
- **스타일**: Tailwind 유틸리티 우선, 클래스 병합은 `cn()`(lib/utils) 사용 — 색상·간격·컴포넌트 패턴은 @docs/guides/styling_guide.md 준수

## 🔌 Notion 연동 주의사항

- 환경 변수: `.env.local`에 `NOTION_TOKEN`, `NOTION_DATABASE_ID` (스키마는 `lib/env.ts`)
- 미설정 시 `lib/mock-data.ts`로 폴백되어 개발 가능
- **Rate Limit**: 초당 3 요청 → 페이지에 `revalidate`/ISR 캐싱 필수
- **이미지 URL 1시간 만료** → On-demand Revalidation 또는 프록시 고려
- `@notionhq/client` v5의 `dataSources` API 사용 → 구현 전 타입 정의 확인

## ⚠️ Next.js 16 주의

AGENTS.md 지침: 훈련 데이터와 다를 수 있으므로 코드 작성 전
`node_modules/next/dist/docs/` 의 해당 가이드를 먼저 확인할 것.

## ✅ 작업 완료 체크리스트

```bash
npm run lint     # 린트 통과
npm run build    # 빌드 성공 확인
```

