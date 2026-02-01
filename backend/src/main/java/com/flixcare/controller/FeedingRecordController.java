package com.flixcare.controller;

import com.flixcare.dto.FeedingRecordDTO;
import com.flixcare.service.FeedingRecordService;
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
@RequestMapping("/api/feeding-records")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Feeding Records", description = "APIs for managing baby feeding records")
public class FeedingRecordController {

    private final FeedingRecordService feedingRecordService;

    @GetMapping
    @Operation(summary = "Get all feeding records", description = "Retrieve all feeding records")
    public ResponseEntity<List<FeedingRecordDTO>> getAllFeedingRecords() {
        return ResponseEntity.ok(feedingRecordService.getAllFeedingRecords());
    }

    @GetMapping("/baby/{babyId}")
    @Operation(summary = "Get feeding records by baby", description = "Retrieve feeding records for a specific baby")
    public ResponseEntity<List<FeedingRecordDTO>> getFeedingRecordsByBaby(@PathVariable Long babyId) {
        return ResponseEntity.ok(feedingRecordService.getFeedingRecordsByBaby(babyId));
    }

    @GetMapping("/baby/{babyId}/range")
    @Operation(summary = "Get feeding records by date range", description = "Retrieve feeding records for a baby within a date range")
    public ResponseEntity<List<FeedingRecordDTO>> getFeedingRecordsByBabyAndDateRange(
            @PathVariable Long babyId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(feedingRecordService.getFeedingRecordsByBabyAndDateRange(babyId, start, end));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get feeding record by ID", description = "Retrieve a specific feeding record")
    public ResponseEntity<FeedingRecordDTO> getFeedingRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(feedingRecordService.getFeedingRecordById(id));
    }

    @PostMapping
    @Operation(summary = "Create feeding record", description = "Create a new feeding record")
    public ResponseEntity<FeedingRecordDTO> createFeedingRecord(@Valid @RequestBody FeedingRecordDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(feedingRecordService.createFeedingRecord(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update feeding record", description = "Update an existing feeding record")
    public ResponseEntity<FeedingRecordDTO> updateFeedingRecord(@PathVariable Long id, @Valid @RequestBody FeedingRecordDTO dto) {
        return ResponseEntity.ok(feedingRecordService.updateFeedingRecord(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete feeding record", description = "Delete a feeding record")
    public ResponseEntity<Void> deleteFeedingRecord(@PathVariable Long id) {
        feedingRecordService.deleteFeedingRecord(id);
        return ResponseEntity.noContent().build();
    }
}
