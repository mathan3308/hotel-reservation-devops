package com.hotel.reservation.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class StockTransferRequest {

    @NotNull(message = "Item ID is required")
    private Long itemId;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be greater than zero")
    private Integer quantity;

    @NotNull(message = "Destination warehouse ID is required")
    private Long destWarehouseId;

    private Long destLocationId;
    private String reason;

    public StockTransferRequest() {}

    public StockTransferRequest(Long itemId, Integer quantity, Long destWarehouseId, Long destLocationId, String reason) {
        this.itemId = itemId;
        this.quantity = quantity;
        this.destWarehouseId = destWarehouseId;
        this.destLocationId = destLocationId;
        this.reason = reason;
    }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Long getDestWarehouseId() { return destWarehouseId; }
    public void setDestWarehouseId(Long destWarehouseId) { this.destWarehouseId = destWarehouseId; }
    public Long getDestLocationId() { return destLocationId; }
    public void setDestLocationId(Long destLocationId) { this.destLocationId = destLocationId; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
