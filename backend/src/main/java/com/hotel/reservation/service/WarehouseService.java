package com.hotel.reservation.service;

import com.hotel.reservation.dto.WarehouseRequest;
import com.hotel.reservation.dto.WarehouseResponse;
import com.hotel.reservation.entity.Warehouse;
import com.hotel.reservation.exception.DuplicateResourceException;
import com.hotel.reservation.exception.ResourceNotFoundException;
import com.hotel.reservation.repository.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    @Autowired
    public WarehouseService(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }

    @Transactional(readOnly = true)
    public List<WarehouseResponse> getAllWarehouses() {
        return warehouseRepository.findAll().stream()
            .map(WarehouseResponse::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WarehouseResponse getWarehouseById(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with id: " + id));
        return new WarehouseResponse(warehouse);
    }

    @Transactional
    public WarehouseResponse createWarehouse(WarehouseRequest request) {
        if (warehouseRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Warehouse code '" + request.getCode() + "' already exists");
        }

        Warehouse warehouse = new Warehouse(
            request.getName(),
            request.getCode().toUpperCase(),
            request.getAddress(),
            request.getCapacityDescription()
        );

        Warehouse saved = warehouseRepository.save(warehouse);
        return new WarehouseResponse(saved);
    }

    @Transactional
    public WarehouseResponse updateWarehouse(Long id, WarehouseRequest request) {
        Warehouse warehouse = warehouseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with id: " + id));

        if (!warehouse.getCode().equalsIgnoreCase(request.getCode()) && warehouseRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Warehouse code '" + request.getCode() + "' already exists");
        }

        warehouse.setName(request.getName());
        warehouse.setCode(request.getCode().toUpperCase());
        warehouse.setAddress(request.getAddress());
        warehouse.setCapacityDescription(request.getCapacityDescription());

        Warehouse updated = warehouseRepository.save(warehouse);
        return new WarehouseResponse(updated);
    }

    @Transactional
    public void deleteWarehouse(Long id) {
        if (!warehouseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Warehouse not found with id: " + id);
        }
        warehouseRepository.deleteById(id);
    }
}
