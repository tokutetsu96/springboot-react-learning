package com.example.app.repository;

import com.example.app.domain.Transaction;
import com.example.app.domain.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("""
            SELECT t FROM Transaction t
            WHERE t.user.id = :userId
              AND YEAR(t.transactedOn) = :year
              AND MONTH(t.transactedOn) = :month
            ORDER BY t.transactedOn DESC
            """)
    List<Transaction> findByUserAndMonth(
            @Param("userId") Long userId,
            @Param("year") int year,
            @Param("month") int month);

    @Query("""
            SELECT SUM(t.amount) FROM Transaction t
            WHERE t.user.id = :userId
              AND t.category.type = :type
              AND YEAR(t.transactedOn) = :year
              AND MONTH(t.transactedOn) = :month
            """)
    Long sumByUserAndTypeAndMonth(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("year") int year,
            @Param("month") int month);

    @Query("""
            SELECT t.category.name, SUM(t.amount) FROM Transaction t
            WHERE t.user.id = :userId
              AND t.category.type = :type
              AND YEAR(t.transactedOn) = :year
              AND MONTH(t.transactedOn) = :month
            GROUP BY t.category.name
            """)
    List<Object[]> sumByCategoryAndTypeAndMonth(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("year") int year,
            @Param("month") int month);
}
