package com.hotel.reservation.controller;

import com.hotel.reservation.dto.ApiResponse;
import com.hotel.reservation.dto.RoomTypeRequest;
import com.hotel.reservation.dto.RoomTypeResponse;
import com.hotel.reservation.service.RoomTypeService;
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
@RequestMapping("/api/room-types")
@Tag(name = "Room Types", description = "Room category and tier management")
public class RoomTypeController {

    private final RoomTypeService roomTypeService;

    @Autowired
    public RoomTypeController(RoomTypeService roomTypeService) {
        this.roomTypeService = roomTypeService;
    }

    @GetMapping
    @Operation(summary = "List all room types")
    public ResponseEntity<ApiResponse<List<RoomTypeResponse>>> getAllRoomTypes() {
        List<RoomTypeResponse> types = roomTypeService.getAllRoomTypes();
        return ResponseEntity.ok(ApiResponse.success(types));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get room type by ID")
    public ResponseEntity<ApiResponse<RoomTypeResponse>> getRoomTypeById(@PathVariable Long id) {
        RoomTypeResponse type = roomTypeService.getRoomTypeById(id);
        return ResponseEntity.ok(ApiResponse.success(type));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new room type (Admin only)")
    public ResponseEntity<ApiResponse<RoomTypeResponse>> createRoomType(@Valid @RequestBody RoomTypeRequest request) {
        RoomTypeResponse type = roomTypeService.createRoomType(request);
        return new ResponseEntity<>(ApiResponse.success("Room type created successfully", type), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update room type (Admin only)")
    public ResponseEntity<ApiResponse<RoomTypeResponse>> updateRoomType(@PathVariable Long id, @Valid @RequestBody RoomTypeRequest request) {
        RoomTypeResponse type = roomTypeService.updateRoomType(id, request);
        return ResponseEntity.ok(ApiResponse.success("Room type updated successfully", type));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete room type (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteRoomType(@PathVariable Long id) {
        roomTypeService.deleteRoomType(id);
        return ResponseEntity.ok(ApiResponse.success("Room type deleted successfully", null));
    }
}
