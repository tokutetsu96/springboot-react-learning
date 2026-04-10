package com.example.app.config;

import com.example.app.domain.User;
import com.example.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    @SuppressWarnings("null")
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        userRepository.saveAll(List.of(
                new User("alice@example.com", "Alice Tanaka"),
                new User("bob@example.com", "Bob Sato"),
                new User("carol@example.com", "Carol Yamamoto"),
                new User("dave@example.com", "Dave Suzuki"),
                new User("eve@example.com", "Eve Watanabe")
        ));
    }
}
