package com.example.app.service;

import com.example.app.dto.request.CreateTodoRequest;
import com.example.app.dto.request.UpdateTodoRequest;
import com.example.app.dto.response.TodoResponse;
import org.springframework.lang.NonNull;

import java.util.List;

public interface TodoService {
    List<TodoResponse> findAll();
    TodoResponse findById(@NonNull Long id);
    TodoResponse create(CreateTodoRequest request);
    TodoResponse update(@NonNull Long id, UpdateTodoRequest request);
    void delete(@NonNull Long id);
}
