package com.hotel.reservation.config;

import com.hotel.reservation.entity.*;
import com.hotel.reservation.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final RoomRepository roomRepository;
    private final CategoryRepository categoryRepository;
    private final WarehouseRepository warehouseRepository;
    private final WarehouseLocationRepository locationRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final StockTransactionRepository transactionRepository;
    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(UserRepository userRepository,
                           RoomTypeRepository roomTypeRepository,
                           RoomRepository roomRepository,
                           CategoryRepository categoryRepository,
                           WarehouseRepository warehouseRepository,
                           WarehouseLocationRepository locationRepository,
                           SupplierRepository supplierRepository,
                           InventoryItemRepository inventoryItemRepository,
                           StockTransactionRepository transactionRepository,
                           ReservationRepository reservationRepository,
                           PaymentRepository paymentRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roomTypeRepository = roomTypeRepository;
        this.roomRepository = roomRepository;
        this.categoryRepository = categoryRepository;
        this.warehouseRepository = warehouseRepository;
        this.locationRepository = locationRepository;
        this.supplierRepository = supplierRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.transactionRepository = transactionRepository;
        this.reservationRepository = reservationRepository;
        this.paymentRepository = paymentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        logger.info("Checking database demo seed data initialization...");

        // 1. Seed Users
        User admin = initUser("admin", "admin@hotel.com", "admin123", "System Administrator", "+1-800-555-0199", Role.ROLE_ADMIN);
        User staff = initUser("staff", "staff@hotel.com", "staff123", "Housekeeping Operations Lead", "+1-800-555-0144", Role.ROLE_STAFF);
        User customer = initUser("customer", "customer@hotel.com", "customer123", "Eleanor Vance", "+1-800-555-0188", Role.ROLE_CUSTOMER);
        initUser("john_doe", "john.doe@example.com", "customer123", "Johnathan Doe", "+1-800-555-0122", Role.ROLE_CUSTOMER);

        // 2. Seed Room Types
        RoomType single = initRoomType("Single Classic", "Cozy standard room ideal for solo business travellers with ergonomic workspace and high-speed Wi-Fi.", new BigDecimal("85.00"), 1, "High-speed Wi-Fi, Desk, Smart TV, En-suite Shower", "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80");
        RoomType doubleType = initRoomType("Double Deluxe", "Spacious room with a queen bed, city views, modern amenities, and ambient lighting.", new BigDecimal("145.00"), 2, "Queen Bed, Smart TV, Mini Bar, Balcony, Rain Shower", "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80");
        RoomType executive = initRoomType("Executive Suite", "Luxurious suite featuring a separate living room, plush king bed, deep soaking tub, and skyline views.", new BigDecimal("260.00"), 3, "King Bed, Living Area, Jacuzzi, Espresso Machine, Butler Service", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80");
        RoomType presidential = initRoomType("Presidential Penthouse", "Ultra-luxurious top-floor penthouse with panoramic ocean views, private terrace, and personal chef dining.", new BigDecimal("650.00"), 6, "Panoramic Terrace, 2 Master Bedrooms, Private Bar, Dining Area, Spa Bath", "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80");

        // 3. Seed Rooms (at least 12 rooms)
        Room r101 = initRoom("101", single, new BigDecimal("85.00"), 1, RoomStatus.AVAILABLE, "1st Floor", "Quiet corner single room facing the interior courtyard garden.");
        Room r102 = initRoom("102", single, new BigDecimal("85.00"), 1, RoomStatus.AVAILABLE, "1st Floor", "Single room with easy elevator access and morning sun.");
        Room r103 = initRoom("103", doubleType, new BigDecimal("145.00"), 2, RoomStatus.AVAILABLE, "1st Floor", "Double bedroom overlooking the front fountain plaza.");
        Room r201 = initRoom("201", doubleType, new BigDecimal("145.00"), 2, RoomStatus.AVAILABLE, "2nd Floor", "Spacious double bedroom with private balcony.");
        Room r202 = initRoom("202", doubleType, new BigDecimal("145.00"), 2, RoomStatus.BOOKED, "2nd Floor", "Double deluxe room with pool-side view.");
        Room r205 = initRoom("205", doubleType, new BigDecimal("145.00"), 2, RoomStatus.CLEANING, "2nd Floor", "Deluxe double room undergoing housekeeping preparation.");
        Room r301 = initRoom("301", executive, new BigDecimal("260.00"), 3, RoomStatus.AVAILABLE, "3rd Floor", "Executive suite with panoramic city skyline panorama.");
        Room r302 = initRoom("302", executive, new BigDecimal("260.00"), 3, RoomStatus.AVAILABLE, "3rd Floor", "Executive suite with master bedroom and private study.");
        Room r303 = initRoom("303", executive, new BigDecimal("260.00"), 3, RoomStatus.MAINTENANCE, "3rd Floor", "Executive suite temporarily scheduled for HVAC maintenance.");
        Room r401 = initRoom("401", presidential, new BigDecimal("650.00"), 6, RoomStatus.AVAILABLE, "4th Floor Penthouse", "Grand penthouse with private terrace and bespoke furnishings.");
        Room r402 = initRoom("402", presidential, new BigDecimal("650.00"), 6, RoomStatus.AVAILABLE, "4th Floor Penthouse", "Oceanfront penthouse with floor-to-ceiling glass windows.");
        Room r104 = initRoom("104", single, new BigDecimal("85.00"), 1, RoomStatus.AVAILABLE, "1st Floor", "Comfort single room with minimalist Scandinavian decor.");

        // 4. Seed Inventory Categories
        Category linen = initCategory("Linen & Bedding", "Hotel-grade luxury bedsheets, pillows, duvets, and bath towels.");
        Category toiletries = initCategory("Toiletries & Amenities", "Eco-friendly soaps, organic shampoos, lotions, and toothbrushes.");
        Category cleaning = initCategory("Housekeeping & Cleaning", "Industrial grade disinfectants, detergents, and sanitizers.");
        Category beverages = initCategory("Beverages & Minibar", "Bottled natural spring water, sparkling juices, coffee, and teas.");

        // 5. Seed Warehouses
        Warehouse whMain = initWarehouse("Main Hotel Central Warehouse", "WH-MAIN", "Basement Logistics Hub, Building A", "5,000 sq ft climate controlled");
        Warehouse whWest = initWarehouse("Housekeeping Depot West", "WH-WEST", "Floor 2 Service Corridor, Wing B", "1,200 sq ft quick access");

        // 6. Seed Warehouse Locations
        WarehouseLocation locA1 = initLocation(whMain, "A-01", "Row A - Bed Linen & Towels Racks");
        WarehouseLocation locA2 = initLocation(whMain, "A-02", "Row A - Toiletries & Cosmetics Bins");
        WarehouseLocation locB1 = initLocation(whMain, "B-01", "Row B - Bottled Beverages Pallets");
        WarehouseLocation locB2 = initLocation(whMain, "B-02", "Row B - Chemical & Sanitizer Storage");
        WarehouseLocation locW1 = initLocation(whWest, "W-01", "West Wing Daily Housekeeping Cart Staging");

        // 7. Seed Suppliers
        Supplier royalTextile = initSupplier("Royal Textile Mills", "Margaret Sterling", "margaret@royaltextiles.com", "+1-800-444-1234", "450 Industrial Parkway, Greenville, SC");
        Supplier ecoClean = initSupplier("EcoClean Amenities Ltd", "David Vance", "orders@ecoclean.com", "+1-800-444-5678", "88 Green Valley Way, Portland, OR");
        Supplier pureSpring = initSupplier("Pure Spring Water Co", "Robert Chen", "b2b@purespring.com", "+1-800-444-9988", "12 Cascade Mountain Rd, Boulder, CO");

        // 8. Seed Inventory Items (Including low-stock items for immediate dashboard demonstration)
        InventoryItem towels = initItem("Egyptian Cotton Bath Towels", "LIN-TWL-001", linen, 45, 50, "Pieces", new BigDecimal("14.50"), whMain, locA1, royalTextile); // LOW STOCK
        InventoryItem bedsheets = initItem("King Silk Bedsheet Sets", "LIN-SHT-002", linen, 80, 30, "Sets", new BigDecimal("45.00"), whMain, locA1, royalTextile);
        InventoryItem soaps = initItem("Organic Oatmeal Guest Soap 50g", "TOI-SOP-001", toiletries, 35, 100, "Bars", new BigDecimal("1.25"), whMain, locA2, ecoClean); // LOW STOCK
        InventoryItem shampoos = initItem("Herbal Lavender Shampoo 100ml", "TOI-SHP-002", toiletries, 160, 60, "Bottles", new BigDecimal("2.10"), whMain, locA2, ecoClean);
        InventoryItem water = initItem("Natural Spring Mineral Water 500ml", "BEV-WTR-001", beverages, 420, 150, "Bottles", new BigDecimal("0.80"), whMain, locB1, pureSpring);
        InventoryItem sanitizer = initItem("Surface Sanitizer Disinfectant 5L", "CLN-SAN-001", cleaning, 25, 10, "Containers", new BigDecimal("18.50"), whMain, locB2, ecoClean);
        InventoryItem pillows = initItem("Hypoallergenic Memory Foam Pillow", "LIN-PLW-003", linen, 55, 20, "Pieces", new BigDecimal("22.00"), whMain, locA1, royalTextile);

        // 9. Initial Seed Transactions
        initInitialTransaction(towels, 45, TransactionType.STOCK_IN, whMain, locA1, "Initial baseline inventory stock", "PO-2026-001", admin);
        initInitialTransaction(bedsheets, 80, TransactionType.STOCK_IN, whMain, locA1, "Initial baseline inventory stock", "PO-2026-002", admin);
        initInitialTransaction(soaps, 35, TransactionType.STOCK_IN, whMain, locA2, "Initial baseline inventory stock", "PO-2026-003", admin);
        initInitialTransaction(shampoos, 160, TransactionType.STOCK_IN, whMain, locA2, "Initial baseline inventory stock", "PO-2026-004", admin);

        // 10. Initial Demo Reservation & Payment
        initReservationWithPayment(
            "RES-2026-00001",
            customer,
            r202,
            LocalDate.now().plusDays(1),
            LocalDate.now().plusDays(4),
            2,
            3,
            r202.getPricePerNight(),
            r202.getPricePerNight().multiply(BigDecimal.valueOf(3)),
            ReservationStatus.CONFIRMED,
            "Early check-in requested if possible.",
            PaymentMethod.CREDIT_CARD,
            "TXN-DEMO-9901"
        );

        logger.info("Database seed initialization completed successfully.");
    }

    private User initUser(String username, String email, String rawPassword, String fullName, String phone, Role role) {
        return userRepository.findByUsername(username).orElseGet(() -> {
            User user = new User(username, email, passwordEncoder.encode(rawPassword), fullName, phone, role);
            return userRepository.save(user);
        });
    }

    private RoomType initRoomType(String name, String description, BigDecimal basePrice, Integer defaultCapacity, String amenities, String imageUrl) {
        return roomTypeRepository.findByName(name).orElseGet(() -> {
            RoomType rt = new RoomType(name, description, basePrice, defaultCapacity, amenities, imageUrl);
            return roomTypeRepository.save(rt);
        });
    }

    private Room initRoom(String roomNumber, RoomType roomType, BigDecimal price, Integer capacity, RoomStatus status, String floor, String description) {
        return roomRepository.findByRoomNumber(roomNumber).orElseGet(() -> {
            Room r = new Room(roomNumber, roomType, price, capacity, status, floor, description);
            return roomRepository.save(r);
        });
    }

    private Category initCategory(String name, String description) {
        return categoryRepository.findByName(name).orElseGet(() -> {
            Category c = new Category(name, description);
            return categoryRepository.save(c);
        });
    }

    private Warehouse initWarehouse(String name, String code, String address, String capacity) {
        return warehouseRepository.findByCode(code).orElseGet(() -> {
            Warehouse w = new Warehouse(name, code, address, capacity);
            return warehouseRepository.save(w);
        });
    }

    private WarehouseLocation initLocation(Warehouse warehouse, String code, String description) {
        return locationRepository.findByWarehouseIdAndCode(warehouse.getId(), code).orElseGet(() -> {
            WarehouseLocation loc = new WarehouseLocation(warehouse, code, description);
            return locationRepository.save(loc);
        });
    }

    private Supplier initSupplier(String name, String contactPerson, String email, String phone, String address) {
        return supplierRepository.findByName(name).orElseGet(() -> {
            Supplier s = new Supplier(name, contactPerson, email, phone, address);
            return supplierRepository.save(s);
        });
    }

    private InventoryItem initItem(String name, String sku, Category category, Integer qty, Integer minStock,
                                   String unit, BigDecimal unitPrice, Warehouse warehouse,
                                   WarehouseLocation location, Supplier supplier) {
        return inventoryItemRepository.findBySku(sku).orElseGet(() -> {
            InventoryItem item = new InventoryItem(name, sku, category, qty, minStock, unit, unitPrice, warehouse, location, supplier, true);
            return inventoryItemRepository.save(item);
        });
    }

    private void initInitialTransaction(InventoryItem item, int qty, TransactionType type, Warehouse wh, WarehouseLocation loc, String reason, String ref, User user) {
        if (transactionRepository.findByItemIdOrderByCreatedAtDesc(item.getId()).isEmpty()) {
            StockTransaction st = new StockTransaction(item, qty, type, wh, loc, wh, loc, reason, ref, user, item.getQuantity());
            transactionRepository.save(st);
        }
    }

    private void initReservationWithPayment(String ref, User user, Room room, LocalDate checkIn, LocalDate checkOut,
                                           int guests, int nights, BigDecimal pricePerNight, BigDecimal totalAmount,
                                           ReservationStatus status, String specialRequests,
                                           PaymentMethod method, String txnRef) {
        if (reservationRepository.findByReservationReference(ref).isEmpty()) {
            Reservation res = new Reservation(ref, user, room, checkIn, checkOut, guests, nights, pricePerNight, totalAmount, status, specialRequests);
            Reservation savedRes = reservationRepository.save(res);

            Payment payment = new Payment(savedRes, totalAmount, method, PaymentStatus.SUCCESS, txnRef);
            paymentRepository.save(payment);
        }
    }
}
