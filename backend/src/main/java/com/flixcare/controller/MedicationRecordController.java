package com.flixcare.controller;

import com.flixcare.dto.MedicationRecordDTO;
import com.flixcare.service.MedicationRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medication-records")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MedicationRecordController {

    private final MedicationRecordService medicationRecordService;

    @GetMapping
    public ResponseEntity<List<MedicationRecordDTO>> getAllMedicationRecords() {
        return ResponseEntity.ok(medicationRecordService.getAllMedicationRecords());
    }

    @GetMapping("/baby/{babyId}")
    public ResponseEntity<List<MedicationRecordDTO>> getMedicationRecordsByBaby(@PathVariable Long babyId) {
        return ResponseEntity.ok(medicationRecordService.getMedicationRecordsByBabyId(babyId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicationRecordDTO> getMedicationRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(medicationRecordService.getMedicationRecordById(id));
    }

    @PostMapping
    public ResponseEntity<MedicationRecordDTO> createMedicationRecord(@RequestBody MedicationRecordDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(medicationRecordService.createMedicationRecord(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicationRecordDTO> updateMedicationRecord(
            @PathVariable Long id,
            @RequestBody MedicationRecordDTO dto) {
        return ResponseEntity.ok(medicationRecordService.updateMedicationRecord(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicationRecord(@PathVariable Long id) {
        medicationRecordService.deleteMedicationRecord(id);
        return ResponseEntity.noContent().build();
    }
}
