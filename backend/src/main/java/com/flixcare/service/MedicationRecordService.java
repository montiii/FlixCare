package com.flixcare.service;

import com.flixcare.dto.MedicationRecordDTO;
import com.flixcare.entity.Baby;
import com.flixcare.entity.MedicationRecord;
import com.flixcare.repository.BabyRepository;
import com.flixcare.repository.MedicationRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicationRecordService {

    private final MedicationRecordRepository medicationRecordRepository;
    private final BabyRepository babyRepository;

    @Transactional(readOnly = true)
    public List<MedicationRecordDTO> getAllMedicationRecords() {
        return medicationRecordRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MedicationRecordDTO> getMedicationRecordsByBabyId(Long babyId) {
        return medicationRecordRepository.findByBabyIdOrderByMedicationTimeDesc(babyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MedicationRecordDTO getMedicationRecordById(Long id) {
        MedicationRecord record = medicationRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medication record not found with id: " + id));
        return convertToDTO(record);
    }

    @Transactional
    public MedicationRecordDTO createMedicationRecord(MedicationRecordDTO dto) {
        Baby baby = babyRepository.findById(dto.getBabyId())
                .orElseThrow(() -> new RuntimeException("Baby not found with id: " + dto.getBabyId()));

        MedicationRecord record = new MedicationRecord();
        record.setBaby(baby);
        record.setMedicationTime(dto.getMedicationTime());
        record.setMedicationType(dto.getMedicationType());
        record.setDosage(dto.getDosage());
        record.setNotes(dto.getNotes());

        MedicationRecord savedRecord = medicationRecordRepository.save(record);
        return convertToDTO(savedRecord);
    }

    @Transactional
    public MedicationRecordDTO updateMedicationRecord(Long id, MedicationRecordDTO dto) {
        MedicationRecord record = medicationRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medication record not found with id: " + id));

        if (dto.getMedicationTime() != null) {
            record.setMedicationTime(dto.getMedicationTime());
        }
        if (dto.getMedicationType() != null) {
            record.setMedicationType(dto.getMedicationType());
        }
        if (dto.getDosage() != null) {
            record.setDosage(dto.getDosage());
        }
        if (dto.getNotes() != null) {
            record.setNotes(dto.getNotes());
        }

        MedicationRecord updatedRecord = medicationRecordRepository.save(record);
        return convertToDTO(updatedRecord);
    }

    @Transactional
    public void deleteMedicationRecord(Long id) {
        if (!medicationRecordRepository.existsById(id)) {
            throw new RuntimeException("Medication record not found with id: " + id);
        }
        medicationRecordRepository.deleteById(id);
    }

    private MedicationRecordDTO convertToDTO(MedicationRecord record) {
        MedicationRecordDTO dto = new MedicationRecordDTO();
        dto.setId(record.getId());
        dto.setBabyId(record.getBaby().getId());
        dto.setBabyName(record.getBaby().getName());
        dto.setMedicationTime(record.getMedicationTime());
        dto.setMedicationType(record.getMedicationType());
        dto.setDosage(record.getDosage());
        dto.setNotes(record.getNotes());
        dto.setCreatedAt(record.getCreatedAt());
        dto.setUpdatedAt(record.getUpdatedAt());
        return dto;
    }
}
