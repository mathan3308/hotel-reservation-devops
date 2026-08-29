package com.hotel.reservation.repository;

import com.hotel.reservation.entity.WarehouseLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarehouseLocationRepository extends JpaRepository<WarehouseLocation, Long> {
    List<WarehouseLocation> findByWarehouseId(Long warehouseId);
    Optional<WarehouseLocation> findByWarehouseIdAndCode(Long warehouseId, String code);
    Boolean existsByWarehouseIdAndCode(Long warehouseId, String code);
}
