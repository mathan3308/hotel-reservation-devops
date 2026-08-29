package com.hotel.reservation.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class StockInRequest {
    @NotNull(message = "Item ID is required")
    private Long itemId;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be greater than zero")
    private Integer quantity;

    private Long warehouseId;
    private Long locationId;
    private String reason;
    private String referenceId; // e.g. PO number

    public StockInRequest() {}
    public StockInRequest(Long itemId, Integer quantity, Long warehouseId, Long locationId, String reason, String referenceId) {
        this.itemId = itemId;
        this.quantity = quantity;
        this.warehouseId = warehouseId;
        this.locationId = locationId;
        this.reason = reason;
        this.referenceId = referenceId;
    }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Long getWarehouseId() { return warehouseId; }
    public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }
}
