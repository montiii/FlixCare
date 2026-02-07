package com.flixcare.controller;

import com.flixcare.dto.WeightRecordDTO;
import com.flixcare.service.WeightRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weight-records")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WeightRecordController {

    private final WeightRecordService weightRecordService;

    @GetMapping
    public ResponseEntity<List<WeightRecordDTO>> getAllWeightRecords() {
        return ResponseEntity.ok(weightRecordService.getAllWeightRecords());
    }

    @GetMapping("/baby/{babyId}")
    public ResponseEntity<List<WeightRecordDTO>> getWeightRecordsByBabyId(@PathVariable Long babyId) {
        return ResponseEntity.ok(weightRecordService.getWeightRecordsByBabyId(babyId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WeightRecordDTO> getWeightRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(weightRecordService.getWeightRecordById(id));
    }

    @PostMapping
    public ResponseEntity<WeightRecordDTO> createWeightRecord(@RequestBody WeightRecordDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(weightRecordService.createWeightRecord(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WeightRecordDTO> updateWeightRecord(
            @PathVariable Long id,
            @RequestBody WeightRecordDTO dto) {
        return ResponseEntity.ok(weightRecordService.updateWeightRecord(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWeightRecord(@PathVariable Long id) {
        weightRecordService.deleteWeightRecord(id);
        return ResponseEntity.noContent().build();
    }
}
