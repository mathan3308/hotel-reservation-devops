package com.hotel.reservation.controller;

import com.hotel.reservation.dto.ApiResponse;
import com.hotel.reservation.dto.HousekeepingIssueRequest;
import com.hotel.reservation.dto.StockTransactionResponse;
import com.hotel.reservation.service.HousekeepingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/housekeeping")
@Tag(name = "Housekeeping & Room Prep", description = "Integration between reservations, room preparation, and inventory consumption")
public class HousekeepingController {

    private final HousekeepingService housekeepingService;

    @Autowired
    public HousekeepingController(HousekeepingService housekeepingService) {
        this.housekeepingService = housekeepingService;
    }

    @PostMapping("/prepare-room")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Issue room amenities (towels, bedding, toiletries) for room preparation / reservation")
    public ResponseEntity<ApiResponse<List<StockTransactionResponse>>> prepareRoom(@Valid @RequestBody HousekeepingIssueRequest request) {
        List<StockTransactionResponse> transactions = housekeepingService.issueRoomPreparation(request);
        return ResponseEntity.ok(ApiResponse.success("Room preparation amenities issued successfully", transactions));
    }
}
