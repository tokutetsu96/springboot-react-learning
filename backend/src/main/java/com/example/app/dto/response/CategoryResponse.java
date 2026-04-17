package com.example.app.dto.response;

import com.example.app.domain.Category;

public record CategoryResponse(Long id, String name, String type) {

    public static CategoryResponse from(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getType().name());
    }
}
