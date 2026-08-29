package com.hotel.reservation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public class InventoryItemRequest {

    @NotBlank(message = "Item name is required")
    private String name;

    @NotBlank(message = "SKU is required")
    private String sku;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "Quantity is required")
    @PositiveOrZero(message = "Quantity cannot be negative")
    private Integer quantity;

    @NotNull(message = "Minimum stock level is required")
    @PositiveOrZero(message = "Minimum stock level cannot be negative")
    private Integer minStockLevel;

    @NotBlank(message = "Unit of measurement is required")
    private String unit; // e.g. "Pieces", "Bottles", "Sets"

    private BigDecimal unitPrice;

    @NotNull(message = "Warehouse ID is required")
    private Long warehouseId;

    private Long locationId;
    private Long supplierId;
    private Boolean isActive = true;

    public InventoryItemRequest() {}

    public InventoryItemRequest(String name, String sku, Long categoryId, Integer quantity,
                                Integer minStockLevel, String unit, BigDecimal unitPrice,
                                Long warehouseId, Long locationId, Long supplierId, Boolean isActive) {
        this.name = name;
        this.sku = sku;
        this.categoryId = categoryId;
        this.quantity = quantity;
        this.minStockLevel = minStockLevel;
        this.unit = unit;
        this.unitPrice = unitPrice;
        this.warehouseId = warehouseId;
        this.locationId = locationId;
        this.supplierId = supplierId;
        this.isActive = isActive != null ? isActive : true;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Integer getMinStockLevel() { return minStockLevel; }
    public void setMinStockLevel(Integer minStockLevel) { this.minStockLevel = minStockLevel; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public Long getWarehouseId() { return warehouseId; }
    public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }
    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }
}
