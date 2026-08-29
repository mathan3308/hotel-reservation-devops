package com.hotel.reservation.service;

import com.hotel.reservation.dto.WarehouseLocationRequest;
import com.hotel.reservation.dto.WarehouseLocationResponse;
import com.hotel.reservation.entity.Warehouse;
import com.hotel.reservation.entity.WarehouseLocation;
import com.hotel.reservation.exception.DuplicateResourceException;
import com.hotel.reservation.exception.ResourceNotFoundException;
import com.hotel.reservation.repository.WarehouseLocationRepository;
import com.hotel.reservation.repository.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WarehouseLocationService {

    private final WarehouseLocationRepository locationRepository;
    private final WarehouseRepository warehouseRepository;

    @Autowired
    public WarehouseLocationService(WarehouseLocationRepository locationRepository, WarehouseRepository warehouseRepository) {
        this.locationRepository = locationRepository;
        this.warehouseRepository = warehouseRepository;
    }

    @Transactional(readOnly = true)
    public List<WarehouseLocationResponse> getAllLocations() {
        return locationRepository.findAll().stream()
            .map(WarehouseLocationResponse::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<WarehouseLocationResponse> getLocationsByWarehouse(Long warehouseId) {
        return locationRepository.findByWarehouseId(warehouseId).stream()
            .map(WarehouseLocationResponse::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WarehouseLocationResponse getLocationById(Long id) {
        WarehouseLocation location = locationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Warehouse location not found with id: " + id));
        return new WarehouseLocationResponse(location);
    }

    @Transactional
    public WarehouseLocationResponse createLocation(WarehouseLocationRequest request) {
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
            .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with id: " + request.getWarehouseId()));

        if (locationRepository.existsByWarehouseIdAndCode(warehouse.getId(), request.getCode())) {
            throw new DuplicateResourceException("Location code '" + request.getCode() + "' already exists in this warehouse");
        }

        WarehouseLocation location = new WarehouseLocation(warehouse, request.getCode().toUpperCase(), request.getDescription());
        WarehouseLocation saved = locationRepository.save(location);
        return new WarehouseLocationResponse(saved);
    }

    @Transactional
    public WarehouseLocationResponse updateLocation(Long id, WarehouseLocationRequest request) {
        WarehouseLocation location = locationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Warehouse location not found with id: " + id));

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
            .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with id: " + request.getWarehouseId()));

        if (!location.getCode().equalsIgnoreCase(request.getCode()) &&
            locationRepository.existsByWarehouseIdAndCode(warehouse.getId(), request.getCode())) {
            throw new DuplicateResourceException("Location code '" + request.getCode() + "' already exists in this warehouse");
        }

        location.setWarehouse(warehouse);
        location.setCode(request.getCode().toUpperCase());
        location.setDescription(request.getDescription());

        WarehouseLocation updated = locationRepository.save(location);
        return new WarehouseLocationResponse(updated);
    }

    @Transactional
    public void deleteLocation(Long id) {
        if (!locationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Warehouse location not found with id: " + id);
        }
        locationRepository.deleteById(id);
    }
}
