package com.hotel.reservation.dto;

import com.hotel.reservation.entity.Room;
import com.hotel.reservation.entity.RoomStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RoomResponse {
    private Long id;
    private String roomNumber;
    private RoomTypeResponse roomType;
    private BigDecimal pricePerNight;
    private Integer capacity;
    private RoomStatus status;
    private String floor;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public RoomResponse() {}

    public RoomResponse(Room room) {
        this.id = room.getId();
        this.roomNumber = room.getRoomNumber();
        this.roomType = room.getRoomType() != null ? new RoomTypeResponse(room.getRoomType()) : null;
        this.pricePerNight = room.getPricePerNight();
        this.capacity = room.getCapacity();
        this.status = room.getStatus();
        this.floor = room.getFloor();
        this.description = room.getDescription();
        this.createdAt = room.getCreatedAt();
        this.updatedAt = room.getUpdatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public RoomTypeResponse getRoomType() {
        return roomType;
    }

    public void setRoomType(RoomTypeResponse roomType) {
        this.roomType = roomType;
    }

    public BigDecimal getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(BigDecimal pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public RoomStatus getStatus() {
        return status;
    }

    public void setStatus(RoomStatus status) {
        this.status = status;
    }

    public String getFloor() {
        return floor;
    }

    public void setFloor(String floor) {
        this.floor = floor;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
