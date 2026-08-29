package com.hotel.reservation.dto;

import com.hotel.reservation.entity.RoomType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RoomTypeResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private Integer defaultCapacity;
    private String amenities;
    private String imageUrl;
    private LocalDateTime createdAt;

    public RoomTypeResponse() {}

    public RoomTypeResponse(RoomType roomType) {
        this.id = roomType.getId();
        this.name = roomType.getName();
        this.description = roomType.getDescription();
        this.basePrice = roomType.getBasePrice();
        this.defaultCapacity = roomType.getDefaultCapacity();
        this.amenities = roomType.getAmenities();
        this.imageUrl = roomType.getImageUrl();
        this.createdAt = roomType.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public Integer getDefaultCapacity() {
        return defaultCapacity;
    }

    public void setDefaultCapacity(Integer defaultCapacity) {
        this.defaultCapacity = defaultCapacity;
    }

    public String getAmenities() {
        return amenities;
    }

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
