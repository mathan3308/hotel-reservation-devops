package com.hotel.reservation.dto;

import com.hotel.reservation.entity.StockTransaction;
import com.hotel.reservation.entity.TransactionType;
import java.time.LocalDateTime;

public class StockTransactionResponse {
    private Long id;
    private Long itemId;
    private String itemName;
    private String itemSku;
    private Integer quantity;
    private TransactionType transactionType;
    private String sourceWarehouseName;
    private String sourceLocationCode;
    private String destWarehouseName;
    private String destLocationCode;
    private String reason;
    private String referenceId;
    private String performedBy;
    private Integer balanceAfter;
    private LocalDateTime createdAt;

    public StockTransactionResponse() {}

    public StockTransactionResponse(StockTransaction st) {
        this.id = st.getId();
        if (st.getItem() != null) {
            this.itemId = st.getItem().getId();
            this.itemName = st.getItem().getName();
            this.itemSku = st.getItem().getSku();
        }
        this.quantity = st.getQuantity();
        this.transactionType = st.getTransactionType();
        if (st.getSourceWarehouse() != null) {
            this.sourceWarehouseName = st.getSourceWarehouse().getName();
        }
        if (st.getSourceLocation() != null) {
            this.sourceLocationCode = st.getSourceLocation().getCode();
        }
        if (st.getDestWarehouse() != null) {
            this.destWarehouseName = st.getDestWarehouse().getName();
        }
        if (st.getDestLocation() != null) {
            this.destLocationCode = st.getDestLocation().getCode();
        }
        this.reason = st.getReason();
        this.referenceId = st.getReferenceId();
        if (st.getUser() != null) {
            this.performedBy = st.getUser().getFullName() != null ? st.getUser().getFullName() : st.getUser().getUsername();
        }
        this.balanceAfter = st.getBalanceAfter();
        this.createdAt = st.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public String getItemSku() { return itemSku; }
    public void setItemSku(String itemSku) { this.itemSku = itemSku; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public TransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }
    public String getSourceWarehouseName() { return sourceWarehouseName; }
    public void setSourceWarehouseName(String sourceWarehouseName) { this.sourceWarehouseName = sourceWarehouseName; }
    public String getSourceLocationCode() { return sourceLocationCode; }
    public void setSourceLocationCode(String sourceLocationCode) { this.sourceLocationCode = sourceLocationCode; }
    public String getDestWarehouseName() { return destWarehouseName; }
    public void setDestWarehouseName(String destWarehouseName) { this.destWarehouseName = destWarehouseName; }
    public String getDestLocationCode() { return destLocationCode; }
    public void setDestLocationCode(String destLocationCode) { this.destLocationCode = destLocationCode; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }
    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }
    public Integer getBalanceAfter() { return balanceAfter; }
    public void setBalanceAfter(Integer balanceAfter) { this.balanceAfter = balanceAfter; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
