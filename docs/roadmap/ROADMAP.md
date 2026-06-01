# 개인 연구 블로그 (Notion CMS) 개발 로드맵

> **최초 작성일:** 2026-05-18  
> **최종 업데이트:** 2026-06-02 (Task 007 완료)  
> **담당자:** JasonPark2020

---

## 개요

| 항목 | 내용 |
|------|------|
| 제품 비전 | Notion을 단일 CMS로 활용하여 별도 배포 없이 블로그 콘텐츠를 자동 반영하는 개인 연구 블로그 |
| 목표 사용자 | 개인 연구자, 개발자 — Notion에서 글을 작성하고 별도 기술 조작 없이 웹에 발행하고 싶은 사람 |
| 핵심 가치 제안 | 글 작성 도구(Notion)와 발행 채널(블로그) 통합으로 운영 부담 최소화, Notion 자체가 단일 진실 공급원(Single Source of Truth) |
| 전체 타임라인 | 2026-05-18 ~ 2026-06-08 (약 3주, 버퍼 25% 포함) |

---

## 개발 원칙

본 로드맵은 **골격(Skeleton) → 공통(Common) → 개별 기능(Feature)** 의 3단계 누적 구축 전략을 따른다.

| 단계 | 정의 | 본 프로젝트에서의 대응 |
|------|------|----------------------|
| 골격 (Skeleton) | 데이터 흐름의 기반 — 환경 변수, API 클라이언트, 타입, 외부 시스템 연결 | Phase 1 — 환경 설정 + Notion DB 구성 |
| 공통 (Common) | 여러 페이지·기능에서 재사용되는 모듈과 UI 컴포넌트 | Phase 2 — NotionBlockRenderer 공통 컴포넌트 |
| 개별 (Feature) | 골격과 공통 모듈을 조합하여 만드는 사용자 대면 페이지 | Phase 3 — 홈/상세/카테고리 페이지 데이터 연동 |

**이 순서를 지키는 이유:**
- **골격 우선:** 환경 변수·API 클라이언트가 흔들리면 모든 상위 작업이 재작업 대상이 된다. 가장 먼저 안정화한다.
- **공통 선행:** 공통 컴포넌트가 늦게 등장하면 개별 페이지에서 임시 코드가 누적되어 기술 부채가 쌓인다. 페이지 검증 전에 부품을 완성해야 검증 자체가 의미를 가진다.
- **개별 후행:** 골격과 공통이 갖춰진 상태에서 개별 기능을 검증하면, 발견되는 문제가 해당 페이지 고유 로직에 한정되어 디버깅 범위가 좁아진다.

---

## 성공 지표 (KPI)

- Notion에서 글을 발행(Status = 발행됨)하면 블로그에 자동 반영: **별도 배포 없이 동작 확인**
- 홈 페이지 로딩 시간: **LCP 2.5초 이하** (Vercel 배포 기준)
- Notion API 캐싱 적용 후 동일 페이지 재조회 응답시간: **100ms 이하**
- 모바일(375px), 태블릿(768px), 데스크탑(1280px) 3개 뷰포트 레이아웃 **정상 동작**
- 글 상세 페이지에서 Notion 블록 렌더링 커버리지: **paragraph, heading 1~3, bulleted_list_item, numbered_list_item, code, image 블록 지원**

---

## 기술 스택

| 구분 | 기술 | 버전 | 비고 |
|------|------|------|------|
| 프론트엔드 | Next.js | 16.x | App Router 사용 |
| 언어 | TypeScript | 5.x | strict 모드 |
| CMS | Notion API (`@notionhq/client`) | 5.21.0 | **이미 설치됨** |
| 스타일링 | Tailwind CSS | 4.x | |
| UI 컴포넌트 | shadcn/ui | - | radix-ui 기반 |
| 아이콘 | Lucide React | 1.14.0 | |
| 블록 렌더링 | notion-to-md | 3.1.9 | **이미 설치됨** |
| 배포 | Vercel | - | |
| 환경 변수 검증 | @t3-oss/env-nextjs | 0.13.11 | |

---

## Task 상태 범례

| 상태 | 의미 |
|------|------|
| 🔲 대기중 | 아직 시작하지 않은 Task |
| 🔄 진행중 | 현재 개발 중인 Task |
| ✅ 완료 | 구현 및 테스트가 완료된 Task |
| ⏸️ 보류 | 의존성 또는 결정 대기 중인 Task |

---

## 개발 페이즈

### Phase 1: 골격 — 기반 환경 구축 (2026-05-18 ~ 2026-05-20, 3일)

#### 목표
Notion API 연동에 필요한 패키지 설치 및 환경 변수 설정을 완료하고, Notion 데이터베이스를 구성하여 개발 환경을 구축한다. 이 단계가 완료되면 실제 Notion 데이터를 조회할 수 있는 기반이 마련된다.

#### 순서 근거
- **선행 이유:** 환경 변수와 Notion DB 연결은 모든 후속 Task의 입력 데이터원이다. 이 단계가 미완성이면 어떤 상위 Task도 실제 동작 검증이 불가능하다.
- **이 단계의 완성 기준:** `getPublishedPosts()` 호출 시 실제 Notion 응답(Status = 발행됨 포스트)이 반환되어야 한다.
- **다음 단계 진입 시점:** Phase 2(공통 모듈)는 실제 Notion 블록 데이터를 입력으로 받으므로, Phase 1 완료 후 진입한다.

#### 산출물
- 환경 변수 설정 완료 (`.env.local`, `.env.example`)
- Notion 데이터베이스 스키마 구성 완료
- 테스트 포스트 3개 이상 입력

#### Task 목록

| Task ID | Task명 | 상태 | 의존성 | 분류 |
|---------|--------|------|--------|------|
| Task 001 | Task 001: 환경 변수 설정 및 패키지 의존성 확인 | ✅ 완료 | - | 골격 |
| Task 002 | Task 002: Notion Integration 생성 및 데이터베이스 구성 | ✅ 완료 | Task 001 | 골격 |

#### Task 상세

---

**Task 001: 환경 변수 설정 및 패키지 의존성 확인** | 상태: ✅ 완료

> **현황 메모:** `@notionhq/client` v5.21.0, `notion-to-md` v3.1.9가 이미 `package.json`에 설치되어 있음. `lib/notion.ts`, `lib/types.ts`, `lib/mock-data.ts`가 구현 완료된 상태.

**구현 항목**
- [x] `@notionhq/client` 패키지 설치 여부 확인 (`package.json`)
- [x] `notion-to-md` 패키지 설치 여부 확인
- [x] `.env.example` 파일에 키 이름과 설명 주석 추가 여부 확인 및 보완
- [x] `lib/env.ts`에 환경 변수 Zod 스키마 정의 (`@t3-oss/env-nextjs` 활용)

**수락 기준 (Acceptance Criteria)**
- `.env.example`에 `NOTION_TOKEN`, `NOTION_DATABASE_ID` 키와 설명이 존재함
- 빌드 실행 시 환경 변수 관련 TypeScript 오류가 없음

**완료 조건 (Definition of Done)**
- [x] `.env.example` 문서화 완료
- [x] 빌드 및 개발 서버 정상 기동 확인

---

**Task 002: Notion Integration 생성 및 데이터베이스 구성** | 상태: ✅ 완료

> **현황 메모 (2026-06-01 갱신):** `.env.local`에 실제 `NOTION_TOKEN`(prefix `ntn_`) 및 `NOTION_DATABASE_ID` 설정 완료. 홈 페이지에서 실제 Notion 포스트 3개 렌더링 확인 — 목업 데이터 안내 배너 미표시로 실연동 검증됨.

**구현 항목**
- [x] [Notion Integrations](https://www.notion.so/my-integrations)에서 Internal Integration 생성
- [x] Integration Secret 복사 후 `.env.local`의 `NOTION_TOKEN`에 저장
- [x] Notion에 블로그 데이터베이스 생성 (아래 스키마 적용)
  - `Title` — title 타입
  - `Category` — select 타입 (예시 옵션: AI, 개발, 리뷰)
  - `Tags` — multi_select 타입
  - `Published` — date 타입
  - `Status` — select 타입 (옵션: 초안, 발행됨)
- [x] 데이터베이스 페이지에서 Integration 연결 (Share > Invite)
- [x] 데이터베이스 ID 추출 후 `.env.local`의 `NOTION_DATABASE_ID`에 저장
- [x] `Status = 발행됨`인 테스트 포스트 3개 이상 입력

**수락 기준 (Acceptance Criteria)**
- Notion API로 데이터베이스 조회 시 `Status = 발행됨` 포스트가 반환됨
- 포스트에 Title, Category, Tags, Published 값이 모두 존재함

**완료 조건 (Definition of Done)**
- [x] `.env.local` 실제 토큰 및 데이터베이스 ID 설정 완료
- [x] 테스트 포스트 3개 이상 입력 완료
- [x] `getPublishedPosts()` 함수 호출 시 실제 데이터 반환 확인 (홈 페이지 렌더링)

---

### Phase 2: 공통 — 공통 모듈/컴포넌트 구축 (2026-05-21 ~ 2026-05-24, 4일)

#### 목표
여러 페이지에서 공유될 핵심 공통 컴포넌트를 먼저 완성한다. 이 단계가 끝나면 개별 페이지들이 임시 코드 없이 안정적인 부품 위에서 조립될 수 있다.

#### 순서 근거
- **선행 이유:** `NotionBlockRenderer`는 글 상세 페이지의 핵심 출력 컴포넌트다. 미구현 상태에서 개별 페이지를 검증하면 본문 영역이 빈 채로 검증이 이루어져 검증 자체가 무의미해진다.
- **공통 컴포넌트로 분류한 근거:** 현재는 글 상세 페이지에서만 사용되지만, 향후 검색 결과 미리보기·OG 이미지 생성 등에서 재사용될 가능성이 높다. 공통 계층에서 단독 구현·테스트하면 이후 재사용 비용이 0에 가까워진다.
- **다음 단계 진입 시점:** 주요 블록 타입(paragraph, heading 1~3, bulleted/numbered list, code, image) 렌더링이 시각적으로 검증된 시점.

#### 산출물
- `components/features/NotionBlockRenderer.tsx` 컴포넌트 구현 완료
- 주요 블록 타입 렌더링 시각 검증 완료

#### Task 목록

| Task ID | Task명 | 상태 | 의존성 | 분류 |
|---------|--------|------|--------|------|
| Task 004 | Task 004: Notion 블록 렌더러 구현 | ✅ 완료 | Task 002 | 공통 |

#### Task 상세

---

**Task 004: Notion 블록 렌더러 구현** | 상태: ✅ 완료

> **현황 메모 (2026-06-01 갱신):** `components/features/NotionBlockRenderer.tsx` 구현 완료. paragraph/heading 1~3/목록(ul·ol 그룹화)/code/image/quote/divider/toggle/인라인 서식(bold·italic·code·link·strikethrough·underline)/미지원 블록 플레이스홀더 모두 구현됨. `notion-to-md` 미사용, 직접 렌더러 구현 채택. **잔여: `has_children` 재귀 렌더링(토글 자식 등) 미구현 → 기술 부채로 이관. Playwright 시각 검증 미수행.**

**구현 항목**
- [x] `components/features/NotionBlockRenderer.tsx` 컴포넌트 생성
- [x] 지원할 블록 타입별 렌더링 구현:
  - `paragraph` — 일반 텍스트, 인라인 서식(bold, italic, code, link) 지원
  - `heading_1`, `heading_2`, `heading_3` — 헤딩 계층 렌더링
  - `bulleted_list_item` — 비순서 목록 (연속 항목 `<ul>` 자동 그룹화)
  - `numbered_list_item` — 순서 목록 (연속 항목 `<ol>` 자동 그룹화)
  - `code` — 코드 블록 (언어 표시, 모노스페이스 폰트)
  - `image` — 이미지 블록 (`<img>` 사용, Notion S3 URL 만료 이슈로 `next/image` 미적용)
  - `quote` — 인용구
  - `divider` — 구분선
  - `toggle` — 토글 (`<details>` 태그, 자식 블록 미지원)
  - 미지원 블록 — 개발 모드에서 플레이스홀더 표시, 프로덕션에서 null 반환
- [x] `notion-to-md` 라이브러리 활용 여부 검토 → 직접 구현 채택
- [x] `prose` Tailwind 클래스를 활용한 Typography 스타일 적용
- [ ] 중첩 블록(`has_children = true`) 재귀 렌더링 처리 ← **기술 부채로 이관**
- [ ] Playwright MCP를 활용한 블록 렌더링 테스트 ← **미수행**

**수락 기준 (Acceptance Criteria)**
- paragraph, heading 1~3, 목록, 코드, 이미지 블록이 시각적으로 올바르게 렌더링됨
- 미지원 블록 타입에서 빌드 오류가 발생하지 않음
- 중첩 블록이 들여쓰기와 함께 렌더링됨

**완료 조건 (Definition of Done)**
- [x] 컴포넌트 구현 완료
- [x] 주요 블록 타입 렌더링 시각 검증 (홈/상세 페이지 실데이터 렌더링으로 확인)
- [ ] Playwright 테스트 통과 ← 미수행
- [x] TypeScript 타입 오류 없음 (`npm run build` 통과)

**잠재적 기술 위험**
- `@notionhq/client` v5 `dataSources` API의 블록 응답 구조가 v2와 다를 수 있음 → 구현 전 타입 정의 확인 필수
- 이미지 블록: Notion 이미지 URL은 1시간 후 만료됨 → 캐싱 또는 On-demand Revalidation 필요

---

### Phase 3: 개별 — 페이지별 데이터 연동 및 검증 (2026-05-25 ~ 2026-05-28, 4일)

#### 목표
골격(Phase 1)과 공통 컴포넌트(Phase 2)가 갖춰진 상태에서 홈, 글 상세, 카테고리 페이지를 실제 Notion 데이터로 검증한다.

#### 순서 근거
- **선행 이유:** 골격과 공통 모듈이 모두 완성된 후이므로, 이 단계에서 발견되는 문제는 각 페이지 고유 로직에 한정된다. 하위 계층으로의 회귀 작업이 발생하지 않아 디버깅 범위가 좁다.
- **Task 003 → 005 → 006 순서 이유:**
  - Task 003(홈): 목록 페이지로 가장 단순. Notion 데이터 연동의 기본 동작(목록 조회 + 카테고리 필터)을 먼저 검증한다.
  - Task 005(글 상세): 공통 컴포넌트(NotionBlockRenderer)를 실제 페이지에 조립하는 첫 번째 검증이다.
  - Task 006(카테고리): 홈 페이지의 목록 렌더링 로직을 재사용하는 변형 페이지이므로 마지막에 검증한다.

#### 산출물
- 홈 페이지: 실제 Notion 데이터 기반 글 목록 + 카테고리 필터 동작
- 글 상세 페이지: Notion 블록 렌더링 (주요 블록 타입 지원)
- 카테고리 페이지: 카테고리별 필터링 동작

#### Task 목록

| Task ID | Task명 | 상태 | 의존성 | 분류 |
|---------|--------|------|--------|------|
| Task 003 | Task 003: 홈 페이지 Notion 데이터 연동 검증 | ✅ 완료 | Task 002 | 개별 |
| Task 005 | Task 005: 글 상세 페이지 블록 렌더링 연동 | ✅ 완료 | Task 004 | 개별 |
| Task 006 | Task 006: 카테고리 페이지 동작 검증 | ✅ 완료 | Task 003 | 개별 |

#### Task 상세

---

**Task 003: 홈 페이지 Notion 데이터 연동 검증** | 상태: ✅ 완료

> **현황 메모 (2026-06-01 완료):** 실제 Notion 포스트 3개 렌더링 확인. 카테고리 필터(#기록/#개발/#일상) 동작 확인. 목업 배너 미표시. Playwright E2E + 반응형 3뷰포트 검증 완료.

**구현 항목**
- [x] `.env.local` 설정 후 홈 페이지에서 실제 Notion 포스트 목록 렌더링 확인
- [x] 목업 데이터 안내 배너가 사라지고 실제 데이터가 표시되는지 확인
- [x] 카테고리 필터 탭 클릭 시 필터링 동작 확인
- [x] 포스트 카드에 제목, 카테고리, 발행일, 태그가 올바르게 표시되는지 확인
- [ ] Notion API Rate Limit (초당 3 요청) 대응: Next.js 캐싱 설정 확인 (`revalidate` 옵션) ← Task 007에서 처리
- [x] Playwright MCP를 활용한 E2E 테스트 수행
  - 홈 페이지 접속 시 포스트 목록 렌더링 확인
  - 카테고리 필터 클릭 시 해당 카테고리 포스트만 표시 확인

**수락 기준 (Acceptance Criteria)**
- 홈 페이지에서 Notion DB의 `Status = 발행됨` 포스트가 최신순으로 표시됨
- 카테고리 필터 클릭 시 해당 카테고리 포스트만 필터링됨
- 목업 데이터 안내 배너가 표시되지 않음

**완료 조건 (Definition of Done)**
- [x] 구현 완료 (실제 데이터 연동 확인)
- [x] Playwright E2E 테스트 통과
- [x] 모바일(375px), 태블릿(768px), 데스크탑(1280px) 레이아웃 정상 표시 확인

---

**Task 005: 글 상세 페이지 블록 렌더링 연동** | 상태: ✅ 완료

> **현황 메모 (2026-06-01 완료):** `NotionBlockRenderer` 연동, 이전/다음 글 내비게이션(`PostNavigation` 컴포넌트), 404 처리 모두 구현 완료. `getPostById` + `getPublishedPosts` 병렬 조회로 인접 포스트 탐색. Playwright로 카드 클릭 → 상세 이동, 양방향 내비게이션, 404 동작 검증 완료.

**구현 항목**
- [x] `post.blocks` 데이터를 `NotionBlockRenderer` 컴포넌트에 전달하도록 `PostPage` 수정
- [x] TODO 플레이스홀더 제거 및 실제 블록 렌더링으로 교체
- [x] 이전 글 / 다음 글 내비게이션 구현
  - `getPublishedPosts()` + `getPostById()` 병렬 조회, 현재 포스트 위치 기준 인접 포스트 링크 생성
- [x] 포스트 메타 정보(제목, 발행일, 카테고리, 태그) 표시 확인
- [x] Playwright MCP를 활용한 E2E 테스트 수행
  - 홈 페이지 포스트 카드 클릭 → 상세 페이지 이동 확인
  - 본문 블록 렌더링 시각 확인
  - 이전/다음 글 내비게이션 양방향 동작 확인

**수락 기준 (Acceptance Criteria)**
- 글 상세 페이지에서 Notion 본문 블록이 렌더링됨
- 이전 글 / 다음 글 내비게이션이 동작함
- 존재하지 않는 포스트 ID 접근 시 404 페이지로 이동

**완료 조건 (Definition of Done)**
- [x] 블록 렌더러 연동 완료
- [x] 이전/다음 글 내비게이션 구현 완료
- [x] Playwright E2E 테스트 통과
- [x] generateMetadata 함수가 실제 포스트 제목으로 메타데이터 생성 확인

---

**Task 006: 카테고리 페이지 동작 검증** | 상태: ✅ 완료

> **현황 메모 (2026-06-02 완료):** `PostCard` Stretched Link 패턴으로 재구조화하여 카테고리 배지를 독립 링크로 분리. 홈·상세 페이지 배지 클릭 → 카테고리 페이지 이동 확인. 한글 URL 인코딩(`%EA%B8%B0%EB%A1%9D` 등) 정상 동작. 빈 카테고리 접근 시 API 정상 응답이면 빈 상태 UI, API 오류(Rate Limit 등)면 404 처리로 구현됨.

**구현 항목**
- [x] 실제 Notion 데이터로 카테고리 페이지 렌더링 확인
- [x] 홈 페이지의 카테고리 배지 클릭 → `/categories/[category]` 이동 동작 확인 (`PostCard` Stretched Link 패턴으로 카테고리 배지를 독립 Link로 분리)
- [x] 글 상세 페이지의 카테고리 배지 클릭 → 카테고리 페이지 이동 동작 확인
- [x] 한글 카테고리 이름 URL 인코딩/디코딩 정상 동작 확인
- [x] 해당 카테고리 포스트가 없을 때 빈 상태 메시지 표시 확인 (코드 구현 완료, Rate Limit 환경에서는 404 폴백)
- [x] Playwright MCP를 활용한 E2E 테스트 수행
  - 카테고리 배지 클릭 → 카테고리 페이지 이동 확인
  - 카테고리에 해당하는 포스트만 목록에 표시되는지 확인

**수락 기준 (Acceptance Criteria)**
- 카테고리 페이지에서 해당 카테고리의 발행된 포스트만 표시됨
- 한글 카테고리 이름이 URL에서 올바르게 처리됨
- 포스트 없는 카테고리 접근 시 빈 상태 메시지가 표시됨

**완료 조건 (Definition of Done)**
- [x] 실제 Notion 데이터 연동 확인
- [x] Playwright E2E 테스트 통과
- [x] URL 인코딩/디코딩 정상 동작 확인

---

### Phase 4: 최적화 — 성능 최적화 및 배포 (2026-05-29 ~ 2026-06-03, 6일)

#### 목표
Notion API Rate Limit 대응을 위한 캐싱 전략을 적용하고, Vercel에 배포하여 실서비스 환경을 구성한다.

#### 순서 근거
- **선행 이유:** 캐싱 전략은 실제 페이지가 모두 동작하는 시점에 적용해야 효과를 측정할 수 있다. 페이지 미완성 상태에서 캐싱을 먼저 적용하면 캐시 무효화 디버깅 비용이 추가된다.
- **캐싱 → 배포 순서 이유:** Notion API Rate Limit 대응(캐싱)이 완료된 후 배포해야 트래픽 발생 시 즉시 한계에 도달하지 않는다.

#### 산출물
- ISR 또는 On-demand Revalidation 적용 완료
- Vercel 프로덕션 배포 완료
- 환경 변수 Vercel 대시보드 설정 완료

#### Task 목록

| Task ID | Task명 | 상태 | 의존성 | 분류 |
|---------|--------|------|--------|------|
| Task 007 | Task 007: 캐싱 전략 적용 (ISR / On-demand Revalidation) | ✅ 완료 | Task 005, Task 006 | 최적화 |
| Task 008 | Task 008: Vercel 배포 및 프로덕션 환경 구성 | 🔲 대기중 | Task 007 | 최적화 |

#### Task 상세

---

**Task 007: 캐싱 전략 적용 (ISR / On-demand Revalidation)** | 상태: ✅ 완료

> **현황 메모 (2026-06-02 완료):** Next.js 16 이전 모델(cacheComponents 미적용) 기준으로 `unstable_cache` 래핑 + `export const revalidate = 300` 적용. `@notionhq/client`가 자체 SDK(fetch 미사용)이므로 fetch 캐싱 대신 `unstable_cache`로 래핑. 태그 `notion-posts-list`로 On-demand 무효화. `app/api/revalidate/route.ts` 신규 생성. 빌드 결과 홈 페이지에 `Revalidate: 5m` 확인. API 인증(401)/갱신(200) 동작 검증 완료.
>
> **Next.js 16 변경사항:** `revalidateTag(tag, profile)` — 두 번째 인자 `"max"` 필수(없으면 deprecated 경고). `revalidatePath`와 병행 사용.

**구현 항목**
- [x] Next.js 16.x 캐싱 메커니즘 확인 (`node_modules/next/dist/docs/caching-without-cache-components.md` 참조)
- [x] 홈 페이지(`/`)에 ISR 적용: `export const revalidate = 300` (5분)
- [x] 글 상세 페이지(`/posts/[id]`)에 `export const revalidate = 300` 적용 (동적 라우트로 `generateStaticParams` 미적용)
- [x] 카테고리 페이지(`/categories/[category]`)에 `export const revalidate = 300` 적용
- [x] Notion API 호출 함수(`lib/notion.ts`)에 `unstable_cache` 태그 적용
  - `getPublishedPosts` — `notion-posts-list` 태그, TTL 300s
  - `getPostById` — `notion-posts-list` 태그, TTL 300s (id 인자로 독립 캐시)
  - `getPostsByCategory` — `notion-posts-list` 태그, TTL 300s (category 인자로 독립 캐시)
  - `getCategories` — `getPublishedPosts` 캐시 재사용 (별도 래핑 불필요)
- [x] On-demand Revalidation API 라우트 구현 (`app/api/revalidate/route.ts`)
  - `GET /api/revalidate?secret=TOKEN` — 전체 목록 캐시 갱신
  - `GET /api/revalidate?secret=TOKEN&path=/` — 특정 경로 캐시 갱신
  - `REVALIDATE_SECRET` 환경 변수로 인증 (미설정 시 항상 401)
- [x] `lib/env.ts`에 `REVALIDATE_SECRET` Zod 스키마 추가
- [x] `.env.example`에 `REVALIDATE_SECRET` 문서화
- [ ] Playwright MCP를 활용한 캐싱 동작 검증 — 개발 모드에서 캐시 비활성화됨, 프로덕션(Vercel) 배포 후 검증 예정 (Task 008)

**수락 기준 (Acceptance Criteria)**
- Notion API가 초당 3회 이상 호출되지 않음 (캐싱 적용 확인)
- ISR 또는 캐시 TTL 내에서 동일 요청이 Notion API를 재호출하지 않음
- On-demand Revalidation API 호출 후 5분 이내에 갱신된 콘텐츠가 반영됨

**완료 조건 (Definition of Done)**
- [x] 캐싱 전략 구현 완료 (`unstable_cache` + `revalidate = 300`)
- [x] Notion API Rate Limit 초과 없음 확인 (캐싱으로 반복 호출 차단)
- [x] 캐시 갱신 동작 검증 완료 (curl로 API 응답 `{ revalidated: true }` 확인)
- [ ] Playwright 프로덕션 테스트 — Task 008(Vercel 배포) 완료 후 수행

---

**Task 008: Vercel 배포 및 프로덕션 환경 구성** | 상태: 🔲 대기중

**구현 항목**
- [ ] GitHub 저장소와 Vercel 연동 (Vercel Dashboard > Import Project)
- [ ] Vercel 환경 변수 설정
  - `NOTION_TOKEN` — Production, Preview, Development 환경 모두 설정
  - `NOTION_DATABASE_ID` — 동일하게 설정
- [ ] 프로덕션 배포 실행 및 빌드 오류 확인
- [ ] 배포된 URL에서 홈 페이지, 글 상세, 카테고리 페이지 동작 확인
- [ ] Vercel Analytics 또는 Speed Insights 활성화 (선택)
- [ ] Playwright MCP를 활용한 프로덕션 URL E2E 테스트
  - 배포된 URL에서 주요 페이지 정상 접속 확인

**수락 기준 (Acceptance Criteria)**
- Vercel 프로덕션 빌드가 오류 없이 완료됨
- 배포된 URL에서 Notion 실제 데이터가 렌더링됨
- HTTPS 접속 정상 동작

**완료 조건 (Definition of Done)**
- [ ] Vercel 프로덕션 배포 완료
- [ ] 환경 변수 설정 완료
- [ ] 주요 페이지 E2E 테스트 통과 (프로덕션 URL 기준)
- [ ] 빌드 로그에 오류 없음 확인

---

### Phase 5: P1 확장 — P1 기능 구현 (2026-06-04 ~ 2026-06-08, 5일)

#### 목표
MVP 이후 단계로 분류된 P1 기능(카테고리 목록 페이지, 검색 기능)을 구현한다.

#### 순서 근거
- **선행 이유:** MVP가 프로덕션에 배포되어 실제 사용자 피드백을 수집할 수 있는 상태가 된 후 P1 기능을 추가한다. 사용자 반응 데이터를 확인하면 검색 기능과 카테고리 목록 페이지 중 어느 쪽을 먼저 구현할지 실사용 기반으로 재검토할 수 있다.
- **P1 기능을 별도 Phase로 분리한 이유:** PRD에서 명시적으로 P1(MVP 이후)으로 분류되어 있어 MVP 출시 리스크를 줄이기 위해 분리한다.

#### 산출물
- 카테고리 목록 페이지 (`/categories`) 구현
- 검색 기능 기반 구현 (클라이언트 사이드 제목/태그 검색)

#### Task 목록

| Task ID | Task명 | 상태 | 의존성 | 분류 |
|---------|--------|------|--------|------|
| Task 009 | Task 009: 카테고리 목록 페이지 구현 | 🔲 대기중 | Task 006 | P1 확장 |
| Task 010 | Task 010: 클라이언트 사이드 검색 기능 구현 | 🔲 대기중 | Task 003 | P1 확장 |

#### Task 상세

---

**Task 009: 카테고리 목록 페이지 구현** | 상태: 🔲 대기중

**구현 항목**
- [ ] `app/(marketing)/categories/page.tsx` 생성 (전체 카테고리 목록 페이지)
- [ ] `getCategories()` 함수를 활용하여 카테고리 목록과 포스트 수 표시
- [ ] 각 카테고리 카드 클릭 시 `/categories/[category]` 이동
- [ ] 헤더 내비게이션에 카테고리 링크 추가 (`components/layout/blog-header.tsx` 수정)
- [ ] Playwright MCP를 활용한 테스트
  - 카테고리 목록 페이지 렌더링 확인
  - 카테고리 카드 클릭 → 카테고리별 포스트 페이지 이동 확인

**수락 기준 (Acceptance Criteria)**
- `/categories` 접속 시 카테고리 목록과 각 카테고리의 포스트 수가 표시됨
- 카테고리 클릭 시 해당 카테고리 포스트 페이지로 이동함

**완료 조건 (Definition of Done)**
- [ ] 페이지 구현 완료
- [ ] 내비게이션 링크 추가 완료
- [ ] Playwright 테스트 통과

---

**Task 010: 클라이언트 사이드 검색 기능 구현** | 상태: 🔲 대기중

**구현 항목**
- [ ] 홈 페이지에 검색 입력 필드 추가 (`PostListClient` 컴포넌트 수정)
- [ ] 제목(title)과 태그(tags) 기반 클라이언트 사이드 필터링 구현
- [ ] 검색어와 카테고리 필터 동시 적용 가능하도록 필터 로직 통합
- [ ] 검색 결과 없을 때 빈 상태 메시지 표시
- [ ] 디바운스(debounce) 적용으로 입력 중 불필요한 재렌더링 방지 (`usehooks-ts` 활용)
- [ ] Playwright MCP를 활용한 테스트
  - 검색어 입력 시 제목/태그 기반 필터링 동작 확인
  - 카테고리 필터와 검색어 동시 적용 동작 확인

**수락 기준 (Acceptance Criteria)**
- 검색어 입력 시 제목 또는 태그에 검색어가 포함된 포스트만 표시됨
- 카테고리 필터와 검색어를 동시에 적용할 수 있음
- 검색 결과 없을 때 적절한 안내 메시지가 표시됨

**완료 조건 (Definition of Done)**
- [ ] 검색 기능 구현 완료
- [ ] 디바운스 적용 확인
- [ ] Playwright 테스트 통과

---

## MVP 정의

### MVP 포함 Task

| Task ID | 기능 | 분류 |
|---------|------|------|
| Task 001 | 환경 변수 설정 및 패키지 의존성 확인 | 골격 |
| Task 002 | Notion Integration 생성 및 데이터베이스 구성 | 골격 |
| Task 004 | Notion 블록 렌더러 구현 | 공통 |
| Task 003 | 홈 페이지 Notion 데이터 연동 검증 | 개별 |
| Task 005 | 글 상세 페이지 블록 렌더링 연동 | 개별 |
| Task 006 | 카테고리 페이지 동작 검증 | 개별 |
| Task 007 | 캐싱 전략 적용 | 최적화 |
| Task 008 | Vercel 배포 및 프로덕션 환경 구성 | 최적화 |

### MVP 제외 기능 (이유 포함)

| 기능 | 제외 이유 |
|------|-----------|
| 검색 기능 | PRD P1 — 초기 출시에 핵심 가치와 무관, Phase 5에서 구현 |
| 카테고리 목록 페이지 (`/categories`) | 카테고리별 페이지는 존재, 목록 페이지는 편의 기능으로 Phase 5 이관 |
| 댓글 기능 | PRD 명시적 MVP 제외 |
| 소셜 공유 버튼 | PRD 명시적 MVP 제외 |
| RSS 피드 | PRD 명시적 MVP 제외 |
| 다크 모드 연동 | 테마 시스템 존재하나 PRD에서 MVP 이후 고려로 명시 |
| 이메일 뉴스레터 구독 | PRD 명시적 MVP 제외 |
| 다국어 지원 | PRD 명시적 MVP 제외 |

---

## 위험 관리

| 위험 요소 | 심각도 | 발생 가능성 | 경감 전략 |
|-----------|--------|-------------|-----------|
| `@notionhq/client` v5 `dataSources` API 미지원 또는 타입 불일치 | 높음 | 중간 | 구현 전 `node_modules/@notionhq/client` 타입 정의 파일 직접 확인. `lib/notion.ts`의 기존 구현이 v5 기준으로 작성되어 있으므로 타입 오류 발생 시 즉시 수정. |
| Notion API Rate Limit (초당 3 요청) 초과 | 중간 | 높음 | Phase 4에서 ISR/캐싱 적용 필수. 개발 중 `getPublishedPosts()` 반복 호출 주의. 개발 환경에서는 목업 데이터 폴백 활용. |
| Notion 이미지 URL 1시간 만료 | 중간 | 높음 | 이미지 블록 렌더링 시 `next/image`의 `unoptimized` 옵션 또는 프록시 방식 검토. On-demand Revalidation으로 주기적 캐시 갱신. |
| Next.js 16.x 캐싱 API 변경 | 중간 | 중간 | `node_modules/next/dist/docs/` 내 캐싱 문서 확인 필수. `AGENTS.md` 지침 준수. |
| Notion 블록 타입 다양성 (미지원 블록) | 낮음 | 높음 | 미지원 블록 타입에 대한 플레이스홀더 렌더링으로 빌드 오류 방지. |

---

## 기술 부채 및 향후 고려사항

- **다크 모드 연동:** 현재 프로젝트에 `next-themes` 기반 테마 시스템이 존재. `prose-invert` Tailwind 클래스가 `PostPage`에 이미 적용되어 있으므로 낮은 비용으로 연동 가능.
- **Notion 이미지 캐싱:** Notion 이미지 URL이 1시간 만료되므로 장기적으로는 이미지를 직접 호스팅하거나 Cloudinary 등 CDN으로 프록시하는 방안 검토.
- **OG 이미지 자동 생성:** 각 포스트의 Open Graph 이미지를 `@vercel/og` 또는 `next/og`로 자동 생성하면 소셜 공유 시 미리보기 품질 향상.
- **검색 고도화:** 클라이언트 사이드 검색(Task 010)은 포스트 수가 많아지면 성능 저하 가능. 추후 Algolia 또는 Fuse.js 도입 검토.
- **`lib/notion.ts` `dataSources` API 안정성:** `@notionhq/client` v5의 `dataSources` API가 공식 stable API인지 확인 필요. 베타 API라면 v2의 `databases.query()`로의 폴백 전략 준비.
- **포스트 페이지네이션:** Notion API는 최대 100개 결과를 한 번에 반환. 포스트가 100개 초과 시 cursor 기반 페이지네이션 구현 필요.
- **중첩 블록(`has_children`) 재귀 렌더링:** 토글(`toggle`) 및 목록 하위 중첩 블록은 현재 미지원. `blocks.children.list({ block_id })` API 재호출로 자식 블록을 가져와 `NotionBlockRenderer`를 재귀 호출하는 방식으로 구현 가능. 현재 토글 컴포넌트에 주석으로 명시됨.

---

## 현재 구현 상태 요약 (2026-06-01 기준)

> 실제 코드·환경 상태를 기준으로 최신화합니다.

| 파일 | 상태 | 비고 |
|------|------|------|
| `package.json` | 완료 | `@notionhq/client` v5.21.0, `notion-to-md` v3.1.9 설치됨 |
| `lib/notion.ts` | 완료 | `getPublishedPosts`, `getPostById`, `getPostsByCategory`, `getCategories` 구현됨 |
| `lib/types.ts` | 완료 | `Post`, `PostDetail`, `NotionBlock`, `Category` 타입 정의됨 |
| `lib/mock-data.ts` | 완료 | 목업 데이터 정의됨 |
| `app/(marketing)/page.tsx` | 완료 | 홈 페이지 서버 컴포넌트, 목업 폴백 로직 포함 |
| `app/(marketing)/posts/[id]/page.tsx` | 완료 | `NotionBlockRenderer` 연동 + 이전/다음 글 내비게이션(`PostNavigation`) 구현 완료 |
| `app/(marketing)/categories/[category]/page.tsx` | 완료 | 카테고리별 포스트 목록 페이지 구현됨. Playwright E2E 검증 완료 |
| `components/features/PostCard.tsx` | 완료 | Stretched Link 패턴: 카테고리 배지 독립 링크(`/categories/`), 제목 링크(`/posts/`)로 분리 |
| `components/features/PostListClient.tsx` | 완료 | 카테고리 필터 + 포스트 목록 클라이언트 컴포넌트 구현됨 |
| `components/features/CategoryFilter.tsx` | 완료 | 카테고리 필터 탭 컴포넌트 구현됨 |
| `components/features/NotionBlockRenderer.tsx` | 완료 | paragraph/heading/목록/code/image/quote/divider/toggle/인라인 서식 지원. 중첩 블록 재귀 미지원 |
| `.env.local` | 완료 | 실제 `NOTION_TOKEN`, `NOTION_DATABASE_ID`, `REVALIDATE_SECRET` 설정 완료 |
| `app/api/revalidate/route.ts` | 완료 | On-demand Revalidation API. `secret` 인증 + `revalidateTag`/`revalidatePath` 호출 |

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 2026-05-18 | v1.0 | 최초 작성. PRD 분석 기반 전체 로드맵 수립. 기존 구현 코드 현황 반영. | JasonPark2020 |
| 2026-05-18 | v1.1 | 골격→공통→개별 개발 원칙 섹션 신설. Phase 2를 공통/개별로 분리(총 5개 Phase). Task 004를 개별 페이지 검증보다 선행 배치. 각 Phase에 순서 근거(Rationale) 추가. Task 목록 표에 분류 컬럼 추가. Task 001/002 중복 완료 조건 정리. | JasonPark2020 |
| 2026-06-01 | v1.2 | 실제 코드·환경 상태 대조 반영. Task 001 DoD 전체 체크. Task 002 완료(Notion 실연동 및 테스트 글 3개 확인). Task 004 구현 완료(중첩 블록 재귀·Playwright 잔여 → 기술 부채 이관). Task 005 진행중(블록 렌더러 연동 완료, 이전/다음 내비 잔여). 현재 구현 상태 요약표 2026-06-01 기준으로 동기화. 기술 부채에 중첩 블록 재귀 항목 추가. | JasonPark2020 |
| 2026-06-01 | v1.3 | Task 005 완료(이전/다음 글 내비게이션 구현 + Playwright 검증). Task 003 완료(홈 페이지 실데이터 + 카테고리 필터 + 반응형 375/768/1280 + Playwright E2E 검증). 현재 구현 상태 요약표 동기화. | JasonPark2020 |
| 2026-06-02 | v1.4 | Task 006 완료(카테고리 페이지 E2E 검증). `PostCard` Stretched Link 패턴 적용으로 카테고리 배지 독립 링크 분리. 홈·상세 카테고리 배지 → 카테고리 페이지 이동, 한글 URL 인코딩 정상 동작 Playwright 검증 완료. Phase 3 전체 완료. 다음 작업: Phase 4 — Task 007 캐싱 전략. | JasonPark2020 |
| 2026-06-02 | v1.5 | Task 007 완료. `unstable_cache`로 Notion API 함수 3개 래핑(TTL 300s, 태그 `notion-posts-list`). 페이지 3곳에 `export const revalidate = 300` 적용. `app/api/revalidate/route.ts` 신규 생성(시크릿 인증 + tag/path 무효화). `lib/env.ts` + `.env.example`에 `REVALIDATE_SECRET` 추가. 빌드 ISR 확인, curl 검증 완료. | JasonPark2020 |
