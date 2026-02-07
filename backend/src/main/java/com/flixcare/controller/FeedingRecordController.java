package com.flixcare.controller;

import com.flixcare.dto.FeedingRecordDTO;
import com.flixcare.service.FeedingRecordService;
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
public class FeedingRecordController {

    private final FeedingRecordService feedingRecordService;

    @GetMapping
    public ResponseEntity<List<FeedingRecordDTO>> getAllFeedingRecords() {
        return ResponseEntity.ok(feedingRecordService.getAllFeedingRecords());
    }

    @GetMapping("/baby/{babyId}")
    public ResponseEntity<List<FeedingRecordDTO>> getFeedingRecordsByBaby(@PathVariable Long babyId) {
        return ResponseEntity.ok(feedingRecordService.getFeedingRecordsByBaby(babyId));
    }

    @GetMapping("/baby/{babyId}/range")
    public ResponseEntity<List<FeedingRecordDTO>> getFeedingRecordsByBabyAndDateRange(
            @PathVariable Long babyId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(feedingRecordService.getFeedingRecordsByBabyAndDateRange(babyId, start, end));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeedingRecordDTO> getFeedingRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(feedingRecordService.getFeedingRecordById(id));
    }

    @PostMapping
    public ResponseEntity<FeedingRecordDTO> createFeedingRecord(@Valid @RequestBody FeedingRecordDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(feedingRecordService.createFeedingRecord(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeedingRecordDTO> updateFeedingRecord(@PathVariable Long id, @Valid @RequestBody FeedingRecordDTO dto) {
        return ResponseEntity.ok(feedingRecordService.updateFeedingRecord(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedingRecord(@PathVariable Long id) {
        feedingRecordService.deleteFeedingRecord(id);
        return ResponseEntity.noContent().build();
    }
}
