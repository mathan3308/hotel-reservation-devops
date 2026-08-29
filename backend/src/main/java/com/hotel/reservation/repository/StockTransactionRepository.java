package com.hotel.reservation.repository;

import com.hotel.reservation.entity.StockTransaction;
import com.hotel.reservation.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
    List<StockTransaction> findByItemIdOrderByCreatedAtDesc(Long itemId);
    List<StockTransaction> findByTransactionTypeOrderByCreatedAtDesc(TransactionType transactionType);
    List<StockTransaction> findAllByOrderByCreatedAtDesc();
    List<StockTransaction> findTop10ByOrderByCreatedAtDesc();
    List<StockTransaction> findByReferenceId(String referenceId);
}
