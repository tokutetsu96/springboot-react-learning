package com.example.app.service;

import com.example.app.dto.request.CreateUserRequest;
import com.example.app.dto.response.UserResponse;

import java.util.List;

public interface UserService {

    List<UserResponse> findAll();

    UserResponse findById(Long id);

    UserResponse create(CreateUserRequest request);

    void delete(Long id);
}
