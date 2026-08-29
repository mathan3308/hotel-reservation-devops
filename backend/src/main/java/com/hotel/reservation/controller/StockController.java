package com.hotel.reservation.controller;

import com.hotel.reservation.dto.*;
import com.hotel.reservation.service.StockTransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
@Tag(name = "Stock Operations", description = "Stock-in, stock-out, transfer, and transaction audit trails")
public class StockController {

    private final StockTransactionService stockService;

    @Autowired
    public StockController(StockTransactionService stockService) {
        this.stockService = stockService;
    }

    @PostMapping("/in")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Record stock-in replenishment")
    public ResponseEntity<ApiResponse<StockTransactionResponse>> recordStockIn(@Valid @RequestBody StockInRequest request) {
        StockTransactionResponse response = stockService.recordStockIn(request);
        return new ResponseEntity<>(ApiResponse.success("Stock received successfully", response), HttpStatus.CREATED);
    }

    @PostMapping("/out")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Record stock-out / usage / consumption")
    public ResponseEntity<ApiResponse<StockTransactionResponse>> recordStockOut(@Valid @RequestBody StockOutRequest request) {
        StockTransactionResponse response = stockService.recordStockOut(request);
        return new ResponseEntity<>(ApiResponse.success("Stock issued successfully", response), HttpStatus.CREATED);
    }

    @PostMapping("/transfer")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Record stock transfer between warehouses or storage locations")
    public ResponseEntity<ApiResponse<StockTransactionResponse>> recordStockTransfer(@Valid @RequestBody StockTransferRequest request) {
        StockTransactionResponse response = stockService.recordStockTransfer(request);
        return new ResponseEntity<>(ApiResponse.success("Stock transferred successfully", response), HttpStatus.CREATED);
    }

    @PostMapping("/adjustment")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Record physical audit stock adjustment (Admin only)")
    public ResponseEntity<ApiResponse<StockTransactionResponse>> recordStockAdjustment(@Valid @RequestBody StockAdjustmentRequest request) {
        StockTransactionResponse response = stockService.recordStockAdjustment(request);
        return new ResponseEntity<>(ApiResponse.success("Stock adjusted successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/transactions")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get all inventory transaction history")
    public ResponseEntity<ApiResponse<List<StockTransactionResponse>>> getAllTransactions() {
        return ResponseEntity.ok(ApiResponse.success(stockService.getAllTransactions()));
    }

    @GetMapping("/transactions/recent")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get 10 most recent stock movements")
    public ResponseEntity<ApiResponse<List<StockTransactionResponse>>> getRecentTransactions() {
        return ResponseEntity.ok(ApiResponse.success(stockService.getRecentTransactions()));
    }

    @GetMapping("/transactions/item/{itemId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get transaction history for a specific item")
    public ResponseEntity<ApiResponse<List<StockTransactionResponse>>> getTransactionsByItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(ApiResponse.success(stockService.getTransactionsByItem(itemId)));
    }
}
