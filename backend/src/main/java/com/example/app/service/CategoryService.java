package com.example.app.service;

import com.example.app.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> findAll();
}
