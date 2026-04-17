package com.example.app.dto.response;

public record MonthlySummaryResponse(
        int year,
        int month,
        long totalIncome,
        long totalExpense,
        long balance) {
}
