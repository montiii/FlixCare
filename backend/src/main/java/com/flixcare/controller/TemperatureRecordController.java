package com.flixcare.controller;

import com.flixcare.dto.TemperatureRecordDTO;
import com.flixcare.service.TemperatureRecordService;
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
@RequestMapping("/api/temperature-records")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Temperature Records", description = "APIs for managing baby temperature records")
public class TemperatureRecordController {

    private final TemperatureRecordService temperatureRecordService;

    @GetMapping
    @Operation(summary = "Get all temperature records", description = "Retrieve all temperature records")
    public ResponseEntity<List<TemperatureRecordDTO>> getAllTemperatureRecords() {
        return ResponseEntity.ok(temperatureRecordService.getAllTemperatureRecords());
    }

    @GetMapping("/baby/{babyId}")
    @Operation(summary = "Get temperature records by baby", description = "Retrieve temperature records for a specific baby")
    public ResponseEntity<List<TemperatureRecordDTO>> getTemperatureRecordsByBaby(@PathVariable Long babyId) {
        return ResponseEntity.ok(temperatureRecordService.getTemperatureRecordsByBaby(babyId));
    }

    @GetMapping("/baby/{babyId}/range")
    @Operation(summary = "Get temperature records by date range", description = "Retrieve temperature records for a baby within a date range")
    public ResponseEntity<List<TemperatureRecordDTO>> getTemperatureRecordsByBabyAndDateRange(
            @PathVariable Long babyId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(temperatureRecordService.getTemperatureRecordsByBabyAndDateRange(babyId, start, end));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get temperature record by ID", description = "Retrieve a specific temperature record")
    public ResponseEntity<TemperatureRecordDTO> getTemperatureRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(temperatureRecordService.getTemperatureRecordById(id));
    }

    @PostMapping
    @Operation(summary = "Create temperature record", description = "Create a new temperature record")
    public ResponseEntity<TemperatureRecordDTO> createTemperatureRecord(@Valid @RequestBody TemperatureRecordDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(temperatureRecordService.createTemperatureRecord(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update temperature record", description = "Update an existing temperature record")
    public ResponseEntity<TemperatureRecordDTO> updateTemperatureRecord(@PathVariable Long id, @Valid @RequestBody TemperatureRecordDTO dto) {
        return ResponseEntity.ok(temperatureRecordService.updateTemperatureRecord(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete temperature record", description = "Delete a temperature record")
    public ResponseEntity<Void> deleteTemperatureRecord(@PathVariable Long id) {
        temperatureRecordService.deleteTemperatureRecord(id);
        return ResponseEntity.noContent().build();
    }
}
