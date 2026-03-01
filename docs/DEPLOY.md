# デプロイ設定

## 自動デプロイ（GitHub Actions）

`main` ブランチへの push で Firebase Hosting に自動デプロイされます。

### 初回セットアップ：FIREBASE_TOKEN の登録

1. ローカルで Firebase CLI にログインし、CI用トークンを取得：
   ```bash
   npx firebase login:ci
   ```
2. 表示されたトークンをコピー
3. GitHub リポジトリ → **Settings** → **Secrets and variables** → **Actions**
4. **New repository secret** をクリック
5. Name: `FIREBASE_TOKEN`、Value: コピーしたトークンを貼り付けて保存

これで `main` への push ごとに自動デプロイされます。

### 手動デプロイ

```bash
npm run deploy
```
