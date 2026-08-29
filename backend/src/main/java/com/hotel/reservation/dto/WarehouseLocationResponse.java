package com.hotel.reservation.dto;

import com.hotel.reservation.entity.WarehouseLocation;
import java.time.LocalDateTime;

public class WarehouseLocationResponse {
    private Long id;
    private Long warehouseId;
    private String warehouseName;
    private String warehouseCode;
    private String code;
    private String description;
    private LocalDateTime createdAt;

    public WarehouseLocationResponse() {}
    public WarehouseLocationResponse(WarehouseLocation loc) {
        this.id = loc.getId();
        if (loc.getWarehouse() != null) {
            this.warehouseId = loc.getWarehouse().getId();
            this.warehouseName = loc.getWarehouse().getName();
            this.warehouseCode = loc.getWarehouse().getCode();
        }
        this.code = loc.getCode();
        this.description = loc.getDescription();
        this.createdAt = loc.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getWarehouseId() { return warehouseId; }
    public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
    public String getWarehouseName() { return warehouseName; }
    public void setWarehouseName(String warehouseName) { this.warehouseName = warehouseName; }
    public String getWarehouseCode() { return warehouseCode; }
    public void setWarehouseCode(String warehouseCode) { this.warehouseCode = warehouseCode; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
