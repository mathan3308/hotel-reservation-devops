package com.hotel.reservation.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardStatsResponse {
    // Rooms
    private long totalRooms;
    private long availableRooms;
    private long bookedRooms;
    private long maintenanceRooms;
    private long cleaningRooms;

    // Reservations
    private long totalReservations;
    private long confirmedReservations;
    private long pendingReservations;
    private long cancelledReservations;
    private long completedReservations;

    // Inventory & Warehouses
    private long totalInventoryItems;
    private long lowStockItemsCount;
    private long totalWarehouses;
    private long totalSuppliers;

    // Revenue
    private BigDecimal totalRevenue;

    // Recent activities
    private List<ReservationResponse> recentReservations;
    private List<StockTransactionResponse> recentTransactions;
    private List<InventoryItemResponse> lowStockItems;

    public DashboardStatsResponse() {}

    public long getTotalRooms() { return totalRooms; }
    public void setTotalRooms(long totalRooms) { this.totalRooms = totalRooms; }
    public long getAvailableRooms() { return availableRooms; }
    public void setAvailableRooms(long availableRooms) { this.availableRooms = availableRooms; }
    public long getBookedRooms() { return bookedRooms; }
    public void setBookedRooms(long bookedRooms) { this.bookedRooms = bookedRooms; }
    public long getMaintenanceRooms() { return maintenanceRooms; }
    public void setMaintenanceRooms(long maintenanceRooms) { this.maintenanceRooms = maintenanceRooms; }
    public long getCleaningRooms() { return cleaningRooms; }
    public void setCleaningRooms(long cleaningRooms) { this.cleaningRooms = cleaningRooms; }
    public long getTotalReservations() { return totalReservations; }
    public void setTotalReservations(long totalReservations) { this.totalReservations = totalReservations; }
    public long getConfirmedReservations() { return confirmedReservations; }
    public void setConfirmedReservations(long confirmedReservations) { this.confirmedReservations = confirmedReservations; }
    public long getPendingReservations() { return pendingReservations; }
    public void setPendingReservations(long pendingReservations) { this.pendingReservations = pendingReservations; }
    public long getCancelledReservations() { return cancelledReservations; }
    public void setCancelledReservations(long cancelledReservations) { this.cancelledReservations = cancelledReservations; }
    public long getCompletedReservations() { return completedReservations; }
    public void setCompletedReservations(long completedReservations) { this.completedReservations = completedReservations; }
    public long getTotalInventoryItems() { return totalInventoryItems; }
    public void setTotalInventoryItems(long totalInventoryItems) { this.totalInventoryItems = totalInventoryItems; }
    public long getLowStockItemsCount() { return lowStockItemsCount; }
    public void setLowStockItemsCount(long lowStockItemsCount) { this.lowStockItemsCount = lowStockItemsCount; }
    public long getTotalWarehouses() { return totalWarehouses; }
    public void setTotalWarehouses(long totalWarehouses) { this.totalWarehouses = totalWarehouses; }
    public long getTotalSuppliers() { return totalSuppliers; }
    public void setTotalSuppliers(long totalSuppliers) { this.totalSuppliers = totalSuppliers; }
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
    public List<ReservationResponse> getRecentReservations() { return recentReservations; }
    public void setRecentReservations(List<ReservationResponse> recentReservations) { this.recentReservations = recentReservations; }
    public List<StockTransactionResponse> getRecentTransactions() { return recentTransactions; }
    public void setRecentTransactions(List<StockTransactionResponse> recentTransactions) { this.recentTransactions = recentTransactions; }
    public List<InventoryItemResponse> getLowStockItems() { return lowStockItems; }
    public void setLowStockItems(List<InventoryItemResponse> lowStockItems) { this.lowStockItems = lowStockItems; }
}
