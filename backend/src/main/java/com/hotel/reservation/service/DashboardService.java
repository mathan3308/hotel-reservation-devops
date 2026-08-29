package com.hotel.reservation.service;

import com.hotel.reservation.dto.DashboardStatsResponse;
import com.hotel.reservation.dto.InventoryItemResponse;
import com.hotel.reservation.dto.PaymentResponse;
import com.hotel.reservation.dto.ReservationResponse;
import com.hotel.reservation.dto.StockTransactionResponse;
import com.hotel.reservation.entity.Payment;
import com.hotel.reservation.entity.PaymentStatus;
import com.hotel.reservation.entity.Reservation;
import com.hotel.reservation.entity.ReservationStatus;
import com.hotel.reservation.entity.RoomStatus;
import com.hotel.reservation.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final WarehouseRepository warehouseRepository;
    private final SupplierRepository supplierRepository;
    private final PaymentRepository paymentRepository;
    private final StockTransactionRepository stockTransactionRepository;

    @Autowired
    public DashboardService(RoomRepository roomRepository,
                            ReservationRepository reservationRepository,
                            InventoryItemRepository inventoryItemRepository,
                            WarehouseRepository warehouseRepository,
                            SupplierRepository supplierRepository,
                            PaymentRepository paymentRepository,
                            StockTransactionRepository stockTransactionRepository) {
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.warehouseRepository = warehouseRepository;
        this.supplierRepository = supplierRepository;
        this.paymentRepository = paymentRepository;
        this.stockTransactionRepository = stockTransactionRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        // Room stats
        stats.setTotalRooms(roomRepository.count());
        stats.setAvailableRooms(roomRepository.countByStatus(RoomStatus.AVAILABLE));
        stats.setBookedRooms(roomRepository.countByStatus(RoomStatus.BOOKED));
        stats.setMaintenanceRooms(roomRepository.countByStatus(RoomStatus.MAINTENANCE));
        stats.setCleaningRooms(roomRepository.countByStatus(RoomStatus.CLEANING));

        // Reservation stats
        stats.setTotalReservations(reservationRepository.count());
        stats.setConfirmedReservations(reservationRepository.countByStatus(ReservationStatus.CONFIRMED));
        stats.setPendingReservations(reservationRepository.countByStatus(ReservationStatus.PENDING));
        stats.setCancelledReservations(reservationRepository.countByStatus(ReservationStatus.CANCELLED));
        stats.setCompletedReservations(reservationRepository.countByStatus(ReservationStatus.COMPLETED));

        // Inventory stats
        stats.setTotalInventoryItems(inventoryItemRepository.count());
        stats.setLowStockItemsCount(inventoryItemRepository.countLowStockItems());
        stats.setTotalWarehouses(warehouseRepository.count());
        stats.setTotalSuppliers(supplierRepository.count());

        // Revenue calculation
        List<Payment> successPayments = paymentRepository.findByPaymentStatus(PaymentStatus.SUCCESS);
        BigDecimal totalRevenue = successPayments.stream()
            .map(Payment::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalRevenue(totalRevenue);

        // Recent Reservations (top 5)
        List<ReservationResponse> recentReservations = reservationRepository.findAllByOrderByCreatedAtDesc().stream()
            .limit(5)
            .map(res -> {
                ReservationResponse r = new ReservationResponse(res);
                paymentRepository.findByReservationId(res.getId()).ifPresent(p -> r.setPayment(new PaymentResponse(p)));
                return r;
            })
            .collect(Collectors.toList());
        stats.setRecentReservations(recentReservations);

        // Recent Transactions (top 10)
        List<StockTransactionResponse> recentTransactions = stockTransactionRepository.findTop10ByOrderByCreatedAtDesc().stream()
            .map(StockTransactionResponse::new)
            .collect(Collectors.toList());
        stats.setRecentTransactions(recentTransactions);

        // Low stock items
        List<InventoryItemResponse> lowStockItems = inventoryItemRepository.findLowStockItems().stream()
            .map(InventoryItemResponse::new)
            .collect(Collectors.toList());
        stats.setLowStockItems(lowStockItems);

        return stats;
    }
}
