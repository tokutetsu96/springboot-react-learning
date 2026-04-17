package com.example.app.dto.response;

import com.example.app.domain.Transaction;

public record TransactionResponse(
        Long id,
        Long userId,
        CategoryResponse category,
        Long amount,
        String description,
        String transactedOn,
        String createdAt) {

    public static TransactionResponse from(Transaction t) {
        return new TransactionResponse(
                t.getId(),
                t.getUser().getId(),
                CategoryResponse.from(t.getCategory()),
                t.getAmount(),
                t.getDescription(),
                t.getTransactedOn().toString(),
                t.getCreatedAt().toString());
    }
}
