package com.example.app.service.impl;

import com.example.app.domain.TransactionType;
import com.example.app.dto.response.CategorySummaryResponse;
import com.example.app.dto.response.MonthlySummaryResponse;
import com.example.app.repository.TransactionRepository;
import com.example.app.service.SummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SummaryServiceImpl implements SummaryService {

    private final TransactionRepository transactionRepository;

    @Override
    public MonthlySummaryResponse getMonthlySummary(Long userId, int year, int month) {
        Long income = transactionRepository.sumByUserAndTypeAndMonth(userId, TransactionType.INCOME, year, month);
        Long expense = transactionRepository.sumByUserAndTypeAndMonth(userId, TransactionType.EXPENSE, year, month);
        long totalIncome = income != null ? income : 0L;
        long totalExpense = expense != null ? expense : 0L;
        return new MonthlySummaryResponse(year, month, totalIncome, totalExpense, totalIncome - totalExpense);
    }

    @Override
    public List<CategorySummaryResponse> getCategorySummary(Long userId, int year, int month) {
        List<Object[]> expenseRows = transactionRepository.sumByCategoryAndTypeAndMonth(
                userId, TransactionType.EXPENSE, year, month);
        return expenseRows.stream()
                .map(row -> new CategorySummaryResponse((String) row[0], (Long) row[1]))
                .toList();
    }
}
