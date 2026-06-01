# PRD: 개인 연구 블로그 (Notion CMS)

**작성일:** 2026-05-13  
**최종 업데이트:** 2026-06-02 (MVP 배포 완료 — P1 요구사항 구체화)  
**상태:** MVP 완료 / P1 개발 예정  
**담당자:** JasonPark2020  
**프로덕션 URL:** https://notion-cms-blog-roan.vercel.app/

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | 개인 연구 블로그 |
| 목적 | Notion을 CMS로 활용한 개인 연구 블로그 |
| CMS 선택 이유 | Notion에서 글을 작성하면 별도 배포 없이 블로그에 자동 반영됨 |

### 핵심 가치 제안

- 글 작성 도구(Notion)와 발행 채널(블로그)을 통합하여 운영 부담 최소화
- 개발자가 아닌 사용자도 Notion 인터페이스만으로 콘텐츠 관리 가능
- 별도 데이터베이스 없이 Notion 자체가 단일 진실 공급원(Single Source of Truth)

---

## 2. 주요 기능

| # | 기능 | 설명 | 우선순위 | 상태 |
|---|------|------|---------|------|
| 1 | 글 목록 조회 | Notion 데이터베이스에서 발행된 글 목록 가져오기 | P0 | ✅ 완료 |
| 2 | 글 상세 페이지 | 개별 글의 본문 내용 표시 | P0 | ✅ 완료 |
| 3 | 카테고리별 필터링 | 카테고리를 선택하여 해당 글만 필터링 (홈 + 카테고리 페이지) | P0 | ✅ 완료 |
| 4 | ISR 캐싱 | Notion API Rate Limit 대응, 5분 주기 자동 갱신 | P0 | ✅ 완료 |
| 5 | 반응형 디자인 | 모바일(375px)·태블릿(768px)·데스크탑(1280px) 레이아웃 지원 | P0 | ✅ 완료 |
| 6 | 카테고리 목록 페이지 | `/categories` — 전체 카테고리 목록 + 포스트 수 표시 | P1 | 🔲 대기중 |
| 7 | 검색 기능 | 제목·태그 기반 클라이언트 사이드 글 검색 | P1 | 🔲 대기중 |

---

## 3. 기술 스택

| 구분 | 기술 | 버전 |
|------|------|------|
| Frontend | Next.js | 16.x |
| Language | TypeScript | 5.x |
| CMS | Notion API (`@notionhq/client`) | 최신 |
| Styling | Tailwind CSS | 4.x |
| UI 컴포넌트 | shadcn/ui | - |
| 아이콘 | Lucide React | 최신 |
| 배포 | Vercel | - |

> **참고:** 현재 프로젝트에 `@notionhq/client`는 미설치 상태이므로 구현 시작 전 설치 필요.

---

## 4. Notion 데이터베이스 구조

Notion에 아래 스키마의 데이터베이스를 생성하여 사용한다.

| 필드명 | Notion 타입 | 설명 |
|--------|------------|------|
| `Title` | `title` | 글 제목 |
| `Category` | `select` | 카테고리 (예: AI, 개발, 리뷰) |
| `Tags` | `multi_select` | 태그 (복수 선택 가능) |
| `Published` | `date` | 발행일 |
| `Status` | `select` | 상태: `초안` / `발행됨` |
| `Content` | (page content) | 글 본문 — Notion 페이지 블록으로 관리 |

> **조회 조건:** `Status = 발행됨`인 항목만 블로그에 노출한다.

---

## 5. 화면 구성 (페이지 / 라우트)

### 5.1 홈 `/`

- 최근 발행된 글 목록 표시 (최신순)
- 각 글 카드: 제목, 카테고리, 발행일, 태그 미리보기
- 카테고리 필터 탭 제공

### 5.2 글 상세 `/posts/[id]`

- Notion 페이지 블록을 렌더링하여 본문 표시
- 제목, 발행일, 카테고리, 태그 메타 정보 표시
- 이전 글 / 다음 글 내비게이션

### 5.3 카테고리 `/categories/[category]`

- 선택된 카테고리에 해당하는 글 목록 표시
- 홈과 동일한 글 카드 레이아웃 사용

### 5.4 카테고리 목록 `/categories` (P1)

- 전체 카테고리 목록 표시
- 각 카테고리 카드: 카테고리명 + 포스트 수
- 카드 클릭 시 `/categories/[category]` 이동
- 헤더 내비게이션에서 접근 가능

### 5.5 검색 (P1 — 홈 페이지 내 인라인)

- 홈 페이지 포스트 목록 상단에 검색 입력 필드
- 제목(title) + 태그(tags) 기반 클라이언트 사이드 필터링
- 카테고리 필터와 동시 적용 가능 (AND 조건)
- 검색 결과 없을 때 빈 상태 안내 메시지
- 300ms 디바운스 적용

---

## 6. 범위 정의

### MVP (완료 ✅)

| 기능 | 구현 완료 |
|------|----------|
| Notion API 연동 (글 목록 + 글 상세) | ✅ |
| 홈 페이지 — 글 목록 + 카테고리 필터 | ✅ |
| 글 상세 페이지 — Notion 블록 렌더링 | ✅ |
| 카테고리 페이지 — `/categories/[category]` | ✅ |
| ISR 캐싱 (5분) + On-demand Revalidation API | ✅ |
| 기본 스타일링 (Tailwind CSS v4 + shadcn/ui) | ✅ |
| 반응형 디자인 (375/768/1280px) | ✅ |
| Vercel 프로덕션 배포 | ✅ |

### P1 (다음 단계 — Phase 5)

| 기능 | Task | 설명 |
|------|------|------|
| 카테고리 목록 페이지 `/categories` | Task 009 | 전체 카테고리 + 포스트 수 표시, 헤더 내비 추가 |
| 클라이언트 사이드 검색 | Task 010 | 제목·태그 검색, 카테고리 필터 AND 결합, 300ms 디바운스 |

### P2 이후 고려 (MVP 제외 확정)

- 댓글 기능
- 소셜 공유 버튼
- RSS 피드
- 다크 모드 연동 (`next-themes` 이미 설치됨 — 낮은 비용으로 연동 가능)
- 이메일 뉴스레터 구독
- 다국어 지원
- OG 이미지 자동 생성 (`@vercel/og`)

---

## 7. 환경 변수

구현 시 아래 환경 변수를 `.env.local`에 추가한다.  
(`.env.example`에도 키 이름과 설명을 추가할 것)

```env
# Notion API 인증 토큰 (Integration Secret)
NOTION_TOKEN=secret_xxxxxxxxxxxx

# 블로그 글을 저장하는 Notion 데이터베이스 ID
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 8. 구현 단계 (로드맵)

- [ ] **1단계: 패키지 설치 및 환경 설정**
  - `@notionhq/client` 설치
  - `.env.local` 생성 및 `NOTION_TOKEN`, `NOTION_DATABASE_ID` 설정
  - `.env.example` 업데이트

- [ ] **2단계: Notion 데이터베이스 생성 및 API 키 발급**
  - Notion Integration 생성 후 API 키 발급
  - 데이터베이스에 Integration 연결
  - 테스트 데이터 입력

- [ ] **3단계: 글 목록 페이지 구현**
  - Notion API 클라이언트 유틸리티 작성 (`lib/notion.ts`)
  - 글 목록 조회 함수 구현 (`getPublishedPosts`)
  - 홈 페이지(`/`) 및 글 카드 컴포넌트 구현

- [ ] **4단계: 글 상세 페이지 구현**
  - 개별 글 조회 함수 구현 (`getPostById`)
  - Notion 블록 렌더러 구현
  - 글 상세 페이지(`/posts/[id]`) 구현

- [ ] **5단계: 스타일링 및 최적화**
  - 카테고리 필터 구현
  - 반응형 레이아웃 점검
  - ISR(Incremental Static Regeneration) 또는 On-demand Revalidation 적용
  - Vercel 배포

---

## 9. 참고 사항

- **Next.js Breaking Changes:** 이 프로젝트는 훈련 데이터와 다른 API·컨벤션을 가질 수 있다. 구현 전 `node_modules/next/dist/docs/` 내 가이드를 확인한다 (`AGENTS.md` 지침).
- **Notion API 제한:** 무료 플랜 기준 초당 3 요청. 글 목록 조회는 캐싱 전략을 반드시 적용한다.
- **Notion 블록 렌더링:** `@notionhq/client`는 블록 조회 API를 제공하지만, HTML 변환은 직접 구현하거나 `notion-to-md` 등의 서드파티 라이브러리를 활용한다.
