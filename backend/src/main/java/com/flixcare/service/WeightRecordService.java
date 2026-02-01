package com.flixcare.service;

import com.flixcare.dto.WeightRecordDTO;
import com.flixcare.entity.Baby;
import com.flixcare.entity.WeightRecord;
import com.flixcare.repository.BabyRepository;
import com.flixcare.repository.WeightRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WeightRecordService {

    private final WeightRecordRepository weightRecordRepository;
    private final BabyRepository babyRepository;

    @Transactional(readOnly = true)
    public List<WeightRecordDTO> getAllWeightRecords() {
        return weightRecordRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<WeightRecordDTO> getWeightRecordsByBabyId(Long babyId) {
        return weightRecordRepository.findByBabyIdOrderByMeasurementTimeDesc(babyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WeightRecordDTO getWeightRecordById(Long id) {
        WeightRecord record = weightRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Weight record not found with id: " + id));
        return convertToDTO(record);
    }

    @Transactional
    public WeightRecordDTO createWeightRecord(WeightRecordDTO dto) {
        Baby baby = babyRepository.findById(dto.getBabyId())
                .orElseThrow(() -> new RuntimeException("Baby not found with id: " + dto.getBabyId()));

        WeightRecord record = new WeightRecord();
        record.setBaby(baby);
        record.setMeasurementTime(dto.getMeasurementTime());
        record.setWeightGrams(dto.getWeightGrams());
        record.setNotes(dto.getNotes());

        WeightRecord savedRecord = weightRecordRepository.save(record);
        return convertToDTO(savedRecord);
    }

    @Transactional
    public WeightRecordDTO updateWeightRecord(Long id, WeightRecordDTO dto) {
        WeightRecord record = weightRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Weight record not found with id: " + id));

        if (dto.getMeasurementTime() != null) {
            record.setMeasurementTime(dto.getMeasurementTime());
        }
        if (dto.getWeightGrams() != null) {
            record.setWeightGrams(dto.getWeightGrams());
        }
        if (dto.getNotes() != null) {
            record.setNotes(dto.getNotes());
        }

        WeightRecord updatedRecord = weightRecordRepository.save(record);
        return convertToDTO(updatedRecord);
    }

    @Transactional
    public void deleteWeightRecord(Long id) {
        if (!weightRecordRepository.existsById(id)) {
            throw new RuntimeException("Weight record not found with id: " + id);
        }
        weightRecordRepository.deleteById(id);
    }

    private WeightRecordDTO convertToDTO(WeightRecord record) {
        WeightRecordDTO dto = new WeightRecordDTO();
        dto.setId(record.getId());
        dto.setBabyId(record.getBaby().getId());
        dto.setBabyName(record.getBaby().getName());
        dto.setMeasurementTime(record.getMeasurementTime());
        dto.setWeightGrams(record.getWeightGrams());
        dto.setNotes(record.getNotes());
        dto.setCreatedAt(record.getCreatedAt());
        dto.setUpdatedAt(record.getUpdatedAt());
        return dto;
    }
}
