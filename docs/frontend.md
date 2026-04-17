# フロントエンド構成

## ディレクトリ構成

```text
frontend/
├── Dockerfile
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx              # エントリーポイント
    ├── App.tsx               # ルーティング定義
    ├── api/
    │   ├── client.ts         # axiosインスタンス設定
    │   ├── transactions.ts
    │   └── categories.ts
    ├── components/
    │   ├── Layout.tsx
    │   └── LoadingSpinner.tsx
    ├── hooks/
    │   └── useTodos.ts
    ├── pages/
    │   ├── TransactionListPage.tsx
    │   ├── TransactionFormPage.tsx
    │   └── SummaryPage.tsx
    └── types/
        └── index.ts
```

## 技術スタック

| 技術 | バージョン | 用途 |
| ---- | -------- | ---- |
| React | 18 | UIフレームワーク |
| TypeScript | 5 | 型安全な開発 |
| Vite | 6 | ビルドツール・開発サーバー |
| Node | 20 | ランタイム |

## Viteプロキシ設定

`vite.config.ts` で `/api/*` へのリクエストをバックエンドに転送する。

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://backend:8080',  // Dockerネットワーク内のサービス名
      changeOrigin: true,
    },
  },
},
```

これにより、フロントエンドから `/api/users` と呼び出すだけでバックエンドへルーティングされ、CORSを意識せずに開発できる。

## 開発サーバー

```bash
# Docker経由で起動（推奨）
docker compose up frontend

# ローカルで起動
cd frontend
npm install
npm run dev
```

アクセス: <http://localhost:5173>
