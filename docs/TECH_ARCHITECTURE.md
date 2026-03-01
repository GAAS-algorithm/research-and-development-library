# GAAS HST 準拠アーキテクチャ｜R&D Library

[Holographic Sphere Topology](https://www.tanaakk.com/2026/02/26/tech/) に基づく技術方針と実装ガイド。

## 1. スタック準拠状況

| 領域 | GAAS標準 | 本プロジェクト | 状態 |
|------|----------|----------------|------|
| UI基盤 | SolidJS (Signals) | solid-js | ✅ |
| スタイリング | Tailwind CSS v4 | tailwindcss ^4.2.1 | ✅ |
| フォント/アイコン | System-Native / Lucide | Lucide (on-demand) | ⚠️ フォント要見直し |
| 実行環境 | Bun | Node.js (Vite) | ⚠️ ビルドスクリプトは Bun 対応可 |
| DB | Drizzle + SQLite | なし（静的サイト） | N/A |

## 2. 境界面（Event Horizon）の原則

> すべての価値と情報は `https://` という事象の地平線上に集約される。

- **型**: TypeScript による境界面の完全記述
- **Signal**: SolidJS によるピンポイント更新（仮想DOM の再描画回避）
- **Tailwind**: 視覚的インターフェースを Utility クラスで完結
- **PWA**: URL ひとつで全デバイスへ即時配信

## 3. 実装ルール

1. **1ファイル1機能（Self-contained）** — AI がメンテナンスしやすい粒度
2. **外部 CSS ファイルを極力作らない** — Tailwind Utility で HTML 内完結
3. **Lucide は On-demand import** — 使用するアイコンのみ import
4. **生の SQL 禁止** — DB 導入時は Drizzle ORM 必須
5. **境界面の契約** — 型・インターフェースで Object / Morphism を明示

## 4. 記事に未記載の提案

### 4.1 境界面の観測可能性（Observability）

- **Core Web Vitals** — LCP, FID, CLS の計測と閾値管理
- **RUM (Real User Monitoring)** — 境界面の実際のパフォーマンスを記録
- **Error Boundary** — 境界面での例外を捕捉し、ユーザー体験を維持

### 4.2 キャッシュ戦略（Cache at the Boundary）

- **stale-while-revalidate** — 境界面での即時表示と背景更新
- **Service Worker** — オフライン対応とエッジキャッシュ
- **CDN / Edge** — Vercel, Cloudflare, Firebase Hosting による境界面の爆速配信

### 4.3 セキュリティ（境界面の防御）

- **CSP (Content Security Policy)** — 境界面で許可するリソースを明示
- **SRI (Subresource Integrity)** — 外部スクリプトの改ざん検知
- **HSTS** — HTTPS 強制

### 4.4 View Transitions API

- ページ遷移時のスムーズなアニメーション
- 境界面の「連続性」を保ちつつ、体感速度を向上

### 4.5 型による境界面の完全記述

- `strict: true` による型の厳格化
- API 境界では OpenAPI / Zod 等でスキーマを共有
- フロントエンドでの検証・フォーマットを完了してからバックエンドへ（消化の前処理）

### 4.6 軽い処理の組み合わせ（Object / Morphism）

- 機能単位を独立モジュール化
- データフローを Morphism（射）として型で定義
- プロセッシング順序の最適化 — 口に入れる前に前処理完了

---

## 5. ビルド

- **Node.js**: `npm run build`
- **Bun** (推奨・秒単位): `npm run build:bun` — Bun がインストールされている場合

## 6. Cursor 指示の例

```
TANAAKK [GAAS標準スタック](https://github.com/tanaakk/universal-guideline) による実装。

1. Visual: アイコンは Lucide (On-demand import)、フォントは System-Native を優先
2. Styling: Tailwind CSS v4 (外部 CSS を極力作らず、Utility クラスで完結)
3. UI: SolidJS (Signals を使い、仮想 DOM 的な再レンダリングを避ける)
4. Runtime: Bun を推奨（ビルド・スクリプト）

「1ファイル1機能（Self-contained）」を意識し、技術負債ゼロのクリーンなコードを出力。
```
