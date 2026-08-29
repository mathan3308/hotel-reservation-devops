package com.hotel.reservation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class WarehouseLocationRequest {
    @NotNull(message = "Warehouse ID is required")
    private Long warehouseId;

    @NotBlank(message = "Location code is required")
    private String code;

    private String description;

    public WarehouseLocationRequest() {}
    public WarehouseLocationRequest(Long warehouseId, String code, String description) {
        this.warehouseId = warehouseId;
        this.code = code;
        this.description = description;
    }

    public Long getWarehouseId() { return warehouseId; }
    public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
