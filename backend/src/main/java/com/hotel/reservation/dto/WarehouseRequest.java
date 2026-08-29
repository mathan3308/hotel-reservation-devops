package com.hotel.reservation.dto;

import jakarta.validation.constraints.NotBlank;

public class WarehouseRequest {
    @NotBlank(message = "Warehouse name is required")
    private String name;

    @NotBlank(message = "Warehouse code is required")
    private String code;

    private String address;
    private String capacityDescription;

    public WarehouseRequest() {}
    public WarehouseRequest(String name, String code, String address, String capacityDescription) {
        this.name = name;
        this.code = code;
        this.address = address;
        this.capacityDescription = capacityDescription;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCapacityDescription() { return capacityDescription; }
    public void setCapacityDescription(String capacityDescription) { this.capacityDescription = capacityDescription; }
}
