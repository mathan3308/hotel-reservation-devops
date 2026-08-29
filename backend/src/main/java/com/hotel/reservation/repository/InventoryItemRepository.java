package com.hotel.reservation.repository;

import com.hotel.reservation.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    Optional<InventoryItem> findBySku(String sku);
    Boolean existsBySku(String sku);
    List<InventoryItem> findByIsActiveTrue();
    List<InventoryItem> findByCategoryIdAndIsActiveTrue(Long categoryId);
    List<InventoryItem> findByWarehouseIdAndIsActiveTrue(Long warehouseId);

    @Query("SELECT i FROM InventoryItem i WHERE i.quantity <= i.minStockLevel AND i.isActive = true")
    List<InventoryItem> findLowStockItems();

    @Query("SELECT COUNT(i) FROM InventoryItem i WHERE i.quantity <= i.minStockLevel AND i.isActive = true")
    long countLowStockItems();
}
