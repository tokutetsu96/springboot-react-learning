# フロントエンド構成

## ディレクトリ構成

```
frontend/
├── Dockerfile
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx        # エントリーポイント
    └── App.jsx         # ルートコンポーネント
```

## 技術スタック

| 技術 | バージョン | 用途 |
|------|----------|------|
| React | 18 | UIフレームワーク |
| Vite | 6 | ビルドツール・開発サーバー |
| Node | 20 | ランタイム |

## Viteプロキシ設定

`vite.config.js` で `/api/*` へのリクエストをバックエンドに転送する。

```js
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

アクセス: http://localhost:5173
