package com.flixcare.controller;

import com.flixcare.dto.WeightRecordDTO;
import com.flixcare.service.WeightRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weight-records")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Weight Records", description = "Weight record management APIs")
public class WeightRecordController {

    private final WeightRecordService weightRecordService;

    @GetMapping
    @Operation(summary = "Get all weight records")
    public ResponseEntity<List<WeightRecordDTO>> getAllWeightRecords() {
        return ResponseEntity.ok(weightRecordService.getAllWeightRecords());
    }

    @GetMapping("/baby/{babyId}")
    @Operation(summary = "Get weight records by baby ID")
    public ResponseEntity<List<WeightRecordDTO>> getWeightRecordsByBabyId(@PathVariable Long babyId) {
        return ResponseEntity.ok(weightRecordService.getWeightRecordsByBabyId(babyId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get weight record by ID")
    public ResponseEntity<WeightRecordDTO> getWeightRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(weightRecordService.getWeightRecordById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new weight record")
    public ResponseEntity<WeightRecordDTO> createWeightRecord(@RequestBody WeightRecordDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(weightRecordService.createWeightRecord(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a weight record")
    public ResponseEntity<WeightRecordDTO> updateWeightRecord(
            @PathVariable Long id,
            @RequestBody WeightRecordDTO dto) {
        return ResponseEntity.ok(weightRecordService.updateWeightRecord(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a weight record")
    public ResponseEntity<Void> deleteWeightRecord(@PathVariable Long id) {
        weightRecordService.deleteWeightRecord(id);
        return ResponseEntity.noContent().build();
    }
}
