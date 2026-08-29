package com.hotel.reservation.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class HousekeepingIssueRequest {

    @NotBlank(message = "Reservation reference or room number is required")
    private String reference;

    private Long roomId;
    private List<ItemQuantity> items;

    public static class ItemQuantity {
        private Long itemId;
        private Integer quantity;

        public ItemQuantity() {}
        public ItemQuantity(Long itemId, Integer quantity) {
            this.itemId = itemId;
            this.quantity = quantity;
        }

        public Long getItemId() { return itemId; }
        public void setItemId(Long itemId) { this.itemId = itemId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public HousekeepingIssueRequest() {}
    public HousekeepingIssueRequest(String reference, Long roomId, List<ItemQuantity> items) {
        this.reference = reference;
        this.roomId = roomId;
        this.items = items;
    }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }
    public List<ItemQuantity> getItems() { return items; }
    public void setItems(List<ItemQuantity> items) { this.items = items; }
}
