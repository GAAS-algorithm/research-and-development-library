# オートデプロイ設定

## 概要

`main` ブランチへの push で [https://gaas-r-and-d-library.web.app](https://gaas-r-and-d-library.web.app) に自動デプロイされます。

## 必要な設定

### 1. Firebase CLI トークンの取得

```bash
npx firebase login:ci
```

表示されたトークンをコピーします。

### 2. GitHub Secrets に追加

1. リポジトリ → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** をクリック
3. Name: `FIREBASE_TOKEN`
4. Value: 上記で取得したトークン

## デプロイフロー

- **トリガー**: `main` への push
- **ビルド**: `npm run build`（app をビルド）
- **デプロイ先**: Firebase Hosting（`app/dist`）

## 手動デプロイ

```bash
npm run deploy
```
