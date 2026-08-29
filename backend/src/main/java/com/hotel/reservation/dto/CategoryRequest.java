package com.hotel.reservation.dto;

import com.hotel.reservation.entity.Category;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class CategoryRequest {
    @NotBlank(message = "Category name is required")
    private String name;
    private String description;

    public CategoryRequest() {}
    public CategoryRequest(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
