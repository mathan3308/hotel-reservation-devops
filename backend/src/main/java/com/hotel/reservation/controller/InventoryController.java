package com.hotel.reservation.controller;

import com.hotel.reservation.dto.ApiResponse;
import com.hotel.reservation.dto.InventoryItemRequest;
import com.hotel.reservation.dto.InventoryItemResponse;
import com.hotel.reservation.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@Tag(name = "Inventory", description = "Hotel inventory items and stock catalog management")
public class InventoryController {

    private final InventoryService inventoryService;

    @Autowired
    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    @Operation(summary = "List all active inventory items")
    public ResponseEntity<ApiResponse<List<InventoryItemResponse>>> getAllItems() {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getAllItems()));
    }

    @GetMapping("/low-stock")
    @Operation(summary = "List all low-stock items requiring restocking")
    public ResponseEntity<ApiResponse<List<InventoryItemResponse>>> getLowStockItems() {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getLowStockItems()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get inventory item by ID")
    public ResponseEntity<ApiResponse<InventoryItemResponse>> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getItemById(id)));
    }

    @GetMapping("/sku/{sku}")
    @Operation(summary = "Get inventory item by SKU")
    public ResponseEntity<ApiResponse<InventoryItemResponse>> getItemBySku(@PathVariable String sku) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getItemBySku(sku)));
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "List items by category")
    public ResponseEntity<ApiResponse<List<InventoryItemResponse>>> getItemsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getItemsByCategory(categoryId)));
    }

    @GetMapping("/warehouse/{warehouseId}")
    @Operation(summary = "List items by warehouse")
    public ResponseEntity<ApiResponse<List<InventoryItemResponse>>> getItemsByWarehouse(@PathVariable Long warehouseId) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getItemsByWarehouse(warehouseId)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Create a new inventory item")
    public ResponseEntity<ApiResponse<InventoryItemResponse>> createItem(@Valid @RequestBody InventoryItemRequest request) {
        InventoryItemResponse response = inventoryService.createItem(request);
        return new ResponseEntity<>(ApiResponse.success("Inventory item created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Update inventory item details")
    public ResponseEntity<ApiResponse<InventoryItemResponse>> updateItem(@PathVariable Long id, @Valid @RequestBody InventoryItemRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Inventory item updated successfully", inventoryService.updateItem(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate/delete inventory item (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.ok(ApiResponse.success("Inventory item deleted successfully", null));
    }
}
