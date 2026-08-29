package com.hotel.reservation.service;

import com.hotel.reservation.dto.*;
import com.hotel.reservation.entity.*;
import com.hotel.reservation.exception.BadRequestException;
import com.hotel.reservation.exception.InsufficientStockException;
import com.hotel.reservation.exception.ResourceNotFoundException;
import com.hotel.reservation.exception.UnauthorizedException;
import com.hotel.reservation.repository.*;
import com.hotel.reservation.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockTransactionService {

    private final StockTransactionRepository transactionRepository;
    private final InventoryItemRepository itemRepository;
    private final WarehouseRepository warehouseRepository;
    private final WarehouseLocationRepository locationRepository;
    private final UserRepository userRepository;

    @Autowired
    public StockTransactionService(StockTransactionRepository transactionRepository,
                                   InventoryItemRepository itemRepository,
                                   WarehouseRepository warehouseRepository,
                                   WarehouseLocationRepository locationRepository,
                                   UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.itemRepository = itemRepository;
        this.warehouseRepository = warehouseRepository;
        this.locationRepository = locationRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            return null; // System background / unauthenticated fallback
        }
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        return userRepository.findById(principal.getId()).orElse(null);
    }

    @Transactional
    public StockTransactionResponse recordStockIn(StockInRequest request) {
        InventoryItem item = itemRepository.findById(request.getItemId())
            .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found with id: " + request.getItemId()));

        if (request.getQuantity() <= 0) {
            throw new BadRequestException("Stock-in quantity must be greater than zero");
        }

        Warehouse sourceWarehouse = null;
        if (request.getWarehouseId() != null) {
            sourceWarehouse = warehouseRepository.findById(request.getWarehouseId()).orElse(null);
        }

        WarehouseLocation sourceLocation = null;
        if (request.getLocationId() != null) {
            sourceLocation = locationRepository.findById(request.getLocationId()).orElse(null);
        }

        int newQuantity = item.getQuantity() + request.getQuantity();
        item.setQuantity(newQuantity);
        itemRepository.save(item);

        User user = getCurrentAuthenticatedUser();

        StockTransaction transaction = new StockTransaction(
            item,
            request.getQuantity(),
            TransactionType.STOCK_IN,
            sourceWarehouse != null ? sourceWarehouse : item.getWarehouse(),
            sourceLocation != null ? sourceLocation : item.getLocation(),
            item.getWarehouse(),
            item.getLocation(),
            request.getReason() != null ? request.getReason() : "Regular stock replenishment",
            request.getReferenceId(),
            user,
            newQuantity
        );

        StockTransaction saved = transactionRepository.save(transaction);
        return new StockTransactionResponse(saved);
    }

    @Transactional
    public StockTransactionResponse recordStockOut(StockOutRequest request) {
        InventoryItem item = itemRepository.findById(request.getItemId())
            .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found with id: " + request.getItemId()));

        if (request.getQuantity() <= 0) {
            throw new BadRequestException("Stock-out quantity must be greater than zero");
        }

        if (item.getQuantity() < request.getQuantity()) {
            throw new InsufficientStockException("Insufficient stock for item '" + item.getName() +
                "'. Available: " + item.getQuantity() + " " + item.getUnit() +
                ", Requested: " + request.getQuantity() + " " + item.getUnit());
        }

        int newQuantity = item.getQuantity() - request.getQuantity();
        item.setQuantity(newQuantity);
        itemRepository.save(item);

        User user = getCurrentAuthenticatedUser();

        StockTransaction transaction = new StockTransaction(
            item,
            request.getQuantity(),
            TransactionType.STOCK_OUT,
            item.getWarehouse(),
            item.getLocation(),
            null,
            null,
            request.getReason() != null ? request.getReason() : "General stock issue",
            request.getReferenceId(),
            user,
            newQuantity
        );

        StockTransaction saved = transactionRepository.save(transaction);
        return new StockTransactionResponse(saved);
    }

    @Transactional
    public StockTransactionResponse recordStockTransfer(StockTransferRequest request) {
        InventoryItem item = itemRepository.findById(request.getItemId())
            .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found with id: " + request.getItemId()));

        if (request.getQuantity() <= 0) {
            throw new BadRequestException("Transfer quantity must be greater than zero");
        }

        if (item.getQuantity() < request.getQuantity()) {
            throw new InsufficientStockException("Insufficient stock for transfer. Available: " +
                item.getQuantity() + ", Requested: " + request.getQuantity());
        }

        Warehouse destWarehouse = warehouseRepository.findById(request.getDestWarehouseId())
            .orElseThrow(() -> new ResourceNotFoundException("Destination warehouse not found with id: " + request.getDestWarehouseId()));

        WarehouseLocation destLocation = null;
        if (request.getDestLocationId() != null) {
            destLocation = locationRepository.findById(request.getDestLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination location not found with id: " + request.getDestLocationId()));
        }

        Warehouse sourceWarehouse = item.getWarehouse();
        WarehouseLocation sourceLocation = item.getLocation();

        // Update item warehouse / location
        item.setWarehouse(destWarehouse);
        item.setLocation(destLocation);
        itemRepository.save(item);

        User user = getCurrentAuthenticatedUser();

        StockTransaction transaction = new StockTransaction(
            item,
            request.getQuantity(),
            TransactionType.TRANSFER,
            sourceWarehouse,
            sourceLocation,
            destWarehouse,
            destLocation,
            request.getReason() != null ? request.getReason() : "Warehouse transfer",
            "TRF-" + System.currentTimeMillis(),
            user,
            item.getQuantity()
        );

        StockTransaction saved = transactionRepository.save(transaction);
        return new StockTransactionResponse(saved);
    }

    @Transactional
    public StockTransactionResponse recordStockAdjustment(StockAdjustmentRequest request) {
        InventoryItem item = itemRepository.findById(request.getItemId())
            .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found with id: " + request.getItemId()));

        if (request.getNewQuantity() < 0) {
            throw new BadRequestException("Adjustment quantity cannot be negative");
        }

        int diff = request.getNewQuantity() - item.getQuantity();
        item.setQuantity(request.getNewQuantity());
        itemRepository.save(item);

        User user = getCurrentAuthenticatedUser();

        StockTransaction transaction = new StockTransaction(
            item,
            Math.abs(diff),
            TransactionType.ADJUSTMENT,
            item.getWarehouse(),
            item.getLocation(),
            item.getWarehouse(),
            item.getLocation(),
            request.getReason() != null ? request.getReason() : "Stock audit adjustment",
            "ADJ-" + System.currentTimeMillis(),
            user,
            request.getNewQuantity()
        );

        StockTransaction saved = transactionRepository.save(transaction);
        return new StockTransactionResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<StockTransactionResponse> getAllTransactions() {
        return transactionRepository.findAllByOrderByCreatedAtDesc().stream()
            .map(StockTransactionResponse::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StockTransactionResponse> getTransactionsByItem(Long itemId) {
        return transactionRepository.findByItemIdOrderByCreatedAtDesc(itemId).stream()
            .map(StockTransactionResponse::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StockTransactionResponse> getRecentTransactions() {
        return transactionRepository.findTop10ByOrderByCreatedAtDesc().stream()
            .map(StockTransactionResponse::new)
            .collect(Collectors.toList());
    }
}
