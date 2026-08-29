# Automated Testing Strategy & Verification Report

## 1. Test Suite Architecture

The system features comprehensive automated unit and integration tests executing against an in-memory H2 database under `application-test.yml`.

---

## 2. Test Breakdown (17 Tests Executed, 0 Failures, 0 Errors)

### A. Reservation Overlap Algorithm Tests (`ReservationOverlapTest.java`)
Validates the mathematical collision inequality:
$$\text{Collision: } \text{reqCheckIn} < \text{existingCheckOut} \land \text{reqCheckOut} > \text{existingCheckIn}$$

1. `testExactSameDates_ShouldOverlap()`: Complete date collision detection.
2. `testRequestedStartsInsideExisting_ShouldOverlap()`: Late check-in collision detection.
3. `testRequestedEndsInsideExisting_ShouldOverlap()`: Early check-out collision detection.
4. `testRequestedEnclosesExisting_ShouldOverlap()`: Enclosing duration collision detection.
5. `testRequestedIsEnclosedByExisting_ShouldOverlap()`: Sub-interval collision detection.
6. `testRequestedEndsOnExistingCheckIn_ShouldNotOverlap()`: Back-to-back checkout/checkin allowed.
7. `testRequestedStartsOnExistingCheckOut_ShouldNotOverlap()`: Next-day checkin allowed.
8. `testCancelledReservation_ShouldBeIgnored()`: Cancelled bookings do not block availability.

### B. Inventory & Warehouse Logistics Tests (`InventoryStockTest.java`)
1. `testStockIn_IncreasesQuantityAndCreatesTransaction()`: Verifies positive balance updates.
2. `testStockOut_DecreasesQuantityAndCreatesTransaction()`: Verifies consumption deduction.
3. `testStockOut_InsufficientStock_ThrowsException()`: Guarantees negative inventory prevention.
4. `testLowStockThreshold_Detection()`: Verifies alert trigger when `quantity <= min_stock_level`.
5. `testStockTransfer_MovesQuantityBetweenWarehouses()`: Verifies multi-warehouse movement.
6. `testStockAdjustment_CorrectsBalance()`: Verifies physical audit adjustment.

### C. Security & Authentication Tests (`AuthServiceTest.java`)
1. `testRegisterUser_Success()`: Verifies user persistence with BCrypt password hashing.
2. `testLogin_Success_ReturnsJwtToken()`: Verifies credential authentication and JJWT token issuance.
3. `testLogin_InvalidPassword_ThrowsException()`: Verifies unauthorized access rejection.

---

## 3. Running Automated Tests Locally

```bash
cd backend
mvn test
```
Expected Output:
```
[INFO] Results:
[INFO] 
[INFO] Tests run: 17, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] BUILD SUCCESS
```
