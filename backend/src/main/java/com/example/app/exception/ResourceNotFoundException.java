package com.example.app.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resource, Long id) {
        super("%s が見つかりません (id=%d)".formatted(resource, id));
    }
}
