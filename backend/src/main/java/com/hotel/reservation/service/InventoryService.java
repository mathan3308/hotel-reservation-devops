package com.hotel.reservation.service;

import com.hotel.reservation.dto.InventoryItemRequest;
import com.hotel.reservation.dto.InventoryItemResponse;
import com.hotel.reservation.entity.*;
import com.hotel.reservation.exception.DuplicateResourceException;
import com.hotel.reservation.exception.ResourceNotFoundException;
import com.hotel.reservation.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private final InventoryItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final WarehouseRepository warehouseRepository;
    private final WarehouseLocationRepository locationRepository;
    private final SupplierRepository supplierRepository;

    @Autowired
    public InventoryService(InventoryItemRepository itemRepository,
                            CategoryRepository categoryRepository,
                            WarehouseRepository warehouseRepository,
                            WarehouseLocationRepository locationRepository,
                            SupplierRepository supplierRepository) {
        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
        this.warehouseRepository = warehouseRepository;
        this.locationRepository = locationRepository;
        this.supplierRepository = supplierRepository;
    }

    @Transactional(readOnly = true)
    public List<InventoryItemResponse> getAllItems() {
        return itemRepository.findByIsActiveTrue().stream()
            .map(InventoryItemResponse::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InventoryItemResponse> getLowStockItems() {
        return itemRepository.findLowStockItems().stream()
            .map(InventoryItemResponse::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InventoryItemResponse getItemById(Long id) {
        InventoryItem item = itemRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found with id: " + id));
        return new InventoryItemResponse(item);
    }

    @Transactional(readOnly = true)
    public InventoryItemResponse getItemBySku(String sku) {
        InventoryItem item = itemRepository.findBySku(sku)
            .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found with SKU: " + sku));
        return new InventoryItemResponse(item);
    }

    @Transactional(readOnly = true)
    public List<InventoryItemResponse> getItemsByCategory(Long categoryId) {
        return itemRepository.findByCategoryIdAndIsActiveTrue(categoryId).stream()
            .map(InventoryItemResponse::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InventoryItemResponse> getItemsByWarehouse(Long warehouseId) {
        return itemRepository.findByWarehouseIdAndIsActiveTrue(warehouseId).stream()
            .map(InventoryItemResponse::new)
            .collect(Collectors.toList());
    }

    @Transactional
    public InventoryItemResponse createItem(InventoryItemRequest request) {
        if (itemRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("Inventory item with SKU '" + request.getSku() + "' already exists");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
            .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with id: " + request.getWarehouseId()));

        WarehouseLocation location = null;
        if (request.getLocationId() != null) {
            location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse location not found with id: " + request.getLocationId()));
        }

        Supplier supplier = null;
        if (request.getSupplierId() != null) {
            supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + request.getSupplierId()));
        }

        InventoryItem item = new InventoryItem(
            request.getName(),
            request.getSku().toUpperCase(),
            category,
            request.getQuantity(),
            request.getMinStockLevel(),
            request.getUnit(),
            request.getUnitPrice(),
            warehouse,
            location,
            supplier,
            request.getIsActive()
        );

        InventoryItem saved = itemRepository.save(item);
        return new InventoryItemResponse(saved);
    }

    @Transactional
    public InventoryItemResponse updateItem(Long id, InventoryItemRequest request) {
        InventoryItem item = itemRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found with id: " + id));

        if (!item.getSku().equalsIgnoreCase(request.getSku()) && itemRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("Inventory item with SKU '" + request.getSku() + "' already exists");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
            .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with id: " + request.getWarehouseId()));

        WarehouseLocation location = null;
        if (request.getLocationId() != null) {
            location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse location not found with id: " + request.getLocationId()));
        }

        Supplier supplier = null;
        if (request.getSupplierId() != null) {
            supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + request.getSupplierId()));
        }

        item.setName(request.getName());
        item.setSku(request.getSku().toUpperCase());
        item.setCategory(category);
        item.setQuantity(request.getQuantity());
        item.setMinStockLevel(request.getMinStockLevel());
        item.setUnit(request.getUnit());
        item.setUnitPrice(request.getUnitPrice());
        item.setWarehouse(warehouse);
        item.setLocation(location);
        item.setSupplier(supplier);
        if (request.getIsActive() != null) {
            item.setIsActive(request.getIsActive());
        }

        InventoryItem updated = itemRepository.save(item);
        return new InventoryItemResponse(updated);
    }

    @Transactional
    public void deleteItem(Long id) {
        InventoryItem item = itemRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found with id: " + id));
        item.setIsActive(false);
        itemRepository.save(item);
    }
}
