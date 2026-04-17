package com.example.app.service;

import com.example.app.dto.request.CreateTransactionRequest;
import com.example.app.dto.request.UpdateTransactionRequest;
import com.example.app.dto.response.TransactionResponse;

import java.util.List;

public interface TransactionService {
    List<TransactionResponse> findAll(Long userId, Integer year, Integer month);
    TransactionResponse findById(Long id);
    TransactionResponse create(CreateTransactionRequest request);
    TransactionResponse update(Long id, UpdateTransactionRequest request);
    void delete(Long id);
}
