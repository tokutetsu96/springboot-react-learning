# Docker環境構築

## サービス構成

| サービス | イメージ | ポート | 役割 |
|--------|--------|------|------|
| postgres | postgres:16-alpine | 5432 | データベース |
| backend | (ローカルビルド) | 8080 | Spring Boot API |
| frontend | (ローカルビルド) | 5173 | React開発サーバー |

## セットアップ

```bash
# 1. 環境変数ファイルを作成
cp .env.example .env

# 2. 全サービスをビルド・起動
docker compose up --build

# 3. バックグラウンドで起動する場合
docker compose up --build -d
```

## 主なコマンド

```bash
# ログ確認
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# 特定サービスを再ビルド
docker compose up --build backend

# 全サービス停止
docker compose down

# ボリュームも含めて完全削除（DBデータも消える）
docker compose down -v

# コンテナ内でコマンド実行
docker compose exec backend sh
docker compose exec postgres psql -U appuser -d appdb
```

## ボリューム

| ボリューム名 | マウント先 | 用途 |
|------------|---------|------|
| postgres_data | /var/lib/postgresql/data | DBデータの永続化 |
| maven_cache | /root/.m2 | Mavenキャッシュ (2回目以降の起動を高速化) |
| node_modules | /app/node_modules | npmパッケージキャッシュ |

## 環境変数

`.env` ファイルで以下を設定できる。

```env
POSTGRES_DB=appdb
POSTGRES_USER=appuser
POSTGRES_PASSWORD=apppassword
```

## バックエンドのDockerfile

開発環境では `mvn spring-boot:run` で直接起動する。
ソースコードはボリュームマウント (`./backend:/app`) でコンテナと同期される。

```
./backend:/app          ← ソースコードのバインドマウント
maven_cache:/root/.m2   ← 依存関係キャッシュ
```

`spring-boot-devtools` によりソース変更時に自動再起動する。
