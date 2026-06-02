/**
 * @description Notion 블록 렌더러 (서버 컴포넌트)
 *
 * NotionBlock[] 배열을 받아 HTML로 렌더링합니다.
 * Tailwind CSS 4.x prose 클래스와 함께 사용됩니다.
 *
 * 지원 블록 타입:
 * - paragraph, heading_1/2/3
 * - bulleted_list_item, numbered_list_item
 * - code, image, quote, divider, toggle
 */

import type { NotionBlock } from "@/lib/types"
import { isSafeImageUrl } from "@/lib/utils"

// ============================================================
// 인라인 서식 타입
// ============================================================

interface RichTextAnnotations {
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  code: boolean
  color: string
}

interface RichTextItem {
  plain_text: string
  href: string | null
  annotations: RichTextAnnotations
}

// ============================================================
// 인라인 서식 렌더러
// ============================================================

/**
 * @description RichTextItem 배열을 JSX로 변환합니다.
 * bold, italic, code, link, strikethrough, underline 인라인 서식 지원.
 * @param {RichTextItem[]} richText - Notion API RichTextItemResponse 배열
 * @returns {JSX.Element[]} 렌더링된 인라인 요소 배열
 */
function renderRichText(richText: RichTextItem[]): React.ReactNode {
  return richText.map((item, index) => {
    const { plain_text, href, annotations } = item
    let node: React.ReactNode = plain_text

    // 인라인 코드 (다른 서식보다 우선 처리)
    if (annotations.code) {
      node = (
        <code
          key={index}
          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
        >
          {plain_text}
        </code>
      )
      return node
    }

    // 취소선
    if (annotations.strikethrough) {
      node = <del key={`s-${index}`}>{node}</del>
    }

    // 밑줄
    if (annotations.underline) {
      node = <u key={`u-${index}`}>{node}</u>
    }

    // 이탤릭
    if (annotations.italic) {
      node = <em key={`em-${index}`}>{node}</em>
    }

    // 굵게
    if (annotations.bold) {
      node = <strong key={`b-${index}`}>{node}</strong>
    }

    // 링크
    if (href) {
      node = (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-primary transition-colors"
        >
          {node}
        </a>
      )
      return node
    }

    return <span key={index}>{node}</span>
  })
}

// ============================================================
// 블록 타입별 렌더러
// ============================================================

/**
 * @description 단일 Notion 블록을 JSX로 변환합니다.
 * @param {NotionBlock} block - Notion 블록 객체
 * @param {number} index - 블록 인덱스 (key prop용)
 * @returns {JSX.Element | null} 렌더링된 블록 또는 null
 */
function renderBlock(block: NotionBlock, index: number): React.ReactNode {
  const key = block.id || index

  switch (block.type) {
    case "paragraph": {
      const data = block["paragraph"] as { rich_text: RichTextItem[] } | undefined
      const richText = data?.rich_text ?? []

      return (
        <p key={key} className="mb-4 leading-7">
          {richText.length > 0 ? renderRichText(richText) : <br />}
        </p>
      )
    }

    case "heading_1": {
      const data = block["heading_1"] as { rich_text: RichTextItem[] } | undefined
      return (
        <h2 key={key} className="mt-10 mb-4 text-2xl font-bold tracking-tight">
          {renderRichText(data?.rich_text ?? [])}
        </h2>
      )
    }

    case "heading_2": {
      const data = block["heading_2"] as { rich_text: RichTextItem[] } | undefined
      return (
        <h3 key={key} className="mt-8 mb-3 text-xl font-semibold tracking-tight">
          {renderRichText(data?.rich_text ?? [])}
        </h3>
      )
    }

    case "heading_3": {
      const data = block["heading_3"] as { rich_text: RichTextItem[] } | undefined
      return (
        <h4 key={key} className="mt-6 mb-2 text-lg font-semibold">
          {renderRichText(data?.rich_text ?? [])}
        </h4>
      )
    }

    case "bulleted_list_item": {
      const data = block["bulleted_list_item"] as { rich_text: RichTextItem[] } | undefined
      return (
        <li key={key} className="mb-1 leading-7">
          {renderRichText(data?.rich_text ?? [])}
        </li>
      )
    }

    case "numbered_list_item": {
      const data = block["numbered_list_item"] as { rich_text: RichTextItem[] } | undefined
      return (
        <li key={key} className="mb-1 leading-7">
          {renderRichText(data?.rich_text ?? [])}
        </li>
      )
    }

    case "code": {
      const data = block["code"] as { rich_text: RichTextItem[]; language: string } | undefined
      const codeText = data?.rich_text.map((t) => t.plain_text).join("") ?? ""
      const language = data?.language ?? "text"

      return (
        <div key={key} className="my-6">
          <div className="flex items-center px-4 py-1.5 bg-muted rounded-t-lg border border-border border-b-0">
            <span className="text-xs text-muted-foreground font-mono">{language}</span>
          </div>
          <pre className="overflow-x-auto rounded-b-lg border border-border bg-muted/60 p-4">
            <code className="text-sm font-mono leading-6">{codeText}</code>
          </pre>
        </div>
      )
    }

    case "image": {
      const data = block["image"] as {
        type: "external" | "file"
        external?: { url: string }
        file?: { url: string; expiry_time: string }
        caption?: RichTextItem[]
      } | undefined

      const src =
        data?.type === "external"
          ? (data.external?.url ?? "")
          : (data?.file?.url ?? "")

      const caption = data?.caption?.map((t) => t.plain_text).join("") ?? ""

      // 빈 URL 또는 https: 이외의 스킴(javascript:, data: 등) 차단
      if (!src || !isSafeImageUrl(src)) return null

      return (
        <figure key={key} className="my-6">
          {/* next/image 대신 img 사용 — Notion S3 URL은 1시간 만료라 최적화 불필요 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={caption || "포스트 이미지"}
            className="w-full rounded-lg border border-border"
          />
          {caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case "quote": {
      const data = block["quote"] as { rich_text: RichTextItem[] } | undefined
      return (
        <blockquote
          key={key}
          className="my-4 border-l-4 border-primary pl-4 italic text-muted-foreground"
        >
          {renderRichText(data?.rich_text ?? [])}
        </blockquote>
      )
    }

    case "divider": {
      return <hr key={key} className="my-8 border-border" />
    }

    case "toggle": {
      const data = block["toggle"] as { rich_text: RichTextItem[] } | undefined
      return (
        <details key={key} className="my-3 rounded-lg border border-border p-4">
          <summary className="cursor-pointer font-medium select-none">
            {renderRichText(data?.rich_text ?? [])}
          </summary>
          {/* 중첩 블록은 현재 미지원 — has_children이 true일 때 API 재호출 필요 */}
        </details>
      )
    }

    default: {
      // 미지원 블록 타입 — 개발 중에만 표시
      if (process.env.NODE_ENV === "development") {
        return (
          <div
            key={key}
            className="my-2 rounded border border-dashed border-muted-foreground/30 px-3 py-2 text-xs text-muted-foreground"
          >
            미지원 블록: {block.type}
          </div>
        )
      }
      return null
    }
  }
}

// ============================================================
// 목록 블록 그룹화 유틸리티
// ============================================================

/**
 * @description 연속된 목록 아이템 블록을 ul/ol로 그룹화합니다.
 * @param {NotionBlock[]} blocks - 전체 블록 배열
 * @returns {React.ReactNode[]} 그룹화된 블록 렌더링 결과
 */
function renderBlocksWithListGrouping(blocks: NotionBlock[]): React.ReactNode[] {
  const result: React.ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    if (block.type === "bulleted_list_item") {
      const group: NotionBlock[] = []
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        group.push(blocks[i])
        i++
      }
      result.push(
        <ul key={`ul-${group[0].id}`} className="my-4 ml-6 list-disc space-y-1">
          {group.map((b, idx) => renderBlock(b, idx))}
        </ul>
      )
      continue
    }

    if (block.type === "numbered_list_item") {
      const group: NotionBlock[] = []
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        group.push(blocks[i])
        i++
      }
      result.push(
        <ol key={`ol-${group[0].id}`} className="my-4 ml-6 list-decimal space-y-1">
          {group.map((b, idx) => renderBlock(b, idx))}
        </ol>
      )
      continue
    }

    result.push(renderBlock(block, i))
    i++
  }

  return result
}

// ============================================================
// 공개 컴포넌트
// ============================================================

interface NotionBlockRendererProps {
  blocks: NotionBlock[]
}

/**
 * @description Notion 블록 배열을 렌더링하는 서버 컴포넌트
 * @param {NotionBlockRendererProps} props - 블록 배열 props
 * @returns {JSX.Element} 렌더링된 본문
 */
export default function NotionBlockRenderer({ blocks }: NotionBlockRendererProps) {
  if (blocks.length === 0) {
    return <p className="text-muted-foreground">본문 내용이 없습니다.</p>
  }

  return <>{renderBlocksWithListGrouping(blocks)}</>
}
