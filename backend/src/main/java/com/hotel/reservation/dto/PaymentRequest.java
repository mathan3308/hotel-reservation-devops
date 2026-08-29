package com.hotel.reservation.dto;

import com.hotel.reservation.entity.Payment;
import com.hotel.reservation.entity.PaymentMethod;
import com.hotel.reservation.entity.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentRequest {

    @NotNull(message = "Reservation ID is required")
    private Long reservationId;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    private BigDecimal amount; // Optional: will default to reservation balance if omitted

    public PaymentRequest() {}

    public PaymentRequest(Long reservationId, PaymentMethod paymentMethod, BigDecimal amount) {
        this.reservationId = reservationId;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
    }

    public Long getReservationId() {
        return reservationId;
    }

    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
