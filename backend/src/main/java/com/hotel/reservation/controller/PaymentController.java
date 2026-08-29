package com.hotel.reservation.controller;

import com.hotel.reservation.dto.ApiResponse;
import com.hotel.reservation.dto.PaymentRequest;
import com.hotel.reservation.dto.PaymentResponse;
import com.hotel.reservation.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payments", description = "Simulated payment processing endpoints")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/simulate")
    @Operation(summary = "Simulate payment transaction for a reservation")
    public ResponseEntity<ApiResponse<PaymentResponse>> processPayment(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.processPayment(request);
        return ResponseEntity.ok(ApiResponse.success("Payment processed successfully", response));
    }

    @GetMapping("/reservation/{reservationId}")
    @Operation(summary = "Get payment transaction for a specific reservation")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByReservationId(@PathVariable Long reservationId) {
        PaymentResponse response = paymentService.getPaymentByReservationId(reservationId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all payments across the system (Admin only)")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getAllPayments() {
        List<PaymentResponse> all = paymentService.getAllPayments();
        return ResponseEntity.ok(ApiResponse.success(all));
    }
}
