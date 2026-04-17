package com.example.app.service;

import com.example.app.dto.response.CategorySummaryResponse;
import com.example.app.dto.response.MonthlySummaryResponse;

import java.util.List;

public interface SummaryService {
    MonthlySummaryResponse getMonthlySummary(Long userId, int year, int month);
    List<CategorySummaryResponse> getCategorySummary(Long userId, int year, int month);
}
