package com.hotel.reservation.service;

import com.hotel.reservation.dto.RoomRequest;
import com.hotel.reservation.dto.RoomResponse;
import com.hotel.reservation.dto.RoomSearchRequest;
import com.hotel.reservation.entity.Room;
import com.hotel.reservation.entity.RoomStatus;
import com.hotel.reservation.entity.RoomType;
import com.hotel.reservation.exception.BadRequestException;
import com.hotel.reservation.exception.DuplicateResourceException;
import com.hotel.reservation.exception.ResourceNotFoundException;
import com.hotel.reservation.repository.RoomRepository;
import com.hotel.reservation.repository.RoomTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;

    @Autowired
    public RoomService(RoomRepository roomRepository, RoomTypeRepository roomTypeRepository) {
        this.roomRepository = roomRepository;
        this.roomTypeRepository = roomTypeRepository;
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream()
            .map(RoomResponse::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RoomResponse getRoomById(Long id) {
        Room room = roomRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        return new RoomResponse(room);
    }

    @Transactional
    public RoomResponse createRoom(RoomRequest request) {
        if (roomRepository.existsByRoomNumber(request.getRoomNumber())) {
            throw new DuplicateResourceException("Room with number '" + request.getRoomNumber() + "' already exists");
        }

        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
            .orElseThrow(() -> new ResourceNotFoundException("Room type not found with id: " + request.getRoomTypeId()));

        Room room = new Room(
            request.getRoomNumber(),
            roomType,
            request.getPricePerNight(),
            request.getCapacity(),
            request.getStatus() != null ? request.getStatus() : RoomStatus.AVAILABLE,
            request.getFloor(),
            request.getDescription()
        );

        Room saved = roomRepository.save(room);
        return new RoomResponse(saved);
    }

    @Transactional
    public RoomResponse updateRoom(Long id, RoomRequest request) {
        Room room = roomRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        if (!room.getRoomNumber().equalsIgnoreCase(request.getRoomNumber()) &&
            roomRepository.existsByRoomNumber(request.getRoomNumber())) {
            throw new DuplicateResourceException("Room with number '" + request.getRoomNumber() + "' already exists");
        }

        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
            .orElseThrow(() -> new ResourceNotFoundException("Room type not found with id: " + request.getRoomTypeId()));

        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(roomType);
        room.setPricePerNight(request.getPricePerNight());
        room.setCapacity(request.getCapacity());
        if (request.getStatus() != null) {
            room.setStatus(request.getStatus());
        }
        room.setFloor(request.getFloor());
        room.setDescription(request.getDescription());

        Room updated = roomRepository.save(room);
        return new RoomResponse(updated);
    }

    @Transactional
    public RoomResponse updateRoomStatus(Long id, RoomStatus status) {
        Room room = roomRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        room.setStatus(status);
        Room updated = roomRepository.save(room);
        return new RoomResponse(updated);
    }

    @Transactional
    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new ResourceNotFoundException("Room not found with id: " + id);
        }
        roomRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> searchAvailableRooms(RoomSearchRequest request) {
        if (request.getCheckInDate() == null || request.getCheckOutDate() == null) {
            throw new BadRequestException("Check-in and check-out dates are required");
        }

        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new BadRequestException("Check-out date must be strictly after check-in date");
        }

        if (request.getCheckInDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Check-in date cannot be in the past");
        }

        int minGuests = request.getGuests() != null && request.getGuests() > 0 ? request.getGuests() : 1;

        List<Room> availableRooms = roomRepository.findAvailableRooms(
            request.getCheckInDate(),
            request.getCheckOutDate(),
            minGuests,
            request.getRoomTypeId()
        );

        return availableRooms.stream()
            .filter(r -> request.getMinPrice() == null || r.getPricePerNight().compareTo(request.getMinPrice()) >= 0)
            .filter(r -> request.getMaxPrice() == null || r.getPricePerNight().compareTo(request.getMaxPrice()) <= 0)
            .map(RoomResponse::new)
            .collect(Collectors.toList());
    }
}
