package com.example.app.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CreateTransactionRequest(
        @NotNull Long userId,
        @NotNull Long categoryId,
        @NotNull @Positive Long amount,
        @Size(max = 255) String description,
        @NotNull LocalDate transactedOn) {
}
