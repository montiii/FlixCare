package com.flixcare.controller;

import com.flixcare.dto.TemperatureRecordDTO;
import com.flixcare.service.TemperatureRecordService;
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
public class TemperatureRecordController {

    private final TemperatureRecordService temperatureRecordService;

    @GetMapping
    public ResponseEntity<List<TemperatureRecordDTO>> getAllTemperatureRecords() {
        return ResponseEntity.ok(temperatureRecordService.getAllTemperatureRecords());
    }

    @GetMapping("/baby/{babyId}")
    public ResponseEntity<List<TemperatureRecordDTO>> getTemperatureRecordsByBaby(@PathVariable Long babyId) {
        return ResponseEntity.ok(temperatureRecordService.getTemperatureRecordsByBaby(babyId));
    }

    @GetMapping("/baby/{babyId}/range")
    public ResponseEntity<List<TemperatureRecordDTO>> getTemperatureRecordsByBabyAndDateRange(
            @PathVariable Long babyId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(temperatureRecordService.getTemperatureRecordsByBabyAndDateRange(babyId, start, end));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TemperatureRecordDTO> getTemperatureRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(temperatureRecordService.getTemperatureRecordById(id));
    }

    @PostMapping
    public ResponseEntity<TemperatureRecordDTO> createTemperatureRecord(@Valid @RequestBody TemperatureRecordDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(temperatureRecordService.createTemperatureRecord(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TemperatureRecordDTO> updateTemperatureRecord(@PathVariable Long id, @Valid @RequestBody TemperatureRecordDTO dto) {
        return ResponseEntity.ok(temperatureRecordService.updateTemperatureRecord(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemperatureRecord(@PathVariable Long id) {
        temperatureRecordService.deleteTemperatureRecord(id);
        return ResponseEntity.noContent().build();
    }
}
