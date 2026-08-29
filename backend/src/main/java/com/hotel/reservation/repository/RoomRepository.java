package com.hotel.reservation.repository;

import com.hotel.reservation.entity.Room;
import com.hotel.reservation.entity.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByRoomNumber(String roomNumber);
    Boolean existsByRoomNumber(String roomNumber);
    List<Room> findByStatus(RoomStatus status);
    List<Room> findByRoomTypeId(Long roomTypeId);
    long countByStatus(RoomStatus status);

    @Query("""
        SELECT r FROM Room r
        WHERE r.status = 'AVAILABLE'
        AND r.capacity >= :minGuests
        AND (:roomTypeId IS NULL OR r.roomType.id = :roomTypeId)
        AND r.id NOT IN (
            SELECT res.room.id FROM Reservation res
            WHERE res.status != 'CANCELLED'
            AND (:checkIn < res.checkOutDate AND :checkOut > res.checkInDate)
        )
    """)
    List<Room> findAvailableRooms(
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut,
        @Param("minGuests") Integer minGuests,
        @Param("roomTypeId") Long roomTypeId
    );
}
