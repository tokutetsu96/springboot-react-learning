# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

Spring Boot 3.4.4 (Java 21) + React 18 (TypeScript + Vite) + PostgreSQL の学習用フルスタック構成。全サービスは Docker Compose で起動することを前提としている。

## 起動コマンド

```bash
# 全サービス起動（推奨）
docker compose up --build

# バックグラウンド起動
docker compose up -d --build

# 個別停止・再起動
docker compose restart backend
docker compose restart frontend
```

- フロントエンド: http://localhost:5173
- バックエンド API: http://localhost:8080

## バックエンド（backend/）

**参照スキル**: `springboot-patterns`、`java-springboot`

**技術スタック**: Spring Boot 3.4.4 / Java 21 / Maven / Spring Data JPA / Lombok / Bean Validation / PostgreSQL

```bash
# Docker外でバックエンド単体ビルド
cd backend && ./mvnw clean package -DskipTests

# テスト実行
cd backend && ./mvnw test

# 単一テストクラスの実行
cd backend && ./mvnw test -Dtest=UserServiceTest
```

**レイヤー構成** (`com.example.app` パッケージ):

```
controller/   → @RestController、リクエスト受付・レスポンス返却のみ
service/      → UserService インターフェース
service/impl/ → UserServiceImpl 実装クラス
repository/   → Spring Data JPA リポジトリ（インターフェースのみ）
domain/       → JPA エンティティ（@Entity）
dto/request/  → リクエスト DTO（Bean Validation アノテーション付き）
dto/response/ → レスポンス DTO
exception/    → GlobalExceptionHandler、ResourceNotFoundException、ErrorResponse
config/       → CorsConfig、DataInitializer
```

- エンティティには Lombok（`@Getter`/`@Setter`/`@NoArgsConstructor`）を使用
- `createdAt`/`updatedAt` は `@CreationTimestamp`/`@UpdateTimestamp` で自動設定
- スキーマは `ddl-auto: update`（Hibernate 自動管理）
- 例外は `GlobalExceptionHandler` で一元ハンドリングし `ErrorResponse` を返す

**API エンドポイント** (`/api/users`):

| メソッド | パス | 説明 |
|--------|------|------|
| GET | `/api/users` | 全ユーザー取得 |
| GET | `/api/users/{id}` | ID指定取得 |
| POST | `/api/users` | ユーザー作成 |
| DELETE | `/api/users/{id}` | ユーザー削除 |

## フロントエンド（frontend/）

**参照スキル**: `frontend-ui-engineering`、`vercel-react-best-practices`

**技術スタック**: React 18 / TypeScript / Vite 6

```bash
# Docker外でフロントエンド単体起動（プロキシ先の調整が必要）
cd frontend && npm install && npm run dev

# ビルド
cd frontend && npm run build
```

- Vite の dev server は `/api` を `http://backend:8080` にプロキシする（Docker内サービス名）
- Docker 外でバックエンドを直接参照したい場合は `vite.config.ts` の `proxy.target` を `http://localhost:8080` に変更する
- 現状 `src/App.tsx` 1ファイル構成。状態管理ライブラリ・ルーティングは未導入

## 環境変数

| 変数 | デフォルト値 | 説明 |
|------|------------|------|
| `POSTGRES_DB` | `appdb` | DB名 |
| `POSTGRES_USER` | `appuser` | DBユーザー |
| `POSTGRES_PASSWORD` | `apppassword` | DBパスワード |
| `VITE_API_URL` | `http://localhost:8080` | フロントからのAPI URL（現在未使用、Viteプロキシ経由） |
