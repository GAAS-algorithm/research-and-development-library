import { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

type Props = {
  content: string
  displayMode?: boolean
  className?: string
}

/**
 * LaTeX を含む文字列をレンダリング。
 * $...$ で囲まれた部分をインライン数式、$$...$$ をディスプレイ数式として解釈。
 * それ以外はプレーンテキスト。
 */
export function Latex({ content, displayMode = false, className }: Props) {
  const html = useMemo(() => {
    if (!content || content === '—') return content

    const displayRegex = /\$\$([^$]+)\$\$/g
    const inlineRegex = /\$([^$]+)\$/g

    let match
    const allMatches: { type: 'display' | 'inline'; start: number; end: number; latex: string }[] = []

    while ((match = displayRegex.exec(content)) !== null) {
      allMatches.push({ type: 'display', start: match.index, end: match.index + match[0].length, latex: match[1] })
    }
    while ((match = inlineRegex.exec(content)) !== null) {
      allMatches.push({ type: 'inline', start: match.index, end: match.index + match[0].length, latex: match[1] })
    }

    allMatches.sort((a, b) => a.start - b.start)

    if (allMatches.length === 0) {
      return { __html: escapeHtml(content) }
    }

    let result = ''
    let pos = 0

    for (const m of allMatches) {
      if (m.start > pos) {
        result += escapeHtml(content.slice(pos, m.start))
      }
      try {
        result += katex.renderToString(m.latex, {
          throwOnError: false,
          displayMode: m.type === 'display' || displayMode,
          output: 'html',
        })
      } catch {
        result += escapeHtml('$' + m.latex + '$')
      }
      pos = m.end
    }
    if (pos < content.length) {
      result += escapeHtml(content.slice(pos))
    }
    return { __html: result }
  }, [content])

  if (typeof html === 'string') {
    return <span className={className}>{html}</span>
  }
  return <span className={className} dangerouslySetInnerHTML={html} />
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * 文字列から LaTeX 部分とテキスト部分を分離。
 * formula_latex が指定されていればそれを優先。
 */
export function extractFormulaParts(
  content: string | null | undefined,
  formulaLatex?: string | null
): { text: string; latex: string | null } {
  if (formulaLatex) {
    const text = content ? content.replace(/\$[^$]*\$|\$\$[^$]*\$\$/g, '').trim() || '—' : '—'
    return { text: text || '—', latex: formulaLatex }
  }
  if (!content || content === '—') return { text: '—', latex: null }
  const displayMatch = content.match(/\$\$([^$]+)\$\$/)
  const inlineMatch = content.match(/\$([^$]+)\$/)
  const latex = displayMatch?.[1] ?? inlineMatch?.[1] ?? null
  const text = content.replace(/\$[^$]*\$|\$\$[^$]*\$\$/g, '').trim() || '—'
  return { text, latex }
}

/**
 * LaTeX のみをディスプレイモードでレンダリング（数式専用列用）
 */
export function LatexFormula({ latex, className }: { latex: string; className?: string }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true,
        output: 'html',
      })
    } catch {
      return escapeHtml(latex)
    }
  }, [latex])
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
