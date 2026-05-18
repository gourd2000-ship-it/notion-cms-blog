# Development Guidelines

## 1. 프로젝트 개요

- **목적**: Notion을 CMS로 활용하는 개인 연구 블로그
- **스택**: Next.js 16.x · TypeScript 5.x · Tailwind CSS 4.x · shadcn/ui · @notionhq/client v5.x · notion-to-md
- **배포**: Vercel

---

## 2. 프로젝트 아키텍처

### 디렉터리 구조

```
app/
  (marketing)/          # 공개 블로그 라우트 그룹
    layout.tsx          # BlogHeader + SiteFooter 포함
    page.tsx            # 홈 — 포스트 목록 (/)
    posts/[id]/         # 포스트 상세 (/posts/:id)
    posts/              # 포스트 전체 목록 (/posts)
    categories/[category]/ # 카테고리 필터 (/categories/:category)
    about/              # 소개 페이지
  (app)/                # 인증 필요 대시보드 라우트 그룹
    dashboard/
  api/                  # API 라우트 (app router)
  layout.tsx            # 루트 레이아웃 (ThemeProvider, Toaster, TooltipProvider)
  globals.css

components/
  features/             # 블로그 도메인 컴포넌트 (PostCard, PostListClient, CategoryFilter)
  layout/               # 공유 레이아웃 컴포넌트 (blog-header, site-header, site-footer, app-sidebar)
  ui/                   # shadcn/ui 자동 생성 컴포넌트 — 직접 수정 금지
  theme/                # ThemeProvider, ThemeToggle
  common/               # 재사용 공통 컴포넌트 (page-header 등)

lib/
  notion.ts             # Notion API 클라이언트 — 서버 전용
  types.ts              # 블로그 도메인 타입 (Post, PostDetail, Category, NotionBlock)
  mock-data.ts          # 개발용 목업 데이터
  env.ts                # 환경 변수 스키마 (@t3-oss/env-nextjs + zod)
  utils.ts              # 공통 유틸 (cn 등)

types/
  index.ts              # 공통 인프라 타입 (NavItem, NavGroup, SiteConfig)

config/
  site.ts               # 사이트 메타데이터 설정
```

---

## 3. 코드 표준

### 파일·컴포넌트 네이밍

- React 컴포넌트 파일: `PascalCase.tsx`
- 유틸·훅·설정 파일: `kebab-case.ts`
- 클라이언트 컴포넌트는 파일 상단에 `"use client"` 선언 필수
- 서버 컴포넌트는 별도 선언 불필요 (Next.js 기본값)

### 타입 선언 위치

- 블로그 도메인 타입 → `lib/types.ts`에 추가
- 공통 인프라 타입 → `types/index.ts`에 추가
- 컴포넌트 props 타입은 해당 파일 내 인라인 선언 허용

### 스타일링

- Tailwind CSS 4.x 클래스 사용 (CSS 변수 기반)
- shadcn/ui 컴포넌트 우선 활용, 없으면 `components/features/` 또는 `components/common/`에 신규 생성
- `cn()` 유틸(`lib/utils.ts`)로 조건부 클래스 병합
- **절대 금지**: `components/ui/` 파일 직접 수정

---

## 4. Notion API 사용 규칙

### ⚠️ v5 Breaking Change — 가장 중요

- **`databases.query()` 사용 금지** — v5에서 제거됨
- **반드시 `dataSources.query({ data_source_id })` 사용**

```typescript
// ✅ 올바른 방법 (v5)
const response = await notion.dataSources.query({
  data_source_id: process.env.NOTION_DATABASE_ID,
  filter: { ... },
  sorts: [ ... ],
})

// ❌ 금지 (v4 이하 패턴)
const response = await notion.databases.query({ database_id: ... })
```

- `NOTION_DATABASE_ID`는 `data_source_id` 파라미터로 전달
- Notion API 응답 타입은 `@notionhq/client/build/src/api-endpoints/...` 경로에서 import

### Notion 클라이언트 사용 위치

- `lib/notion.ts`는 **서버 전용** — 클라이언트 컴포넌트에서 직접 import 금지
- 데이터 조회는 서버 컴포넌트 또는 Route Handler에서 수행
- 클라이언트 컴포넌트로 데이터 전달 시 props로 넘김

### 목업 폴백 패턴

- `NOTION_TOKEN` 또는 `NOTION_DATABASE_ID` 미설정 시 `lib/mock-data.ts`의 목업 데이터 반환
- 목업 데이터 사용 중일 때 UI에 경고 배너 표시 (`isMock` 플래그 활용)

### Notion DB 필드명 (대소문자 정확히 일치)

| 필드 | Notion 타입 | 값 예시 |
|------|------------|---------|
| `Title` | title | 글 제목 |
| `Category` | select | AI, 개발, 리뷰 |
| `Tags` | multi_select | 복수 태그 |
| `Published` | date | 발행일 |
| `Status` | select | `초안` / `발행됨` |

- 블로그 노출 조건: `Status = "발행됨"` 필터 반드시 적용

---

## 5. 환경 변수 관리

### 추가 규칙

- 신규 환경 변수는 반드시 `lib/env.ts`에 zod 스키마로 등록
- 서버 변수 → `server: {}` 블록, 클라이언트 노출 변수 → `client: {}` 블록
- `runtimeEnv` 블록에도 동일하게 매핑 추가
- `.env.example`에도 키 이름과 설명 주석 추가

```typescript
// lib/env.ts 추가 예시
server: {
  NOTION_TOKEN: z.string().min(1),
  NOTION_DATABASE_ID: z.string().min(1),
}
```

- **절대 금지**: `lib/env.ts` 외부에서 신규 `process.env.XXX` 직접 접근

---

## 6. 데이터 흐름

```
Notion DB
  ↓ (서버 전용)
lib/notion.ts
  ↓ props
서버 컴포넌트 (app/(marketing)/*/page.tsx)
  ↓ props
클라이언트 컴포넌트 (components/features/Post*Client.tsx)
```

- 서버 컴포넌트는 `async function` 사용하여 데이터 직접 조회
- 클라이언트 컴포넌트(`"use client"`)는 인터랙티브 UI만 담당

---

## 7. 라우트 규칙

### (marketing) 그룹

- 추가 공개 페이지는 `app/(marketing)/` 하위에 생성
- 레이아웃(`app/(marketing)/layout.tsx`)이 BlogHeader + SiteFooter 자동 포함
- 새 레이아웃 파일 필요 시 해당 그룹 내 `layout.tsx` 신규 생성

### (app) 그룹

- 인증이 필요한 페이지만 배치
- `app/(app)/layout.tsx`에 사이드바 레이아웃 포함

### API 라우트

- `app/api/[route]/route.ts` 형식
- Next.js App Router 규칙 준수: `GET`, `POST` 등 named export

---

## 8. 다중 파일 동시 수정 규칙

| 수정 대상 | 함께 수정해야 하는 파일 |
|----------|----------------------|
| 신규 환경 변수 추가 | `lib/env.ts` + `.env.example` |
| 신규 타입 추가 | `lib/types.ts` 또는 `types/index.ts` |
| 신규 Notion 조회 함수 | `lib/notion.ts` + 해당 서버 컴포넌트 |
| 신규 라우트 추가 | 해당 `page.tsx` + (필요 시) `config/site.ts` nav 업데이트 |
| shadcn 컴포넌트 추가 | `npx shadcn add <component>` 실행 → `components/ui/` 자동 생성 |

---

## 9. 금지 사항

- `components/ui/` 파일 직접 수정 금지 (shadcn 자동 생성)
- `lib/notion.ts`를 `"use client"` 컴포넌트에서 import 금지
- `notion.databases.query()` 사용 금지 (v5 제거됨)
- `process.env` 직접 접근 신규 추가 금지 (`lib/env.ts` 경유 필수)
- `app/(marketing)/layout.tsx`에서 BlogHeader·SiteFooter 제거 금지
- `lib/mock-data.ts`를 프로덕션 데이터 소스로 사용 금지

---

## 10. AI 의사결정 기준

- Notion 데이터 조회 코드 추가 → `lib/notion.ts`에만 작성
- 새 UI 컴포넌트 → shadcn에 있으면 `npx shadcn add`, 없으면 `components/features/` 또는 `components/common/`
- 타입 추가 → 블로그 도메인이면 `lib/types.ts`, 공통 인프라면 `types/index.ts`
- 환경 변수 접근 → `lib/env.ts`에 등록 후 `env.XXX`로 사용
- Next.js API가 불확실할 때 → `node_modules/next/dist/docs/` 확인 (`AGENTS.md` 지침)
