package com.hotel.reservation;

import com.hotel.reservation.dto.StockInRequest;
import com.hotel.reservation.dto.StockOutRequest;
import com.hotel.reservation.dto.StockTransactionResponse;
import com.hotel.reservation.entity.*;
import com.hotel.reservation.exception.InsufficientStockException;
import com.hotel.reservation.repository.*;
import com.hotel.reservation.service.InventoryService;
import com.hotel.reservation.service.StockTransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class InventoryStockTest {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private StockTransactionService stockTransactionService;

    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    private InventoryItem testItem;
    private Warehouse testWarehouse;

    @BeforeEach
    public void setup() {
        Category category = categoryRepository.findByName("TestCategory")
            .orElseGet(() -> categoryRepository.save(new Category("TestCategory", "Testing category")));

        testWarehouse = warehouseRepository.findByCode("WH-TEST")
            .orElseGet(() -> warehouseRepository.save(new Warehouse("Test Warehouse", "WH-TEST", "123 Test St", "500 sq ft")));

        testItem = inventoryItemRepository.findBySku("TEST-SKU-001")
            .orElseGet(() -> inventoryItemRepository.save(new InventoryItem(
                "Test Bath Towels",
                "TEST-SKU-001",
                category,
                50, // Initial quantity
                30, // Min stock level
                "Pieces",
                new BigDecimal("10.00"),
                testWarehouse,
                null,
                null,
                true
            )));
    }

    @Test
    @DisplayName("Should successfully record stock-in and update balance")
    public void testStockIn() {
        int initialQty = testItem.getQuantity();
        StockInRequest inRequest = new StockInRequest(testItem.getId(), 25, null, null, "Supplier delivery", "PO-991");

        StockTransactionResponse response = stockTransactionService.recordStockIn(inRequest);

        assertEquals(TransactionType.STOCK_IN, response.getTransactionType());
        assertEquals(25, response.getQuantity());
        assertEquals(initialQty + 25, response.getBalanceAfter());

        InventoryItem updated = inventoryItemRepository.findById(testItem.getId()).orElseThrow();
        assertEquals(initialQty + 25, updated.getQuantity());
    }

    @Test
    @DisplayName("Should successfully record stock-out and update balance")
    public void testStockOut() {
        int initialQty = testItem.getQuantity();
        StockOutRequest outRequest = new StockOutRequest(testItem.getId(), 15, "Housekeeping usage", "RES-001");

        StockTransactionResponse response = stockTransactionService.recordStockOut(outRequest);

        assertEquals(TransactionType.STOCK_OUT, response.getTransactionType());
        assertEquals(15, response.getQuantity());
        assertEquals(initialQty - 15, response.getBalanceAfter());

        InventoryItem updated = inventoryItemRepository.findById(testItem.getId()).orElseThrow();
        assertEquals(initialQty - 15, updated.getQuantity());
    }

    @Test
    @DisplayName("Should REJECT stock-out that exceeds available quantity (Prevent negative stock)")
    public void testPreventNegativeStock() {
        int initialQty = testItem.getQuantity();
        StockOutRequest outRequest = new StockOutRequest(testItem.getId(), initialQty + 10, "Excessive demand", "RES-999");

        assertThrows(InsufficientStockException.class, () -> {
            stockTransactionService.recordStockOut(outRequest);
        }, "Issuing more stock than available must throw InsufficientStockException");

        // Verify quantity remains unchanged
        InventoryItem updated = inventoryItemRepository.findById(testItem.getId()).orElseThrow();
        assertEquals(initialQty, updated.getQuantity());
    }

    @Test
    @DisplayName("Should accurately detect and report low-stock status when quantity <= minStockLevel")
    public void testLowStockDetection() {
        // Drop stock to min stock level
        int issueAmount = testItem.getQuantity() - testItem.getMinStockLevel();
        StockOutRequest outRequest = new StockOutRequest(testItem.getId(), issueAmount, "Drop to threshold", "TEST-TH");
        stockTransactionService.recordStockOut(outRequest);

        InventoryItem updated = inventoryItemRepository.findById(testItem.getId()).orElseThrow();
        assertTrue(updated.isLowStock(), "Item at or below minimum threshold must flag as low stock");

        List<InventoryItem> lowStockList = inventoryItemRepository.findLowStockItems();
        boolean found = lowStockList.stream().anyMatch(i -> i.getId().equals(testItem.getId()));
        assertTrue(found, "Item must be included in findLowStockItems repository query");
    }
}
