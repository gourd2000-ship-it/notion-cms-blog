# 개인 연구 블로그 (Notion CMS)

Notion을 CMS로 활용한 개인 연구 블로그입니다. Notion에서 글을 작성하면 별도 배포 없이 블로그에 자동으로 반영됩니다.

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | Next.js 16, TypeScript |
| CMS | Notion API (`@notionhq/client`) |
| Styling | Tailwind CSS 4, shadcn/ui |
| 아이콘 | Lucide React |
| 배포 | Vercel |

## 주요 기능

- Notion 데이터베이스에서 블로그 글 목록 조회
- 개별 글 상세 페이지 표시
- 카테고리별 필터링
- 검색 기능
- 반응형 디자인

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 참고하여 `.env.local` 파일을 생성합니다.

```bash
cp .env.example .env.local
```

`.env.local`에 아래 값을 입력합니다.

```env
NOTION_TOKEN=secret_xxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- `NOTION_TOKEN`: [Notion Integration](https://www.notion.so/my-integrations) 생성 후 발급받은 시크릿 키
- `NOTION_DATABASE_ID`: 블로그 글을 저장하는 Notion 데이터베이스 ID

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

## Notion 데이터베이스 구조

| 필드명 | 타입 | 설명 |
|--------|------|------|
| `Title` | title | 글 제목 |
| `Category` | select | 카테고리 |
| `Tags` | multi_select | 태그 |
| `Published` | date | 발행일 |
| `Status` | select | `초안` / `발행됨` |

`Status = 발행됨`인 항목만 블로그에 표시됩니다.

## 프로젝트 구조

```
invoice-web/
├── app/            # Next.js App Router 페이지
├── components/     # 공통 UI 컴포넌트
├── lib/            # 유틸리티 및 Notion API 클라이언트
├── types/          # TypeScript 타입 정의
├── config/         # 프로젝트 설정
├── hooks/          # 커스텀 훅
├── docs/           # 프로젝트 문서
│   └── PRD.md      # 제품 요구사항 문서
└── public/         # 정적 파일
```

## 문서

- [PRD (제품 요구사항 문서)](./docs/PRD.md)

## 배포

[Vercel](https://vercel.com)에 배포합니다. `main` 브랜치에 푸시하면 자동 배포됩니다.
