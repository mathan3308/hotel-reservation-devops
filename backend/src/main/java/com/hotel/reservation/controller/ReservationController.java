package com.hotel.reservation.controller;

import com.hotel.reservation.dto.ApiResponse;
import com.hotel.reservation.dto.ReservationRequest;
import com.hotel.reservation.dto.ReservationResponse;
import com.hotel.reservation.entity.ReservationStatus;
import com.hotel.reservation.service.ReservationService;
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
@RequestMapping("/api/reservations")
@Tag(name = "Reservations", description = "Hotel booking and reservation lifecycle management")
public class ReservationController {

    private final ReservationService reservationService;

    @Autowired
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    @Operation(summary = "Create a new reservation with automatic date-overlap verification")
    public ResponseEntity<ApiResponse<ReservationResponse>> createReservation(@Valid @RequestBody ReservationRequest request) {
        ReservationResponse response = reservationService.createReservation(request);
        return new ResponseEntity<>(ApiResponse.success("Reservation created successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @Operation(summary = "Get reservations of currently authenticated customer")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getMyReservations() {
        List<ReservationResponse> myReservations = reservationService.getCurrentUserReservations();
        return ResponseEntity.ok(ApiResponse.success(myReservations));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get all reservations across the hotel (Admin/Staff only)")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getAllReservations() {
        List<ReservationResponse> all = reservationService.getAllReservations();
        return ResponseEntity.ok(ApiResponse.success(all));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get reservation details by ID")
    public ResponseEntity<ApiResponse<ReservationResponse>> getReservationById(@PathVariable Long id) {
        ReservationResponse response = reservationService.getReservationById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/ref/{reference}")
    @Operation(summary = "Get reservation details by Reference code (e.g. RES-2026-00001)")
    public ResponseEntity<ApiResponse<ReservationResponse>> getReservationByReference(@PathVariable String reference) {
        ReservationResponse response = reservationService.getReservationByReference(reference);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel a reservation and trigger simulated refund")
    public ResponseEntity<ApiResponse<ReservationResponse>> cancelReservation(@PathVariable Long id) {
        ReservationResponse response = reservationService.cancelReservation(id);
        return ResponseEntity.ok(ApiResponse.success("Reservation cancelled successfully", response));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Update reservation status (Admin/Staff only)")
    public ResponseEntity<ApiResponse<ReservationResponse>> updateStatus(@PathVariable Long id, @RequestParam ReservationStatus status) {
        ReservationResponse response = reservationService.updateReservationStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Reservation status updated to " + status, response));
    }
}
