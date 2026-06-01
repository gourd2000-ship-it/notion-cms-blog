# 스타일링 가이드

> **기준:** Tailwind CSS v4 유틸리티 클래스 우선(Utility-First) 접근법  
> **참고 문서:** [Tailwind CSS — Styling with Utility Classes](https://tailwindcss.com/docs/styling-with-utility-classes)  
> **최초 작성일:** 2026-06-01  
> **담당자:** JasonPark2020

---

## 목차

1. [디자인 원칙](#1-디자인-원칙)
2. [색상 시스템](#2-색상-시스템)
3. [타이포그래피](#3-타이포그래피)
4. [간격 시스템](#4-간격-시스템)
5. [레이아웃](#5-레이아웃)
6. [컴포넌트 패턴](#6-컴포넌트-패턴)
7. [반응형 디자인](#7-반응형-디자인)
8. [다크 모드](#8-다크-모드)
9. [상태 변형](#9-상태-변형)
10. [유틸리티 클래스 작성 규칙](#10-유틸리티-클래스-작성-규칙)

---

## 1. 디자인 원칙

### 유틸리티 우선 (Utility-First)

별도 CSS 파일을 생성하지 않고 Tailwind 유틸리티 클래스를 HTML/JSX에 직접 적용한다.
클래스 이름을 고민하거나 CSS와 마크업을 오가는 맥락 전환 비용이 없어진다.

```tsx
// ❌ 피해야 할 방식 — 별도 클래스 추상화
<div className="card-header">

// ✅ 권장 방식 — 유틸리티 클래스 직접 적용
<div className="bg-white border border-slate-200 px-5 py-4">
```

### 핵심 디자인 어조

| 항목 | 기준 |
|------|------|
| 분위기 | 깔끔하고 세련된 교육기관/블로그 스타일 |
| 여백 | 넓게 확보 — 정보 밀도보다 가독성 우선 |
| 색상 | 화이트 베이스 + 네이비/다크블루 포인트 |
| 타이포그래피 | 굵은 제목, 가독성 좋은 본문, 정돈된 계층 |
| 인터랙션 | 호버 시 미묘한 이동(`-translate-y-1`) + 그림자 강화 |

### 반복 최소화 전략

Tailwind 공식 문서가 권장하는 반복 제거 순서:

1. **루프 활용** — 동일한 마크업이 반복되면 `Array.map()`으로 추출
2. **컴포넌트화** — 3곳 이상 재사용 시 React 컴포넌트로 분리
3. **`cn()` 유틸리티** — 조건부 클래스 병합은 `lib/utils.ts`의 `cn()` 사용

```tsx
// 조건부 클래스 — cn() 사용
import { cn } from "@/lib/utils"

<button className={cn(
  "px-5 py-1.5 text-sm font-medium border transition-all",
  isSelected
    ? "bg-slate-900 text-white border-slate-900"
    : "text-slate-500 border-slate-300 hover:border-slate-900"
)}>
```

---

## 2. 색상 시스템

### 팔레트

모든 색상은 Tailwind의 `slate` / `blue` 스케일을 기반으로 한다.
임의 색상(`bg-[#hex]`)은 브랜드 컬러처럼 테마 밖의 일회성 값에만 허용한다.

#### 배경 색상

| 역할 | 라이트 모드 | 다크 모드 | 클래스 |
|------|------------|----------|--------|
| 페이지 배경 | `white` | `slate-950` | `bg-white dark:bg-slate-950` |
| 카드 배경 | `white` | `slate-900` | `bg-white dark:bg-slate-900` |
| 히어로 배경 | `slate-900` | `slate-950` | `bg-slate-900 dark:bg-slate-950` |
| 푸터 배경 | `slate-900` | `slate-950` | `bg-slate-900 dark:bg-slate-950` |
| 네비게이션 배경 | `white` | `slate-950` | `bg-white dark:bg-slate-950` |

#### 텍스트 색상

| 역할 | 라이트 모드 | 다크 모드 | 클래스 |
|------|------------|----------|--------|
| 기본 텍스트 | `slate-900` | `white` | `text-slate-900 dark:text-white` |
| 보조 텍스트 | `slate-500` | `slate-400` | `text-slate-500 dark:text-slate-400` |
| 힌트/캡션 | `slate-400` | `slate-500` | `text-slate-400 dark:text-slate-500` |
| 히어로 텍스트 | `white` | `white` | `text-white` |
| 히어로 설명 | `slate-400` | `slate-400` | `text-slate-400` |

#### 포인트 색상 (Accent)

| 역할 | 클래스 | 사용 위치 |
|------|--------|-----------|
| 주요 액션 | `bg-blue-600` | 카테고리 배지, 버튼 |
| 액션 호버 | `hover:bg-blue-500` | 버튼 호버 상태 |
| 강조선 | `bg-blue-600` | 섹션 헤더 하단 구분선 |
| 링크 호버 | `hover:text-blue-600 dark:hover:text-blue-400` | 카드 제목 |

#### 테두리 색상

| 역할 | 라이트 모드 | 다크 모드 | 클래스 |
|------|------------|----------|--------|
| 기본 테두리 | `slate-200` | `slate-800` | `border-slate-200 dark:border-slate-800` |
| 헤더 테두리 | `slate-200` | `slate-800` | `border-b border-slate-200 dark:border-slate-800` |
| 히어로 내 테두리 | `slate-700/50` | — | `border border-slate-700/50` |

#### 카드 이미지 영역 그라디언트

카테고리별로 다른 그라디언트를 사용하여 시각적 다양성을 제공한다.

| 카테고리 | 클래스 |
|----------|--------|
| AI | `from-indigo-900 to-blue-900` |
| 개발 | `from-slate-800 to-slate-900` |
| 리뷰 | `from-emerald-900 to-slate-900` |
| 디자인 | `from-purple-900 to-slate-900` |
| 기타 | `from-slate-700 to-slate-900` |

```tsx
// PostCard.tsx — 카테고리 그라디언트 적용 예
<div className={cn("relative h-48 bg-gradient-to-br overflow-hidden", gradient)}>
```

---

## 3. 타이포그래피

### 폰트 스케일

Tailwind의 기본 타입 스케일을 그대로 사용한다. 커스텀 폰트 사이즈는 추가하지 않는다.

| 용도 | 클래스 | 실제 크기 |
|------|--------|----------|
| 히어로 제목 (모바일) | `text-3xl font-bold` | 30px |
| 히어로 제목 (태블릿) | `md:text-4xl font-bold` | 36px |
| 히어로 제목 (데스크탑) | `lg:text-5xl font-bold` | 48px |
| 페이지 제목 | `text-2xl md:text-4xl font-bold` | 24–36px |
| 카드 제목 | `text-base font-bold` | 16px |
| 본문 | `text-sm` / `text-base` | 14–16px |
| 캡션/메타 | `text-xs` / `text-sm` | 12–14px |
| 레이블 (배지) | `text-xs font-bold tracking-wider uppercase` | 12px |

### 자간 / 행간

| 용도 | 클래스 |
|------|--------|
| 기본 행간 | `leading-snug` (제목), `leading-relaxed` (본문) |
| 넓은 자간 레이블 | `tracking-wider` (배지, 소제목) |
| 매우 넓은 자간 | `tracking-[0.35em]` (BLOG 레이블 등 강조) |

### 텍스트 제한

긴 텍스트는 반드시 `line-clamp-*`으로 제한하여 카드 높이를 일정하게 유지한다.

```tsx
// 2줄 제한 — 카드 제목에 사용
<h2 className="line-clamp-2">

// 3줄 제한 — 본문 미리보기에 사용
<p className="line-clamp-3">
```

---

## 4. 간격 시스템

Tailwind의 4px 기반 스케일(`p-1` = 4px, `p-2` = 8px …)을 일관되게 사용한다.
임의 값(`px-[13px]`)은 사용하지 않는다.

### 페이지 레벨 간격

| 요소 | 클래스 |
|------|--------|
| 최대 너비 컨테이너 | `max-w-6xl mx-auto` |
| 수평 패딩 | `px-6` |
| 섹션 상하 패딩 | `py-14` |
| 히어로 상하 패딩 | `py-20 md:py-32` |

### 컴포넌트 레벨 간격

| 요소 | 클래스 |
|------|--------|
| 카드 내부 패딩 | `p-5` |
| 카드 그리드 간격 | `gap-6 md:gap-8` |
| 필터 탭 간격 | `gap-2` |
| 헤더 높이 | `h-16` |
| 네비게이션 링크 간격 | `gap-8` |

### 간격 스케일 참고

```
p-1  = 4px    p-2  = 8px    p-3  = 12px   p-4  = 16px
p-5  = 20px   p-6  = 24px   p-8  = 32px   p-10 = 40px
p-12 = 48px   p-14 = 56px   p-16 = 64px   p-20 = 80px
```

---

## 5. 레이아웃

### 컨테이너 패턴

모든 주요 콘텐츠 영역은 동일한 컨테이너 패턴을 사용한다.

```tsx
// 표준 페이지 컨테이너
<div className="mx-auto max-w-6xl px-6 py-14">

// 히어로 섹션 컨테이너 (전체 너비 배경 + 내부 제한)
<section className="bg-slate-900">
  <div className="mx-auto max-w-6xl px-6 py-20 md:py-32">
```

### 그리드 시스템

포스트 목록은 반응형 3단 그리드를 사용한다.

```tsx
// 포스트 카드 그리드
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
```

### Flex 패턴

헤더/푸터 등 가로 정렬이 필요한 요소에 사용한다.

```tsx
// 헤더 — 좌측 로고 / 중앙 네비 / 우측 액션
<div className="flex items-center justify-between gap-4">

// 메타 정보 — 아이콘 + 텍스트 정렬
<div className="flex items-center gap-1.5">
```

---

## 6. 컴포넌트 패턴

### 네비게이션 헤더

```tsx
<header className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
  <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-4">
    {/* 로고 */}
    <Link className="font-bold text-xl text-slate-900 dark:text-white tracking-tight hover:opacity-80 transition-opacity">

    {/* 네비게이션 링크 */}
    <Link className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">

    {/* 액션 버튼 */}
    <Button className="bg-slate-900 hover:bg-slate-700 text-white rounded-none text-xs font-semibold tracking-wide px-5">
```

### 히어로 배너

```tsx
<section className="relative bg-slate-800 dark:bg-slate-950 overflow-hidden">
  {/* 그라디언트 배경 */}
  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800" />

  {/* 중앙 텍스트 박스 */}
  <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 px-10 py-12 md:px-16 md:py-16 text-center max-w-2xl w-full">
    {/* BLOG 레이블 */}
    <span className="text-xs font-bold tracking-[0.35em] text-blue-400 uppercase">BLOG</span>
    {/* 제목 */}
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
```

### 포스트 카드

```tsx
<article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
  {/* 이미지 영역 */}
  <div className="relative h-48 bg-gradient-to-br overflow-hidden {카테고리 그라디언트}">
    {/* 카테고리 배지 */}
    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 tracking-wider uppercase">

  {/* 콘텐츠 영역 */}
  <div className="p-5">
    {/* 날짜 */}
    <div className="text-xs text-slate-400 dark:text-slate-500">
    {/* 제목 */}
    <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
    {/* 태그 */}
    <span className="text-xs text-slate-400 dark:text-slate-500"># 태그명</span>
```

### 카테고리 필터 탭

두 가지 상태(선택/미선택)를 `cn()`으로 조건부 적용한다.

```tsx
// 선택된 탭
"bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white"

// 미선택 탭
"bg-white dark:bg-transparent text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:border-slate-900 dark:hover:border-white hover:text-slate-900 dark:hover:text-white"

// 공통 기본 클래스
"px-5 py-1.5 text-sm font-medium border transition-all duration-200"
```

### 카테고리/포스트 상세 페이지 히어로 헤더

```tsx
<div className="bg-slate-900 dark:bg-slate-950 border-b border-slate-800">
  <div className="mx-auto max-w-6xl px-6 py-14">
    {/* 섹션 레이블 */}
    <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 tracking-wider uppercase mb-5">
    {/* 타이틀 */}
    <h1 className="text-3xl md:text-4xl font-bold text-white">
```

### 버튼

| 변형 | 클래스 | 사용 위치 |
|------|--------|-----------|
| 주요 (다크) | `bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-6 py-2.5` | 뒤로가기, CTA |
| 네비 액션 | `bg-slate-900 ... rounded-none text-xs tracking-wide px-5` | 헤더 GitHub 버튼 |
| 인라인 링크 | `inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900` | 뒤로가기 텍스트 링크 |

> **규칙:** `rounded-none`(각진 버튼)을 기본으로 사용한다. 필 탭(CategoryFilter)만 예외적으로 직사각형 border를 사용한다. `rounded-full`은 사용하지 않는다.

### 푸터

```tsx
<footer className="bg-slate-900 dark:bg-slate-950 text-slate-400">
  <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
    {/* 사이트명 */}
    <span className="text-white font-bold text-base">
    {/* 저작권 */}
    <p className="text-xs text-slate-500">
    {/* 푸터 링크 */}
    <a className="text-slate-500 hover:text-white transition-colors">
```

---

## 7. 반응형 디자인

Tailwind의 **모바일 우선(Mobile-First)** 원칙을 따른다.
기본 클래스가 모바일, `sm:` / `md:` / `lg:` 접두사가 더 큰 화면에 적용된다.

### 브레이크포인트

| 접두사 | 최소 너비 | 주요 뷰포트 |
|--------|----------|------------|
| (기본) | 0px | 모바일 (375px) |
| `sm:` | 640px | 태블릿 소형 |
| `md:` | 768px | 태블릿 (768px) |
| `lg:` | 1024px | 데스크탑 |
| `xl:` | 1280px | 와이드 데스크탑 |

### 주요 반응형 패턴

```tsx
// 그리드: 1열 → 2열 → 3열
"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"

// 히어로 패딩: 모바일 작게 → 데스크탑 크게
"py-20 md:py-32"

// 히어로 텍스트 크기 단계별 증가
"text-3xl md:text-4xl lg:text-5xl"

// 푸터: 세로 쌓기 → 가로 배치
"flex flex-col md:flex-row items-center justify-between"

// 데스크탑 전용 요소 (모바일 숨김)
"hidden md:flex"
"hidden md:inline-flex"

// 모바일 전용 요소 (데스크탑 숨김)
"md:hidden"
```

---

## 8. 다크 모드

`dark:` 접두사로 모든 색상에 다크 모드 대응 클래스를 함께 작성한다.
`next-themes`의 `ThemeProvider`가 `dark` 클래스를 `<html>`에 토글한다.

### 다크 모드 대응 규칙

```tsx
// 배경
"bg-white dark:bg-slate-900"
"bg-white dark:bg-slate-950"

// 텍스트
"text-slate-900 dark:text-white"
"text-slate-500 dark:text-slate-400"

// 테두리
"border-slate-200 dark:border-slate-800"

// 버튼 — 라이트/다크 반전
"bg-slate-900 text-white dark:bg-white dark:text-slate-900"
```

> **규칙:** 라이트/다크 모드 클래스는 항상 쌍으로 작성한다. `dark:` 없이 색상 클래스만 쓰는 것은 다크 모드 미지원으로 간주한다.

---

## 9. 상태 변형

### 호버 (Hover)

```tsx
// 색상 전환
"hover:text-slate-900 dark:hover:text-white"
"hover:text-blue-600 dark:hover:text-blue-400"
"hover:bg-blue-500"

// 그림자 강화
"hover:shadow-xl"

// 카드 상승 효과 — 그림자 + 이동 동시 적용
"hover:shadow-xl hover:-translate-y-1 transition-all duration-300"

// 투명도 감소
"hover:opacity-80"
```

### 트랜지션

모든 상호작용 요소에 트랜지션을 적용한다.

```tsx
// 색상만 전환 (링크, 텍스트)
"transition-colors"

// 모든 속성 전환 (카드)
"transition-all duration-300"

// 투명도 전환 (로고)
"transition-opacity"
```

### 포커스 (접근성)

버튼과 인터랙티브 요소에 포커스 링을 반드시 유지한다.

```tsx
"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
```

---

## 10. 유틸리티 클래스 작성 규칙

### 클래스 작성 순서 (권장)

가독성을 위해 아래 순서로 클래스를 나열한다.

```
1. 레이아웃       : flex, grid, block, hidden, overflow-*
2. 포지셔닝       : relative, absolute, top-*, z-*
3. 박스 모델      : w-*, h-*, max-w-*, px-*, py-*, p-*, m-*
4. 타이포그래피   : text-*, font-*, leading-*, tracking-*, line-clamp-*
5. 배경/테두리    : bg-*, border-*, rounded-*
6. 효과           : shadow-*, opacity-*, blur-*
7. 상태/트랜지션  : hover:*, focus-visible:*, dark:*, transition-*
```

### `cn()` 활용 패턴

조건부 클래스 병합은 반드시 `cn()`을 사용한다. 문자열 보간(`template literal`)으로 클래스를 동적 조합하지 않는다.

```tsx
import { cn } from "@/lib/utils"

// ✅ 올바른 방식
<div className={cn("base-class", condition && "conditional-class", className)}>

// ❌ 피해야 할 방식
<div className={`base-class ${condition ? "conditional-class" : ""}`}>
```

### 임의 값 사용 기준

```tsx
// ✅ 허용 — 브랜드 컬러처럼 테마 밖의 일회성 값
<span className="tracking-[0.35em]">BLOG</span>

// ✅ 허용 — 복잡한 CSS 표현이 필요한 경우
<div className="bg-slate-700/50">  {/* 투명도 포함 */}

// ❌ 금지 — Tailwind 스케일로 대체 가능한 경우
<div className="p-[20px]">  →  <div className="p-5">
<div className="text-[16px]">  →  <div className="text-base">
```

### 인라인 스타일 사용 기준

동적 값(사용자 입력, 런타임 계산값)에만 인라인 스타일을 허용한다.

```tsx
// ✅ 허용 — 런타임에 결정되는 값
<div style={{ backgroundColor: userDefinedColor }}>

// ❌ 금지 — 정적 값은 유틸리티 클래스로
<div style={{ padding: "20px" }}>
```

---

## 참고 자료

- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs/styling-with-utility-classes)
- [shadcn/ui 컴포넌트](https://ui.shadcn.com)
- `lib/utils.ts` — `cn()` 구현체
- `components/features/PostCard.tsx` — 카드 패턴 참고
- `components/features/CategoryFilter.tsx` — 필 탭 패턴 참고
- `components/layout/blog-header.tsx` — 헤더 패턴 참고
