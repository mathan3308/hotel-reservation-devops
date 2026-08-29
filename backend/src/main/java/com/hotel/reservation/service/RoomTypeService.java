package com.hotel.reservation.service;

import com.hotel.reservation.dto.RoomTypeRequest;
import com.hotel.reservation.dto.RoomTypeResponse;
import com.hotel.reservation.entity.RoomType;
import com.hotel.reservation.exception.DuplicateResourceException;
import com.hotel.reservation.exception.ResourceNotFoundException;
import com.hotel.reservation.repository.RoomTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;

    @Autowired
    public RoomTypeService(RoomTypeRepository roomTypeRepository) {
        this.roomTypeRepository = roomTypeRepository;
    }

    @Transactional(readOnly = true)
    public List<RoomTypeResponse> getAllRoomTypes() {
        return roomTypeRepository.findAll().stream()
            .map(RoomTypeResponse::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RoomTypeResponse getRoomTypeById(Long id) {
        RoomType roomType = roomTypeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Room type not found with id: " + id));
        return new RoomTypeResponse(roomType);
    }

    @Transactional
    public RoomTypeResponse createRoomType(RoomTypeRequest request) {
        if (roomTypeRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Room type '" + request.getName() + "' already exists");
        }

        RoomType roomType = new RoomType(
            request.getName(),
            request.getDescription(),
            request.getBasePrice(),
            request.getDefaultCapacity(),
            request.getAmenities(),
            request.getImageUrl()
        );

        RoomType saved = roomTypeRepository.save(roomType);
        return new RoomTypeResponse(saved);
    }

    @Transactional
    public RoomTypeResponse updateRoomType(Long id, RoomTypeRequest request) {
        RoomType roomType = roomTypeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Room type not found with id: " + id));

        if (!roomType.getName().equalsIgnoreCase(request.getName()) && roomTypeRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Room type '" + request.getName() + "' already exists");
        }

        roomType.setName(request.getName());
        roomType.setDescription(request.getDescription());
        roomType.setBasePrice(request.getBasePrice());
        roomType.setDefaultCapacity(request.getDefaultCapacity());
        roomType.setAmenities(request.getAmenities());
        roomType.setImageUrl(request.getImageUrl());

        RoomType updated = roomTypeRepository.save(roomType);
        return new RoomTypeResponse(updated);
    }

    @Transactional
    public void deleteRoomType(Long id) {
        if (!roomTypeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Room type not found with id: " + id);
        }
        roomTypeRepository.deleteById(id);
    }
}
