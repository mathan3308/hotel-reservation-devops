package com.hotel.reservation.service;

import com.hotel.reservation.dto.PaymentResponse;
import com.hotel.reservation.dto.ReservationRequest;
import com.hotel.reservation.dto.ReservationResponse;
import com.hotel.reservation.entity.*;
import com.hotel.reservation.exception.BadRequestException;
import com.hotel.reservation.exception.BookingConflictException;
import com.hotel.reservation.exception.ResourceNotFoundException;
import com.hotel.reservation.exception.UnauthorizedException;
import com.hotel.reservation.repository.PaymentRepository;
import com.hotel.reservation.repository.ReservationRepository;
import com.hotel.reservation.repository.RoomRepository;
import com.hotel.reservation.repository.UserRepository;
import com.hotel.reservation.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    private static final AtomicLong REF_COUNTER = new AtomicLong(1000);

    @Autowired
    public ReservationService(ReservationRepository reservationRepository,
                              RoomRepository roomRepository,
                              UserRepository userRepository,
                              PaymentRepository paymentRepository) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
    }

    private String generateReservationReference() {
        int year = LocalDate.now().getYear();
        long nextVal = REF_COUNTER.incrementAndGet();
        return String.format("RES-%d-%05d", year, nextVal);
    }

    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            throw new UnauthorizedException("User is not authenticated");
        }
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        return userRepository.findById(principal.getId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + principal.getId()));
    }

    @Transactional
    public ReservationResponse createReservation(ReservationRequest request) {
        User user = getCurrentAuthenticatedUser();

        // 1. Validate dates
        if (request.getCheckInDate() == null || request.getCheckOutDate() == null) {
            throw new BadRequestException("Check-in and check-out dates are required");
        }

        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        if (request.getCheckInDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Check-in date cannot be in the past");
        }

        // 2. Fetch and validate Room
        Room room = roomRepository.findById(request.getRoomId())
            .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + request.getRoomId()));

        if (room.getStatus() == RoomStatus.MAINTENANCE) {
            throw new BadRequestException("Room " + room.getRoomNumber() + " is currently under maintenance and cannot be booked");
        }

        if (request.getNumGuests() > room.getCapacity()) {
            throw new BadRequestException("Number of guests (" + request.getNumGuests() + ") exceeds room capacity (" + room.getCapacity() + ")");
        }

        // 3. Strict Date-Overlap Validation: (requestedIn < existingOut AND requestedOut > existingIn)
        List<Reservation> conflicts = reservationRepository.findOverlappingReservations(
            room.getId(),
            request.getCheckInDate(),
            request.getCheckOutDate()
        );

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("Room " + room.getRoomNumber() + " is already booked for the selected dates. Please choose different dates or another room.");
        }

        // 4. Authoritative Pricing Calculation on Backend
        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        if (nights <= 0) {
            nights = 1;
        }

        BigDecimal pricePerNight = room.getPricePerNight();
        BigDecimal totalAmount = pricePerNight.multiply(BigDecimal.valueOf(nights));

        String reference = generateReservationReference();

        Reservation reservation = new Reservation(
            reference,
            user,
            room,
            request.getCheckInDate(),
            request.getCheckOutDate(),
            request.getNumGuests(),
            (int) nights,
            pricePerNight,
            totalAmount,
            ReservationStatus.CONFIRMED,
            request.getSpecialRequests()
        );

        Reservation savedReservation = reservationRepository.save(reservation);

        // 5. Simulated Payment Handling (if requested or default simulated flow)
        Payment payment = null;
        if (Boolean.TRUE.equals(request.getAutoSimulatePayment())) {
            String txRef = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            PaymentMethod method = request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.CREDIT_CARD;
            payment = new Payment(savedReservation, totalAmount, method, PaymentStatus.SUCCESS, txRef);
            payment = paymentRepository.save(payment);
        }

        ReservationResponse response = new ReservationResponse(savedReservation);
        if (payment != null) {
            response.setPayment(new PaymentResponse(payment));
        }

        return response;
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getCurrentUserReservations() {
        User user = getCurrentAuthenticatedUser();
        return reservationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
            .map(res -> {
                ReservationResponse resp = new ReservationResponse(res);
                paymentRepository.findByReservationId(res.getId()).ifPresent(p -> resp.setPayment(new PaymentResponse(p)));
                return resp;
            })
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAllByOrderByCreatedAtDesc().stream()
            .map(res -> {
                ReservationResponse resp = new ReservationResponse(res);
                paymentRepository.findByReservationId(res.getId()).ifPresent(p -> resp.setPayment(new PaymentResponse(p)));
                return resp;
            })
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReservationResponse getReservationById(Long id) {
        User user = getCurrentAuthenticatedUser();
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        // Customers can only see their own reservations, Admin/Staff can see any
        if (user.getRole() == Role.ROLE_CUSTOMER && !reservation.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to view this reservation");
        }

        ReservationResponse response = new ReservationResponse(reservation);
        paymentRepository.findByReservationId(reservation.getId()).ifPresent(p -> response.setPayment(new PaymentResponse(p)));
        return response;
    }

    @Transactional(readOnly = true)
    public ReservationResponse getReservationByReference(String reference) {
        Reservation reservation = reservationRepository.findByReservationReference(reference)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with reference: " + reference));

        ReservationResponse response = new ReservationResponse(reservation);
        paymentRepository.findByReservationId(reservation.getId()).ifPresent(p -> response.setPayment(new PaymentResponse(p)));
        return response;
    }

    @Transactional
    public ReservationResponse cancelReservation(Long id) {
        User user = getCurrentAuthenticatedUser();
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        if (user.getRole() == Role.ROLE_CUSTOMER && !reservation.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to cancel this reservation");
        }

        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new BadRequestException("Reservation is already cancelled");
        }

        if (reservation.getStatus() == ReservationStatus.COMPLETED) {
            throw new BadRequestException("Completed reservations cannot be cancelled");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        Reservation updated = reservationRepository.save(reservation);

        // Also update payment status to REFUNDED if existing payment was SUCCESS
        paymentRepository.findByReservationId(reservation.getId()).ifPresent(payment -> {
            if (payment.getPaymentStatus() == PaymentStatus.SUCCESS) {
                payment.setPaymentStatus(PaymentStatus.REFUNDED);
                paymentRepository.save(payment);
            }
        });

        ReservationResponse response = new ReservationResponse(updated);
        paymentRepository.findByReservationId(updated.getId()).ifPresent(p -> response.setPayment(new PaymentResponse(p)));
        return response;
    }

    @Transactional
    public ReservationResponse updateReservationStatus(Long id, ReservationStatus status) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        reservation.setStatus(status);
        Reservation updated = reservationRepository.save(reservation);

        ReservationResponse response = new ReservationResponse(updated);
        paymentRepository.findByReservationId(updated.getId()).ifPresent(p -> response.setPayment(new PaymentResponse(p)));
        return response;
    }
}
