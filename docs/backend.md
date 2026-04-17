# バックエンド構成・ベストプラクティス

## ディレクトリ構成

```text
backend/src/main/java/com/example/app/
├── Application.java                         # エントリーポイント
├── config/
│   └── CorsConfig.java                      # CORS設定
├── controller/
│   ├── HealthController.java                # ヘルスチェック
│   └── UserController.java                  # ユーザーAPI
├── domain/
│   └── User.java                            # JPAエンティティ
├── dto/
│   ├── request/
│   │   └── CreateUserRequest.java           # リクエストDTO
│   └── response/
│       └── UserResponse.java                # レスポンスDTO
├── exception/
│   ├── ErrorResponse.java                   # エラーレスポンス
│   ├── GlobalExceptionHandler.java          # 例外ハンドラー
│   └── ResourceNotFoundException.java       # カスタム例外
├── repository/
│   └── UserRepository.java                  # JpaRepository
└── service/
    ├── UserService.java                     # サービスインターフェース
    └── impl/
        └── UserServiceImpl.java             # サービス実装
```

## ベストプラクティス

### 1. DTOにJava Recordsを使用

エンティティを直接APIに公開せず、イミュータブルなRecordでDTOを定義する。

```java
// リクエストDTO: Bean Validationアノテーション付き
public record CreateUserRequest(
    @NotBlank @Email String email,
    @NotBlank @Size(max = 50) String name
) {}

// レスポンスDTO: ファクトリメソッドでエンティティから変換
public record UserResponse(Long id, String email, String name, LocalDateTime createdAt) {
    public static UserResponse from(User user) { ... }
}
```

#### 採用理由: DTOの利用

- エンティティの内部構造をAPIに漏らさない
- 循環参照・遅延ロード問題を回避
- APIの入出力を明示的に定義できる

### 2. Serviceはインターフェース + 実装に分離

```java
// インターフェース
public interface UserService {
    UserResponse create(CreateUserRequest request);
}

// 実装
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService { ... }
```

#### 採用理由: インターフェースの分離

- テスト時にMockに差し替えやすい
- 将来的な実装の切り替えが容易

### 3. トランザクション管理

```java
@Transactional(readOnly = true)   // クラスレベル: 読み取り専用
public class UserServiceImpl {

    @Transactional                // メソッドレベル: 書き込みのみ上書き
    public UserResponse create(...) { ... }
}
```

#### 採用理由: パフォーマンス向上

- `readOnly = true` で不要なflushを抑制しパフォーマンス向上
- 書き込み処理のみ明示的に `@Transactional` を付与

### 4. グローバル例外ハンドリング

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(...) { ... }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(...) { ... }
}
```

#### 採用理由: ボイラープレート削減

- Controllerに try-catch を書かずに済む
- エラーレスポンス形式を統一できる

### 5. 依存注入はコンストラクタインジェクション

```java
@RequiredArgsConstructor           // Lombokでコンストラクタ自動生成
public class UserServiceImpl {
    private final UserRepository userRepository;  // finalで不変
}
```

#### 採用理由: null安全の確保

- `@Autowired` フィールドインジェクションはテストが困難
- `final` により実行時のnull安全性が保証される

### 6. エンティティ設計

```java
@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp  // INSERT時に自動設定
    private LocalDateTime createdAt;

    @UpdateTimestamp    // UPDATE時に自動更新
    private LocalDateTime updatedAt;
}
```

#### 採用理由: 自動管理の利便性

- `@CreationTimestamp` / `@UpdateTimestamp` で監査フィールドを自動管理
- `@NoArgsConstructor` はJPAの要件

## 依存ライブラリ

| ライブラリ | 用途 |
| --------- | ---- |
| spring-boot-starter-web | REST API |
| spring-boot-starter-data-jpa | ORM・DB操作 |
| spring-boot-starter-validation | Bean Validation |
| postgresql | PostgreSQLドライバ |
| spring-boot-devtools | ホットリロード |
| lombok | ボイラープレート削減 |
