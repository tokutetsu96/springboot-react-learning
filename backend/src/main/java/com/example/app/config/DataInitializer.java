package com.example.app.config;

import com.example.app.domain.Category;
import com.example.app.domain.TransactionType;
import com.example.app.domain.User;
import com.example.app.repository.CategoryRepository;
import com.example.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @SuppressWarnings("null")
    public void run(String... args) {
        if (userRepository.count() == 0) {
            userRepository.saveAll(List.of(
                    new User("alice@example.com", "Alice Tanaka"),
                    new User("bob@example.com", "Bob Sato"),
                    new User("carol@example.com", "Carol Yamamoto"),
                    new User("dave@example.com", "Dave Suzuki"),
                    new User("eve@example.com", "Eve Watanabe")));
        }

        if (categoryRepository.count() == 0) {
            categoryRepository.saveAll(List.of(
                    new Category("給与", TransactionType.INCOME),
                    new Category("副業", TransactionType.INCOME),
                    new Category("食費", TransactionType.EXPENSE),
                    new Category("交通費", TransactionType.EXPENSE),
                    new Category("光熱費", TransactionType.EXPENSE),
                    new Category("娯楽費", TransactionType.EXPENSE),
                    new Category("医療費", TransactionType.EXPENSE),
                    new Category("日用品", TransactionType.EXPENSE)));
        }
    }
}
