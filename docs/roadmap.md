# 家計簿管理アプリ 実装ロードマップ

## アプリ概要

収入・支出を登録・管理し、カテゴリ別の集計や月次サマリーを確認できる家計簿アプリ。
既存の User CRUD をベースに、段階的に機能を追加していく。

---

## フェーズ一覧

| フェーズ | テーマ | 習得スキル |
|--------|--------|----------|
| 1 | DBスキーマ設計とエンティティ実装 | JPA リレーション、スキーマ設計 |
| 2 | 収支CRUD API の実装 | REST設計、Bean Validation、DTO |
| 3 | 集計・検索 API の実装 | JPQL/QueryDSL、クエリ設計 |
| 4 | フロントエンド基盤構築 | React コンポーネント分割、API連携 |
| 5 | 収支一覧・登録 UI の実装 | フォーム、バリデーション、状態管理 |
| 6 | 集計・グラフ UI の実装 | データ可視化、月次ビュー |
| 7 | 仕上げ・リファクタリング | テスト、コード品質 |

---

## フェーズ 1: DBスキーマ設計とエンティティ実装

### 目標
家計簿に必要なテーブルを設計し、JPA エンティティとして実装する。

### テーブル設計

```
categories（カテゴリ）
  id          BIGSERIAL PK
  name        VARCHAR(50) NOT NULL
  type        VARCHAR(10) NOT NULL  -- 'INCOME' or 'EXPENSE'
  created_at  TIMESTAMP

transactions（収支）
  id              BIGSERIAL PK
  user_id         BIGINT FK → users.id
  category_id     BIGINT FK → categories.id
  amount          BIGINT NOT NULL     -- 金額（円）
  description     VARCHAR(255)
  transacted_on   DATE NOT NULL       -- 収支発生日
  created_at      TIMESTAMP
  updated_at      TIMESTAMP
```

### 実装手順

**Step 1-1: Category エンティティの作成**
```
backend/src/main/java/com/example/app/domain/Category.java
```
- `@Entity @Table(name = "categories")`
- `type` フィールドは `enum TransactionType { INCOME, EXPENSE }` を定義して `@Enumerated(EnumType.STRING)` で永続化
- `@OneToMany(mappedBy = "category")` で Transaction との関連を持つ

**Step 1-2: Transaction エンティティの作成**
```
backend/src/main/java/com/example/app/domain/Transaction.java
```
- `@ManyToOne @JoinColumn(name = "user_id")` で User と関連付け
- `@ManyToOne @JoinColumn(name = "category_id")` で Category と関連付け
- `transactedOn` は `LocalDate` 型

**Step 1-3: 初期データの投入**
```
backend/src/main/java/com/example/app/config/DataInitializer.java
```
既存の `DataInitializer` に Category の初期データ（食費・交通費・給与など）を追加する。

### 学習ポイント
- `@ManyToOne` / `@OneToMany` の双方向リレーション
- `FetchType.LAZY` vs `EAGER` の違いと N+1 問題
- `@Enumerated(EnumType.STRING)` を使う理由（数値より可読性・安全性が高い）

---

## フェーズ 2: 収支CRUD API の実装

### 目標
収支（Transaction）の CRUD エンドポイントを実装する。

### 実装するエンドポイント

| メソッド | パス | 説明 |
|--------|------|------|
| GET | `/api/transactions` | 収支一覧（クエリパラメータでフィルタ可能） |
| GET | `/api/transactions/{id}` | 収支詳細 |
| POST | `/api/transactions` | 収支登録 |
| PUT | `/api/transactions/{id}` | 収支更新 |
| DELETE | `/api/transactions/{id}` | 収支削除 |
| GET | `/api/categories` | カテゴリ一覧 |

### 実装手順

**Step 2-1: Repository の作成**
```
backend/src/main/java/com/example/app/repository/TransactionRepository.java
backend/src/main/java/com/example/app/repository/CategoryRepository.java
```

**Step 2-2: DTO の定義**
```
dto/request/CreateTransactionRequest.java  -- POST用
dto/request/UpdateTransactionRequest.java  -- PUT用
dto/response/TransactionResponse.java
dto/response/CategoryResponse.java
```

`CreateTransactionRequest` のバリデーション例:
```java
public record CreateTransactionRequest(
    @NotNull Long userId,
    @NotNull Long categoryId,
    @NotNull @Positive Long amount,
    @Size(max = 255) String description,
    @NotNull LocalDate transactedOn
) {}
```

**Step 2-3: Service / ServiceImpl の作成**
```
service/TransactionService.java
service/impl/TransactionServiceImpl.java
service/CategoryService.java
service/impl/CategoryServiceImpl.java
```

**Step 2-4: Controller の作成**
```
controller/TransactionController.java
controller/CategoryController.java
```

### 学習ポイント
- PUT（全フィールド更新）と PATCH（部分更新）の使い分け
- `@RequestParam` によるクエリパラメータの受け取り方
- ネストしたエンティティを含むレスポンスの DTO 設計

---

## フェーズ 3: 集計・検索 API の実装

### 目標
月次サマリーやカテゴリ別集計のクエリを実装する。

### 実装するエンドポイント

| メソッド | パス | 説明 |
|--------|------|------|
| GET | `/api/transactions?userId=1&year=2026&month=4` | 月別収支一覧 |
| GET | `/api/summary?userId=1&year=2026&month=4` | 月次サマリー（収入合計・支出合計・残高） |
| GET | `/api/summary/category?userId=1&year=2026&month=4` | カテゴリ別集計 |

### レスポンス例（月次サマリー）

```json
{
  "year": 2026,
  "month": 4,
  "totalIncome": 250000,
  "totalExpense": 130000,
  "balance": 120000
}
```

### 実装手順

**Step 3-1: TransactionRepository にカスタムクエリを追加**

```java
// JPQL で月別・ユーザー別に絞り込み
@Query("""
    SELECT t FROM Transaction t
    WHERE t.user.id = :userId
      AND YEAR(t.transactedOn) = :year
      AND MONTH(t.transactedOn) = :month
    ORDER BY t.transactedOn DESC
""")
List<Transaction> findByUserAndMonth(
    @Param("userId") Long userId,
    @Param("year") int year,
    @Param("month") int month
);
```

**Step 3-2: 集計クエリの実装**

```java
@Query("""
    SELECT SUM(t.amount) FROM Transaction t
    WHERE t.user.id = :userId
      AND t.category.type = :type
      AND YEAR(t.transactedOn) = :year
      AND MONTH(t.transactedOn) = :month
""")
Long sumByUserAndTypeAndMonth(...);
```

**Step 3-3: SummaryController / SummaryService の作成**

```
controller/SummaryController.java
service/SummaryService.java
service/impl/SummaryServiceImpl.java
dto/response/MonthlySummaryResponse.java
dto/response/CategorySummaryResponse.java
```

### 学習ポイント
- JPQL の `YEAR()` / `MONTH()` 関数の使い方
- Spring Data JPA の `@Query` と名前付きパラメータ `@Param`
- 集計結果を専用レスポンス DTO にマッピングする設計

---

## フェーズ 4: フロントエンド基盤構築

### 目標
`App.tsx` の1ファイル構成から、コンポーネント分割・ページルーティング構成に移行する。

### 導入するライブラリ

```bash
npm install react-router-dom
npm install axios
```

### ディレクトリ構成（目標）

```
src/
├── api/              # API クライアント関数
│   ├── client.ts     # axios インスタンス設定
│   ├── transactions.ts
│   └── categories.ts
├── components/       # 再利用可能な UI パーツ
│   ├── Layout.tsx
│   └── LoadingSpinner.tsx
├── pages/            # ページコンポーネント
│   ├── TransactionListPage.tsx
│   ├── TransactionFormPage.tsx
│   └── SummaryPage.tsx
├── types/            # TypeScript 型定義
│   └── index.ts
├── App.tsx           # ルーティング定義のみ
└── main.tsx
```

### 実装手順

**Step 4-1: 型定義ファイルの作成**
```typescript
// src/types/index.ts
export type TransactionType = 'INCOME' | 'EXPENSE';

export type Category = {
  id: number;
  name: string;
  type: TransactionType;
};

export type Transaction = {
  id: number;
  userId: number;
  category: Category;
  amount: number;
  description: string | null;
  transactedOn: string; // ISO形式: "2026-04-11"
  createdAt: string;
};

export type MonthlySummary = {
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
};
```

**Step 4-2: axios クライアントの設定**
```typescript
// src/api/client.ts
import axios from 'axios';

export const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});
```

**Step 4-3: React Router でルーティング設定**
```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TransactionListPage />} />
        <Route path="/transactions/new" element={<TransactionFormPage />} />
        <Route path="/summary" element={<SummaryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 学習ポイント
- `useEffect` + `useState` による API データ取得パターン
- axios のインターセプターによるエラーハンドリング
- React Router v6 の `Routes` / `Route` / `Link` の使い方

---

## フェーズ 5: 収支一覧・登録 UI の実装

### 目標
収支の一覧表示・新規登録フォームを実装する。

### 実装手順

**Step 5-1: 収支一覧ページ**
```tsx
// src/pages/TransactionListPage.tsx
```
- 月選択（年・月のセレクトボックス）
- 収支リスト表示（日付・カテゴリ・金額・説明）
- 収入は青、支出は赤で色分け
- 削除ボタン

**Step 5-2: 収支登録フォーム**
```tsx
// src/pages/TransactionFormPage.tsx
```
- カテゴリをセレクトボックスで選択（`/api/categories` から取得）
- 金額・日付・説明の入力
- フロントエンドバリデーション（金額が正の整数か、日付が未来でないか）
- 登録後に一覧ページへリダイレクト

### 学習ポイント
- `useState` で制御コンポーネント（Controlled Component）のフォームを実装
- `useNavigate` でページ遷移
- API エラーをユーザーに見せるための状態管理パターン

---

## フェーズ 6: 集計・グラフ UI の実装

### 目標
月次サマリーとカテゴリ別集計をグラフで表示する。

### 導入するライブラリ

```bash
npm install recharts
```

### 実装手順

**Step 6-1: 月次サマリーカード**
```tsx
// src/pages/SummaryPage.tsx
```
- 収入合計・支出合計・残高を3枚のカードで表示
- 月選択で切り替え可能

**Step 6-2: カテゴリ別円グラフ**
- `recharts` の `PieChart` でカテゴリ別支出割合を表示

**Step 6-3: 月別収支棒グラフ**
- 過去6ヶ月分の収入・支出を棒グラフで比較表示
- バックエンドに複数月分のサマリーを返すエンドポイントを追加

### 学習ポイント
- recharts の `PieChart` / `BarChart` の基本的な使い方
- 複数 API を並列で呼ぶ `Promise.all` パターン

---

## フェーズ 7: 仕上げ・リファクタリング

### 目標
テストを書き、コード品質を高めて完成度を上げる。

### バックエンドテスト

**Step 7-1: Service 単体テスト**
```
backend/src/test/java/com/example/app/service/TransactionServiceTest.java
```
- `@ExtendWith(MockitoExtension.class)` で Repository をモック化
- 正常系・異常系（存在しないID）のテストを書く

**Step 7-2: Controller 統合テスト**
```
backend/src/test/java/com/example/app/controller/TransactionControllerTest.java
```
- `@SpringBootTest` + `@AutoConfigureMockMvc` でリクエスト〜レスポンスを検証
- バリデーションエラーのレスポンス形式も確認

### フロントエンド改善

**Step 7-3: カスタムフックへの切り出し**
```typescript
// src/hooks/useTransactions.ts
// フェッチ・ローディング・エラー状態をまとめて管理
```

**Step 7-4: エラーバウンダリの追加**
- API エラー時に意味のあるメッセージを表示する

### 学習ポイント
- Mockito の `when(...).thenReturn(...)` パターン
- `@Valid` のバリデーションが Controller テストで動作することを確認
- カスタムフックで「データ取得ロジック」と「表示ロジック」を分離する意義

---

## 参考: 最終的なAPIエンドポイント一覧

| メソッド | パス | 説明 |
|--------|------|------|
| GET | `/api/categories` | カテゴリ一覧 |
| GET | `/api/transactions` | 収支一覧（`?userId=&year=&month=`） |
| GET | `/api/transactions/{id}` | 収支詳細 |
| POST | `/api/transactions` | 収支登録 |
| PUT | `/api/transactions/{id}` | 収支更新 |
| DELETE | `/api/transactions/{id}` | 収支削除 |
| GET | `/api/summary` | 月次サマリー（`?userId=&year=&month=`） |
| GET | `/api/summary/category` | カテゴリ別集計（`?userId=&year=&month=`） |
