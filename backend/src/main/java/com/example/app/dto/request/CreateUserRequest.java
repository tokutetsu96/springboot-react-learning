package com.example.app.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
        @NotBlank(message = "メールアドレスは必須です")
        @Email(message = "メールアドレスの形式が正しくありません")
        String email,

        @NotBlank(message = "名前は必須です")
        @Size(min = 1, max = 50, message = "名前は1〜50文字で入力してください")
        String name
) {}
