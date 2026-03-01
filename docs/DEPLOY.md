# オートデプロイ設定

## 概要

`main` ブランチへの push で [https://gaas-r-and-d-library.web.app](https://gaas-r-and-d-library.web.app) に自動デプロイされます。

## ⚠️ 必須: FIREBASE_TOKEN の設定

オートデプロイが動作するには、**GitHub Secrets に FIREBASE_TOKEN を登録する必要があります**。未設定の場合、ワークフローは「Verify Firebase token」ステップで失敗します。

### 1. Firebase CLI トークンの取得

```bash
npx firebase login:ci
```

ブラウザが開くので Firebase にログインし、表示されたトークンをコピーします。

### 2. GitHub Secrets に追加

1. リポジトリ → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** をクリック
3. **Name**: `FIREBASE_TOKEN`（必ずこの名前）
4. **Secret**: 上記でコピーしたトークンを貼り付け
5. **Add secret** で保存

### 3. 動作確認

- `main` に push するか、**Actions** タブから「Deploy to Firebase Hosting」を手動実行
- 成功すると https://gaas-r-and-d-library.web.app に反映されます

## デプロイフロー

- **トリガー**: `main` への push、または手動実行（workflow_dispatch）
- **ビルド**: `npm run build`（app をビルド）
- **デプロイ先**: Firebase Hosting（`app/dist`）

## 手動デプロイ（ローカル）

```bash
npm run deploy
```
