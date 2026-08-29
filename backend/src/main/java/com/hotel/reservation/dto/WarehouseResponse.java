package com.hotel.reservation.dto;

import com.hotel.reservation.entity.Warehouse;
import java.time.LocalDateTime;

public class WarehouseResponse {
    private Long id;
    private String name;
    private String code;
    private String address;
    private String capacityDescription;
    private LocalDateTime createdAt;

    public WarehouseResponse() {}
    public WarehouseResponse(Warehouse w) {
        this.id = w.getId();
        this.name = w.getName();
        this.code = w.getCode();
        this.address = w.getAddress();
        this.capacityDescription = w.getCapacityDescription();
        this.createdAt = w.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCapacityDescription() { return capacityDescription; }
    public void setCapacityDescription(String capacityDescription) { this.capacityDescription = capacityDescription; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
