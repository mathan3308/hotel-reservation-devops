package com.hotel.reservation.controller;

import com.hotel.reservation.dto.ApiResponse;
import com.hotel.reservation.dto.WarehouseLocationRequest;
import com.hotel.reservation.dto.WarehouseLocationResponse;
import com.hotel.reservation.service.WarehouseLocationService;
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
@RequestMapping("/api/warehouse-locations")
@Tag(name = "Warehouse Locations", description = "Aisles, racks, and storage bin locations within warehouses")
public class WarehouseLocationController {

    private final WarehouseLocationService locationService;

    @Autowired
    public WarehouseLocationController(WarehouseLocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    @Operation(summary = "List all storage locations across warehouses")
    public ResponseEntity<ApiResponse<List<WarehouseLocationResponse>>> getAllLocations() {
        return ResponseEntity.ok(ApiResponse.success(locationService.getAllLocations()));
    }

    @GetMapping("/warehouse/{warehouseId}")
    @Operation(summary = "List storage locations within a specific warehouse")
    public ResponseEntity<ApiResponse<List<WarehouseLocationResponse>>> getLocationsByWarehouse(@PathVariable Long warehouseId) {
        return ResponseEntity.ok(ApiResponse.success(locationService.getLocationsByWarehouse(warehouseId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get storage location by ID")
    public ResponseEntity<ApiResponse<WarehouseLocationResponse>> getLocationById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(locationService.getLocationById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Create a new warehouse location")
    public ResponseEntity<ApiResponse<WarehouseLocationResponse>> createLocation(@Valid @RequestBody WarehouseLocationRequest request) {
        WarehouseLocationResponse response = locationService.createLocation(request);
        return new ResponseEntity<>(ApiResponse.success("Location created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Update warehouse location")
    public ResponseEntity<ApiResponse<WarehouseLocationResponse>> updateLocation(@PathVariable Long id, @Valid @RequestBody WarehouseLocationRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Location updated successfully", locationService.updateLocation(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete warehouse location (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteLocation(@PathVariable Long id) {
        locationService.deleteLocation(id);
        return ResponseEntity.ok(ApiResponse.success("Location deleted successfully", null));
    }
}
