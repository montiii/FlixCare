package com.flixcare.controller;

import com.flixcare.dto.BabyDTO;
import com.flixcare.service.BabyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/babies")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BabyController {

    private final BabyService babyService;

    @GetMapping
    public ResponseEntity<List<BabyDTO>> getAllBabies() {
        return ResponseEntity.ok(babyService.getAllBabies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BabyDTO> getBabyById(@PathVariable Long id) {
        return ResponseEntity.ok(babyService.getBabyById(id));
    }

    @PostMapping
    public ResponseEntity<BabyDTO> createBaby(@Valid @RequestBody BabyDTO babyDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(babyService.createBaby(babyDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BabyDTO> updateBaby(@PathVariable Long id, @Valid @RequestBody BabyDTO babyDTO) {
        return ResponseEntity.ok(babyService.updateBaby(id, babyDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBaby(@PathVariable Long id) {
        babyService.deleteBaby(id);
        return ResponseEntity.noContent().build();
    }
}
