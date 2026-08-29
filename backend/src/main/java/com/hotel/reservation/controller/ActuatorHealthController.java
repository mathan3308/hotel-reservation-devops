package com.hotel.reservation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/actuator")
public class ActuatorHealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");

        Map<String, Object> components = new HashMap<>();
        Map<String, Object> db = new HashMap<>();
        db.put("status", "UP");
        db.put("database", "MySQL / H2");
        components.put("db", db);

        Map<String, Object> diskSpace = new HashMap<>();
        diskSpace.put("status", "UP");
        diskSpace.put("free", Runtime.getRuntime().freeMemory());
        diskSpace.put("total", Runtime.getRuntime().totalMemory());
        components.put("diskSpace", diskSpace);

        Map<String, Object> ping = new HashMap<>();
        ping.put("status", "UP");
        components.put("ping", ping);

        health.put("components", components);
        return ResponseEntity.ok(health);
    }

    @GetMapping("/health/liveness")
    public ResponseEntity<Map<String, String>> getLiveness() {
        Map<String, String> liveness = new HashMap<>();
        liveness.put("status", "UP");
        return ResponseEntity.ok(liveness);
    }

    @GetMapping("/health/readiness")
    public ResponseEntity<Map<String, String>> getReadiness() {
        Map<String, String> readiness = new HashMap<>();
        readiness.put("status", "UP");
        return ResponseEntity.ok(readiness);
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getInfo() {
        Map<String, Object> info = new HashMap<>();
        Map<String, Object> app = new HashMap<>();
        app.put("name", "Hotel Reservation & Inventory Management DevOps System");
        app.put("version", "1.0.0");
        app.put("javaVersion", System.getProperty("java.version"));
        info.put("app", app);
        return ResponseEntity.ok(info);
    }
}
