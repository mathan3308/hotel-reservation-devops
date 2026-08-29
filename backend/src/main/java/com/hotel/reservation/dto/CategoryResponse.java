package com.hotel.reservation.dto;

import com.hotel.reservation.entity.Category;
import java.time.LocalDateTime;

public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;

    public CategoryResponse() {}
    public CategoryResponse(Category c) {
        this.id = c.getId();
        this.name = c.getName();
        this.description = c.getDescription();
        this.createdAt = c.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
