package com.example.app.service.impl;

import com.example.app.domain.Todo;
import com.example.app.dto.request.CreateTodoRequest;
import com.example.app.dto.request.UpdateTodoRequest;
import com.example.app.dto.response.TodoResponse;
import com.example.app.exception.ResourceNotFoundException;
import com.example.app.repository.TodoRepository;
import com.example.app.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;

    @Override
    public List<TodoResponse> findAll() {
        return todoRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(TodoResponse::from)
                .toList();
    }

    @Override
    public TodoResponse findById(@NonNull Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TODO", id));
        return TodoResponse.from(todo);
    }

    @Override
    @Transactional
    public TodoResponse create(CreateTodoRequest request) {
        Todo todo = new Todo(request.title());
        return TodoResponse.from(todoRepository.save(todo));
    }

    @Override
    @Transactional
    public TodoResponse update(@NonNull Long id, UpdateTodoRequest request) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TODO", id));
        todo.setTitle(request.title());
        todo.setCompleted(request.completed());
        return TodoResponse.from(todo);
    }

    @Override
    @Transactional
    public void delete(@NonNull Long id) {
        if (!todoRepository.existsById(id)) {
            throw new ResourceNotFoundException("TODO", id);
        }
        todoRepository.deleteById(id);
    }
}
