# APIリファレンス

## ベースURL

```
http://localhost:8080/api
```

フロントエンドからは `/api` でアクセス可能（Viteプロキシ経由）。

---

## ヘルスチェック

### GET /api/health

サーバーの死活確認。

**レスポンス**

```
200 OK
OK
```

---

## ユーザー

### GET /api/users

全ユーザーを取得する。

**レスポンス**

```json
200 OK
[
  {
    "id": 1,
    "email": "alice@example.com",
    "name": "Alice",
    "createdAt": "2026-04-10T12:00:00"
  }
]
```

---

### GET /api/users/{id}

指定したIDのユーザーを取得する。

**パスパラメータ**

| 名前 | 型 | 説明 |
|------|----|------|
| id | Long | ユーザーID |

**レスポンス**

```json
200 OK
{
  "id": 1,
  "email": "alice@example.com",
  "name": "Alice",
  "createdAt": "2026-04-10T12:00:00"
}
```

**エラー**

```json
404 Not Found
{
  "status": 404,
  "message": "ユーザー が見つかりません (id=99)",
  "errors": [],
  "timestamp": "2026-04-10T12:00:00"
}
```

---

### POST /api/users

新しいユーザーを作成する。

**リクエストボディ**

```json
{
  "email": "alice@example.com",
  "name": "Alice"
}
```

| フィールド | 型 | 必須 | バリデーション |
|----------|-----|------|-------------|
| email | string | yes | メール形式 |
| name | string | yes | 1〜50文字 |

**レスポンス**

```json
201 Created
{
  "id": 1,
  "email": "alice@example.com",
  "name": "Alice",
  "createdAt": "2026-04-10T12:00:00"
}
```

**バリデーションエラー**

```json
400 Bad Request
{
  "status": 400,
  "message": "バリデーションエラー",
  "errors": [
    "email: メールアドレスの形式が正しくありません"
  ],
  "timestamp": "2026-04-10T12:00:00"
}
```

---

### DELETE /api/users/{id}

指定したIDのユーザーを削除する。

**パスパラメータ**

| 名前 | 型 | 説明 |
|------|----|------|
| id | Long | ユーザーID |

**レスポンス**

```
204 No Content
```

**エラー**

```json
404 Not Found
{
  "status": 404,
  "message": "ユーザー が見つかりません (id=99)",
  "errors": [],
  "timestamp": "2026-04-10T12:00:00"
}
```

---

## エラーレスポンス共通フォーマット

```json
{
  "status": 400,
  "message": "エラーの概要",
  "errors": ["フィールド別の詳細エラー（バリデーション時のみ）"],
  "timestamp": "2026-04-10T12:00:00"
}
```
