package com.example.app.service.impl;

import com.example.app.domain.Category;
import com.example.app.domain.Transaction;
import com.example.app.domain.User;
import com.example.app.dto.request.CreateTransactionRequest;
import com.example.app.dto.request.UpdateTransactionRequest;
import com.example.app.dto.response.TransactionResponse;
import com.example.app.exception.ResourceNotFoundException;
import com.example.app.repository.CategoryRepository;
import com.example.app.repository.TransactionRepository;
import com.example.app.repository.UserRepository;
import com.example.app.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public List<TransactionResponse> findAll(Long userId, Integer year, Integer month) {
        if (userId != null && year != null && month != null) {
            return transactionRepository.findByUserAndMonth(userId, year, month).stream()
                    .map(TransactionResponse::from)
                    .toList();
        }
        return transactionRepository.findAll().stream()
                .map(TransactionResponse::from)
                .toList();
    }

    @Override
    public TransactionResponse findById(Long id) {
        return transactionRepository.findById(id)
                .map(TransactionResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));
    }

    @Override
    @Transactional
    public TransactionResponse create(CreateTransactionRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.userId()));
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.categoryId()));

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setCategory(category);
        transaction.setAmount(request.amount());
        transaction.setDescription(request.description());
        transaction.setTransactedOn(request.transactedOn());

        return TransactionResponse.from(transactionRepository.save(transaction));
    }

    @Override
    @Transactional
    public TransactionResponse update(Long id, UpdateTransactionRequest request) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.categoryId()));

        transaction.setCategory(category);
        transaction.setAmount(request.amount());
        transaction.setDescription(request.description());
        transaction.setTransactedOn(request.transactedOn());

        return TransactionResponse.from(transactionRepository.save(transaction));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Transaction", id);
        }
        transactionRepository.deleteById(id);
    }
}
