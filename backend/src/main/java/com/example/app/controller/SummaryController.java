package com.example.app.controller;

import com.example.app.dto.response.CategorySummaryResponse;
import com.example.app.dto.response.MonthlySummaryResponse;
import com.example.app.service.SummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/summary")
@RequiredArgsConstructor
public class SummaryController {

    private final SummaryService summaryService;

    @GetMapping
    public ResponseEntity<MonthlySummaryResponse> getMonthlySummary(
            @RequestParam Long userId,
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(summaryService.getMonthlySummary(userId, year, month));
    }

    @GetMapping("/category")
    public ResponseEntity<List<CategorySummaryResponse>> getCategorySummary(
            @RequestParam Long userId,
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(summaryService.getCategorySummary(userId, year, month));
    }
}
