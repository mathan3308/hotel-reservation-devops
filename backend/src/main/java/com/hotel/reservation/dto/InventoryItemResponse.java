package com.hotel.reservation.dto;

import com.hotel.reservation.entity.InventoryItem;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class InventoryItemResponse {
    private Long id;
    private String name;
    private String sku;
    private CategoryResponse category;
    private Integer quantity;
    private Integer minStockLevel;
    private String unit;
    private BigDecimal unitPrice;
    private WarehouseResponse warehouse;
    private WarehouseLocationResponse location;
    private SupplierResponse supplier;
    private Boolean isActive;
    private boolean isLowStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public InventoryItemResponse() {}

    public InventoryItemResponse(InventoryItem item) {
        this.id = item.getId();
        this.name = item.getName();
        this.sku = item.getSku();
        this.category = item.getCategory() != null ? new CategoryResponse(item.getCategory()) : null;
        this.quantity = item.getQuantity();
        this.minStockLevel = item.getMinStockLevel();
        this.unit = item.getUnit();
        this.unitPrice = item.getUnitPrice();
        this.warehouse = item.getWarehouse() != null ? new WarehouseResponse(item.getWarehouse()) : null;
        this.location = item.getLocation() != null ? new WarehouseLocationResponse(item.getLocation()) : null;
        this.supplier = item.getSupplier() != null ? new SupplierResponse(item.getSupplier()) : null;
        this.isActive = item.getIsActive();
        this.isLowStock = item.isLowStock();
        this.createdAt = item.getCreatedAt();
        this.updatedAt = item.getUpdatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public CategoryResponse getCategory() { return category; }
    public void setCategory(CategoryResponse category) { this.category = category; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Integer getMinStockLevel() { return minStockLevel; }
    public void setMinStockLevel(Integer minStockLevel) { this.minStockLevel = minStockLevel; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public WarehouseResponse getWarehouse() { return warehouse; }
    public void setWarehouse(WarehouseResponse warehouse) { this.warehouse = warehouse; }
    public WarehouseLocationResponse getLocation() { return location; }
    public void setLocation(WarehouseLocationResponse location) { this.location = location; }
    public SupplierResponse getSupplier() { return supplier; }
    public void setSupplier(SupplierResponse supplier) { this.supplier = supplier; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }
    public boolean isLowStock() { return isLowStock; }
    public void setLowStock(boolean lowStock) { isLowStock = lowStock; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
