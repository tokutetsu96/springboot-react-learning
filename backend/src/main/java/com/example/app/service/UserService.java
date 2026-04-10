package com.example.app.service;

import com.example.app.dto.request.CreateUserRequest;
import com.example.app.dto.response.UserResponse;
import org.springframework.lang.NonNull;

import java.util.List;

public interface UserService {

    List<UserResponse> findAll();

    UserResponse findById(@NonNull Long id);

    UserResponse create(CreateUserRequest request);

    void delete(@NonNull Long id);
}
