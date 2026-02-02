package com.flixcare.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("username", authentication.getName());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body(Map.of("status", "error", "message", "Invalid credentials"));
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, String>> validate(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "valid");
            response.put("username", authentication.getName());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body(Map.of("status", "invalid"));
    }
}
