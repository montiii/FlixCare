package com.flixcare.controller;

import com.flixcare.dto.BabyDTO;
import com.flixcare.service.BabyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Baby Management", description = "APIs for managing baby profiles")
public class BabyController {

    private final BabyService babyService;

    @GetMapping
    @Operation(summary = "Get all babies", description = "Retrieve a list of all registered babies")
    public ResponseEntity<List<BabyDTO>> getAllBabies() {
        return ResponseEntity.ok(babyService.getAllBabies());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get baby by ID", description = "Retrieve a specific baby by their ID")
    public ResponseEntity<BabyDTO> getBabyById(@PathVariable Long id) {
        return ResponseEntity.ok(babyService.getBabyById(id));
    }

    @PostMapping
    @Operation(summary = "Create new baby", description = "Register a new baby profile")
    public ResponseEntity<BabyDTO> createBaby(@Valid @RequestBody BabyDTO babyDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(babyService.createBaby(babyDTO));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update baby", description = "Update an existing baby profile")
    public ResponseEntity<BabyDTO> updateBaby(@PathVariable Long id, @Valid @RequestBody BabyDTO babyDTO) {
        return ResponseEntity.ok(babyService.updateBaby(id, babyDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete baby", description = "Delete a baby profile")
    public ResponseEntity<Void> deleteBaby(@PathVariable Long id) {
        babyService.deleteBaby(id);
        return ResponseEntity.noContent().build();
    }
}
