package com.hotel.reservation.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class StockAdjustmentRequest {

    @NotNull(message = "Item ID is required")
    private Long itemId;

    @NotNull(message = "New quantity is required")
    @PositiveOrZero(message = "Quantity cannot be negative")
    private Integer newQuantity;

    private String reason;

    public StockAdjustmentRequest() {}

    public StockAdjustmentRequest(Long itemId, Integer newQuantity, String reason) {
        this.itemId = itemId;
        this.newQuantity = newQuantity;
        this.reason = reason;
    }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    public Integer getNewQuantity() { return newQuantity; }
    public void setNewQuantity(Integer newQuantity) { this.newQuantity = newQuantity; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
