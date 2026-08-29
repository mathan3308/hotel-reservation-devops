package com.hotel.reservation;

import com.hotel.reservation.entity.*;
import com.hotel.reservation.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
public class ReservationOverlapTest {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private UserRepository userRepository;

    private Room testRoom;
    private User testUser;

    @BeforeEach
    public void setup() {
        reservationRepository.deleteAll();
        roomRepository.deleteAll();
        roomTypeRepository.deleteAll();
        userRepository.deleteAll();

        testUser = userRepository.save(new User(
            "testguest", "testguest@example.com", "secretpass", "Test Guest", "123456", Role.ROLE_CUSTOMER
        ));

        RoomType roomType = roomTypeRepository.save(new RoomType(
            "Deluxe Suite", "Deluxe suite description", new BigDecimal("150.00"), 2, "WiFi, AC", null
        ));

        testRoom = roomRepository.save(new Room(
            "101", roomType, new BigDecimal("150.00"), 2, RoomStatus.AVAILABLE, "1", "Test Room"
        ));

        // Existing reservation from Day 10 to Day 15
        LocalDate in = LocalDate.of(2026, 6, 10);
        LocalDate out = LocalDate.of(2026, 6, 15);
        Reservation existingRes = new Reservation(
            "RES-2026-TEST1", testUser, testRoom, in, out, 2, 5,
            new BigDecimal("150.00"), new BigDecimal("750.00"), ReservationStatus.CONFIRMED, null
        );
        reservationRepository.save(existingRes);
    }

    @Test
    @DisplayName("Should detect EXACT same date overlap")
    public void testExactDateOverlap() {
        LocalDate in = LocalDate.of(2026, 6, 10);
        LocalDate out = LocalDate.of(2026, 6, 15);

        List<Reservation> conflicts = reservationRepository.findOverlappingReservations(testRoom.getId(), in, out);
        assertFalse(conflicts.isEmpty(), "Exact date range must conflict with existing reservation");
    }

    @Test
    @DisplayName("Should detect interior date overlap (within existing booking)")
    public void testInteriorDateOverlap() {
        LocalDate in = LocalDate.of(2026, 6, 11);
        LocalDate out = LocalDate.of(2026, 6, 14);

        List<Reservation> conflicts = reservationRepository.findOverlappingReservations(testRoom.getId(), in, out);
        assertFalse(conflicts.isEmpty(), "Interior dates must conflict with existing reservation");
    }

    @Test
    @DisplayName("Should detect partial left overlap (starting before, ending during)")
    public void testPartialLeftOverlap() {
        LocalDate in = LocalDate.of(2026, 6, 8);
        LocalDate out = LocalDate.of(2026, 6, 12);

        List<Reservation> conflicts = reservationRepository.findOverlappingReservations(testRoom.getId(), in, out);
        assertFalse(conflicts.isEmpty(), "Left overlapping dates must conflict");
    }

    @Test
    @DisplayName("Should detect partial right overlap (starting during, ending after)")
    public void testPartialRightOverlap() {
        LocalDate in = LocalDate.of(2026, 6, 13);
        LocalDate out = LocalDate.of(2026, 6, 18);

        List<Reservation> conflicts = reservationRepository.findOverlappingReservations(testRoom.getId(), in, out);
        assertFalse(conflicts.isEmpty(), "Right overlapping dates must conflict");
    }

    @Test
    @DisplayName("Should detect overarching overlap (starting before and ending after)")
    public void testOverarchingOverlap() {
        LocalDate in = LocalDate.of(2026, 6, 5);
        LocalDate out = LocalDate.of(2026, 6, 20);

        List<Reservation> conflicts = reservationRepository.findOverlappingReservations(testRoom.getId(), in, out);
        assertFalse(conflicts.isEmpty(), "Overarching dates must conflict");
    }

    @Test
    @DisplayName("Should ALLOW adjacent back-to-back booking (checking out on existing check-in)")
    public void testAdjacentBeforeAllowed() {
        LocalDate in = LocalDate.of(2026, 6, 5);
        LocalDate out = LocalDate.of(2026, 6, 10); // Check-out on existing check-in date

        List<Reservation> conflicts = reservationRepository.findOverlappingReservations(testRoom.getId(), in, out);
        assertTrue(conflicts.isEmpty(), "Adjacent checkout on existing check-in must be allowed");
    }

    @Test
    @DisplayName("Should ALLOW adjacent back-to-back booking (checking in on existing check-out)")
    public void testAdjacentAfterAllowed() {
        LocalDate in = LocalDate.of(2026, 6, 15); // Check-in on existing check-out date
        LocalDate out = LocalDate.of(2026, 6, 20);

        List<Reservation> conflicts = reservationRepository.findOverlappingReservations(testRoom.getId(), in, out);
        assertTrue(conflicts.isEmpty(), "Adjacent checkin on existing check-out must be allowed");
    }

    @Test
    @DisplayName("Should IGNORE cancelled reservations when checking for conflicts")
    public void testCancelledReservationIgnored() {
        // Cancel the existing reservation
        Reservation existing = reservationRepository.findByReservationReference("RES-2026-TEST1").orElseThrow();
        existing.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(existing);

        LocalDate in = LocalDate.of(2026, 6, 10);
        LocalDate out = LocalDate.of(2026, 6, 15);

        List<Reservation> conflicts = reservationRepository.findOverlappingReservations(testRoom.getId(), in, out);
        assertTrue(conflicts.isEmpty(), "Cancelled reservations must not block new bookings");
    }
}
