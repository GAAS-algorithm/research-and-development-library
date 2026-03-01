# カスタムドメイン設定（library.tanaakk.com）

## 概要

サイトは `app/src/config/site.json` でベース URL を管理しています。  
`library.tanaakk.com` を使用する場合の設定手順です。

## 1. 設定ファイル

`app/src/config/site.json` でドメインを指定：

```json
{
  "siteUrl": "https://library.tanaakk.com"
}
```

この設定により、以下が自動で更新されます：

- **sitemap.xml** — 全 URL が `library.tanaakk.com` に
- **robots.txt** — Sitemap URL
- **構造化データ（JSON-LD）** — Organization, WebSite, WebPage の URL

## 2. Firebase カスタムドメイン

1. [Firebase Console](https://console.firebase.google.com/) → プロジェクト選択
2. **Hosting** → **カスタムドメインを追加**
3. `library.tanaakk.com` を入力
4. 表示される **DNS レコード**（A レコードまたは CNAME）を DNS プロバイダに追加
5. 証明書のプロビジョニング完了を待つ（数分〜数時間）

## 3. Search Console

1. [Google Search Console](https://search.google.com/search-console)
2. プロパティ追加 → **URL プレフィックス**
3. `https://library.tanaakk.com` を登録
4. 所有権の確認（HTML タグまたは DNS）

## 4. ドメインの切り替え

- **Firebase デフォルト**: `site.json` の `siteUrl` を `https://gaas-r-and-d-library.web.app` に変更
- **カスタムドメイン**: `https://library.tanaakk.com` に変更

変更後、`npm run build` で sitemap.xml と robots.txt が再生成されます。
