package com.flixcare.controller;

import com.flixcare.dto.CleaningRecordDTO;
import com.flixcare.service.CleaningRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/cleaning-records")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Cleaning Records", description = "APIs for managing baby cleaning records")
public class CleaningRecordController {

    private final CleaningRecordService cleaningRecordService;

    @GetMapping
    @Operation(summary = "Get all cleaning records", description = "Retrieve all cleaning records")
    public ResponseEntity<List<CleaningRecordDTO>> getAllCleaningRecords() {
        return ResponseEntity.ok(cleaningRecordService.getAllCleaningRecords());
    }

    @GetMapping("/baby/{babyId}")
    @Operation(summary = "Get cleaning records by baby", description = "Retrieve cleaning records for a specific baby")
    public ResponseEntity<List<CleaningRecordDTO>> getCleaningRecordsByBaby(@PathVariable Long babyId) {
        return ResponseEntity.ok(cleaningRecordService.getCleaningRecordsByBaby(babyId));
    }

    @GetMapping("/baby/{babyId}/range")
    @Operation(summary = "Get cleaning records by date range", description = "Retrieve cleaning records for a baby within a date range")
    public ResponseEntity<List<CleaningRecordDTO>> getCleaningRecordsByBabyAndDateRange(
            @PathVariable Long babyId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(cleaningRecordService.getCleaningRecordsByBabyAndDateRange(babyId, start, end));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get cleaning record by ID", description = "Retrieve a specific cleaning record")
    public ResponseEntity<CleaningRecordDTO> getCleaningRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(cleaningRecordService.getCleaningRecordById(id));
    }

    @PostMapping
    @Operation(summary = "Create cleaning record", description = "Create a new cleaning record")
    public ResponseEntity<CleaningRecordDTO> createCleaningRecord(@Valid @RequestBody CleaningRecordDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cleaningRecordService.createCleaningRecord(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update cleaning record", description = "Update an existing cleaning record")
    public ResponseEntity<CleaningRecordDTO> updateCleaningRecord(@PathVariable Long id, @Valid @RequestBody CleaningRecordDTO dto) {
        return ResponseEntity.ok(cleaningRecordService.updateCleaningRecord(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete cleaning record", description = "Delete a cleaning record")
    public ResponseEntity<Void> deleteCleaningRecord(@PathVariable Long id) {
        cleaningRecordService.deleteCleaningRecord(id);
        return ResponseEntity.noContent().build();
    }
}
