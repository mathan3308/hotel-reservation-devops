package com.hotel.reservation.service;

import com.hotel.reservation.dto.HousekeepingIssueRequest;
import com.hotel.reservation.dto.StockOutRequest;
import com.hotel.reservation.dto.StockTransactionResponse;
import com.hotel.reservation.entity.InventoryItem;
import com.hotel.reservation.entity.Reservation;
import com.hotel.reservation.entity.Room;
import com.hotel.reservation.entity.RoomStatus;
import com.hotel.reservation.exception.BadRequestException;
import com.hotel.reservation.exception.ResourceNotFoundException;
import com.hotel.reservation.repository.InventoryItemRepository;
import com.hotel.reservation.repository.ReservationRepository;
import com.hotel.reservation.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class HousekeepingService {

    private final StockTransactionService stockTransactionService;
    private final InventoryItemRepository inventoryItemRepository;
    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;

    @Autowired
    public HousekeepingService(StockTransactionService stockTransactionService,
                               InventoryItemRepository inventoryItemRepository,
                               ReservationRepository reservationRepository,
                               RoomRepository roomRepository) {
        this.stockTransactionService = stockTransactionService;
        this.inventoryItemRepository = inventoryItemRepository;
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
    }

    /**
     * Issues room preparation amenities (Towels, Bed Linen, Toiletries) for a reservation or room.
     * Generates tracked STOCK_OUT transactions linked to the reservation reference.
     */
    @Transactional
    public List<StockTransactionResponse> issueRoomPreparation(HousekeepingIssueRequest request) {
        List<StockTransactionResponse> transactions = new ArrayList<>();

        String ref = request.getReference();
        Optional<Reservation> reservationOpt = reservationRepository.findByReservationReference(ref);

        String reason = "Room preparation for " + ref;

        // If specific items are provided in request, issue those
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (HousekeepingIssueRequest.ItemQuantity iq : request.getItems()) {
                StockOutRequest stockOut = new StockOutRequest(
                    iq.getItemId(),
                    iq.getQuantity(),
                    reason,
                    ref
                );
                transactions.add(stockTransactionService.recordStockOut(stockOut));
            }
        } else {
            // Standard Room Preparation Kit: 2 Towels, 1 Bedsheet, 2 Soaps, 2 Shampoos
            issueDefaultAmenityIfExists("Towels", 2, reason, ref, transactions);
            issueDefaultAmenityIfExists("Bedsheets", 1, reason, ref, transactions);
            issueDefaultAmenityIfExists("Soap", 2, reason, ref, transactions);
            issueDefaultAmenityIfExists("Shampoo", 2, reason, ref, transactions);
        }

        // If room ID or reservation room exists, mark room status from CLEANING to AVAILABLE
        if (request.getRoomId() != null) {
            roomRepository.findById(request.getRoomId()).ifPresent(r -> {
                if (r.getStatus() == RoomStatus.CLEANING) {
                    r.setStatus(RoomStatus.AVAILABLE);
                    roomRepository.save(r);
                }
            });
        } else if (reservationOpt.isPresent()) {
            Room room = reservationOpt.get().getRoom();
            if (room != null && room.getStatus() == RoomStatus.CLEANING) {
                room.setStatus(RoomStatus.AVAILABLE);
                roomRepository.save(room);
            }
        }

        return transactions;
    }

    private void issueDefaultAmenityIfExists(String itemNameKeyword, int qty, String reason, String ref, List<StockTransactionResponse> list) {
        List<InventoryItem> items = inventoryItemRepository.findAll();
        for (InventoryItem item : items) {
            if (item.getName().toLowerCase().contains(itemNameKeyword.toLowerCase()) && item.getQuantity() >= qty) {
                StockOutRequest outReq = new StockOutRequest(item.getId(), qty, reason, ref);
                list.add(stockTransactionService.recordStockOut(outReq));
                break;
            }
        }
    }
}
