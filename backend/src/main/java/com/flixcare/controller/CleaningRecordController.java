package com.flixcare.controller;

import com.flixcare.dto.CleaningRecordDTO;
import com.flixcare.service.CleaningRecordService;
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
public class CleaningRecordController {

    private final CleaningRecordService cleaningRecordService;

    @GetMapping
    public ResponseEntity<List<CleaningRecordDTO>> getAllCleaningRecords() {
        return ResponseEntity.ok(cleaningRecordService.getAllCleaningRecords());
    }

    @GetMapping("/baby/{babyId}")
    public ResponseEntity<List<CleaningRecordDTO>> getCleaningRecordsByBaby(@PathVariable Long babyId) {
        return ResponseEntity.ok(cleaningRecordService.getCleaningRecordsByBaby(babyId));
    }

    @GetMapping("/baby/{babyId}/range")
    public ResponseEntity<List<CleaningRecordDTO>> getCleaningRecordsByBabyAndDateRange(
            @PathVariable Long babyId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(cleaningRecordService.getCleaningRecordsByBabyAndDateRange(babyId, start, end));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CleaningRecordDTO> getCleaningRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(cleaningRecordService.getCleaningRecordById(id));
    }

    @PostMapping
    public ResponseEntity<CleaningRecordDTO> createCleaningRecord(@Valid @RequestBody CleaningRecordDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cleaningRecordService.createCleaningRecord(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CleaningRecordDTO> updateCleaningRecord(@PathVariable Long id, @Valid @RequestBody CleaningRecordDTO dto) {
        return ResponseEntity.ok(cleaningRecordService.updateCleaningRecord(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCleaningRecord(@PathVariable Long id) {
        cleaningRecordService.deleteCleaningRecord(id);
        return ResponseEntity.noContent().build();
    }
}
