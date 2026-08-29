package com.hotel.reservation.repository;

import com.hotel.reservation.entity.Reservation;
import com.hotel.reservation.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByReservationReference(String reservationReference);
    List<Reservation> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Reservation> findByStatus(ReservationStatus status);
    List<Reservation> findAllByOrderByCreatedAtDesc();
    long countByStatus(ReservationStatus status);

    @Query("""
        SELECT r FROM Reservation r
        WHERE r.room.id = :roomId
        AND r.status != 'CANCELLED'
        AND (:checkIn < r.checkOutDate AND :checkOut > r.checkInDate)
    """)
    List<Reservation> findOverlappingReservations(
        @Param("roomId") Long roomId,
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut
    );

    @Query("""
        SELECT r FROM Reservation r
        WHERE r.room.id = :roomId
        AND r.id != :excludeReservationId
        AND r.status != 'CANCELLED'
        AND (:checkIn < r.checkOutDate AND :checkOut > r.checkInDate)
    """)
    List<Reservation> findOverlappingReservationsExcludingId(
        @Param("roomId") Long roomId,
        @Param("excludeReservationId") Long excludeReservationId,
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut
    );
}
