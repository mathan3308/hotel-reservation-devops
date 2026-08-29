package com.hotel.reservation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "warehouses", uniqueConstraints = {
    @UniqueConstraint(columnNames = "code")
})
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String name; // e.g. "Main Hotel Central Warehouse", "Tower B Housekeeping Depot"

    @NotBlank
    @Column(nullable = false, length = 20)
    private String code; // e.g. "WH-MAIN", "WH-TOWER-B"

    @Column(length = 255)
    private String address;

    @Column(name = "capacity_description", length = 100)
    private String capacityDescription;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Warehouse() {}

    public Warehouse(String name, String code, String address, String capacityDescription) {
        this.name = name;
        this.code = code;
        this.address = address;
        this.capacityDescription = capacityDescription;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCapacityDescription() {
        return capacityDescription;
    }

    public void setCapacityDescription(String capacityDescription) {
        this.capacityDescription = capacityDescription;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
