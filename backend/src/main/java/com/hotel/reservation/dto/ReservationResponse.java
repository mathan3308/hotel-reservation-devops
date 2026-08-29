package com.hotel.reservation.dto;

import com.hotel.reservation.entity.Reservation;
import com.hotel.reservation.entity.ReservationStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReservationResponse {
    private Long id;
    private String reservationReference;
    private UserDto user;
    private RoomResponse room;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numGuests;
    private Integer numNights;
    private BigDecimal pricePerNight;
    private BigDecimal totalAmount;
    private ReservationStatus status;
    private String specialRequests;
    private PaymentResponse payment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ReservationResponse() {}

    public ReservationResponse(Reservation res) {
        this.id = res.getId();
        this.reservationReference = res.getReservationReference();
        this.user = res.getUser() != null ? new UserDto(res.getUser()) : null;
        this.room = res.getRoom() != null ? new RoomResponse(res.getRoom()) : null;
        this.checkInDate = res.getCheckInDate();
        this.checkOutDate = res.getCheckOutDate();
        this.numGuests = res.getNumGuests();
        this.numNights = res.getNumNights();
        this.pricePerNight = res.getPricePerNight();
        this.totalAmount = res.getTotalAmount();
        this.status = res.getStatus();
        this.specialRequests = res.getSpecialRequests();
        this.createdAt = res.getCreatedAt();
        this.updatedAt = res.getUpdatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReservationReference() {
        return reservationReference;
    }

    public void setReservationReference(String reservationReference) {
        this.reservationReference = reservationReference;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public RoomResponse getRoom() {
        return room;
    }

    public void setRoom(RoomResponse room) {
        this.room = room;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public Integer getNumGuests() {
        return numGuests;
    }

    public void setNumGuests(Integer numGuests) {
        this.numGuests = numGuests;
    }

    public Integer getNumNights() {
        return numNights;
    }

    public void setNumNights(Integer numNights) {
        this.numNights = numNights;
    }

    public BigDecimal getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(BigDecimal pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }

    public String getSpecialRequests() {
        return specialRequests;
    }

    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }

    public PaymentResponse getPayment() {
        return payment;
    }

    public void setPayment(PaymentResponse payment) {
        this.payment = payment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
