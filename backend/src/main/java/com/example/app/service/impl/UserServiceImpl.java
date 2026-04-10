package com.example.app.service.impl;

import com.example.app.domain.User;
import com.example.app.dto.request.CreateUserRequest;
import com.example.app.dto.response.UserResponse;
import com.example.app.exception.ResourceNotFoundException;
import com.example.app.repository.UserRepository;
import com.example.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream()
                .map(UserResponse::from)
                .toList();
    }

    @Override
    public UserResponse findById(@NonNull Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ユーザー", id));
        return UserResponse.from(user);
    }

    @Override
    @Transactional
    public UserResponse create(CreateUserRequest request) {
        User user = new User(request.email(), request.name());
        return UserResponse.from(userRepository.save(user));
    }

    @Override
    @Transactional
    public void delete(@NonNull Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("ユーザー", id);
        }
        userRepository.deleteById(id);
    }
}
