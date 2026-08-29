package com.hotel.reservation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_transactions")
public class StockTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "item_id", nullable = false)
    private InventoryItem item;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 20)
    private TransactionType transactionType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "source_warehouse_id")
    private Warehouse sourceWarehouse;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "source_location_id")
    private WarehouseLocation sourceLocation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dest_warehouse_id")
    private Warehouse destWarehouse;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dest_location_id")
    private WarehouseLocation destLocation;

    @Column(length = 255)
    private String reason;

    @Column(name = "reference_id", length = 100)
    private String referenceId; // e.g. "RES-2026-00001" or "PO-9923"

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "balance_after")
    private Integer balanceAfter;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public StockTransaction() {}

    public StockTransaction(InventoryItem item, Integer quantity, TransactionType transactionType,
                            Warehouse sourceWarehouse, WarehouseLocation sourceLocation,
                            Warehouse destWarehouse, WarehouseLocation destLocation,
                            String reason, String referenceId, User user, Integer balanceAfter) {
        this.item = item;
        this.quantity = quantity;
        this.transactionType = transactionType;
        this.sourceWarehouse = sourceWarehouse;
        this.sourceLocation = sourceLocation;
        this.destWarehouse = destWarehouse;
        this.destLocation = destLocation;
        this.reason = reason;
        this.referenceId = referenceId;
        this.user = user;
        this.balanceAfter = balanceAfter;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public InventoryItem getItem() {
        return item;
    }

    public void setItem(InventoryItem item) {
        this.item = item;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public Warehouse getSourceWarehouse() {
        return sourceWarehouse;
    }

    public void setSourceWarehouse(Warehouse sourceWarehouse) {
        this.sourceWarehouse = sourceWarehouse;
    }

    public WarehouseLocation getSourceLocation() {
        return sourceLocation;
    }

    public void setSourceLocation(WarehouseLocation sourceLocation) {
        this.sourceLocation = sourceLocation;
    }

    public Warehouse getDestWarehouse() {
        return destWarehouse;
    }

    public void setDestWarehouse(Warehouse destWarehouse) {
        this.destWarehouse = destWarehouse;
    }

    public WarehouseLocation getDestLocation() {
        return destLocation;
    }

    public void setDestLocation(WarehouseLocation destLocation) {
        this.destLocation = destLocation;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getBalanceAfter() {
        return balanceAfter;
    }

    public void setBalanceAfter(Integer balanceAfter) {
        this.balanceAfter = balanceAfter;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
