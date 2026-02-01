package com.flixcare.service;

import com.flixcare.dto.CleaningRecordDTO;
import com.flixcare.entity.Baby;
import com.flixcare.entity.CleaningRecord;
import com.flixcare.exception.ResourceNotFoundException;
import com.flixcare.repository.BabyRepository;
import com.flixcare.repository.CleaningRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CleaningRecordService {

    private final CleaningRecordRepository cleaningRecordRepository;
    private final BabyRepository babyRepository;

    public List<CleaningRecordDTO> getAllCleaningRecords() {
        return cleaningRecordRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CleaningRecordDTO> getCleaningRecordsByBaby(Long babyId) {
        return cleaningRecordRepository.findByBabyIdOrderByCleaningTimeDesc(babyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CleaningRecordDTO> getCleaningRecordsByBabyAndDateRange(
            Long babyId, LocalDateTime start, LocalDateTime end) {
        return cleaningRecordRepository
                .findByBabyIdAndCleaningTimeBetweenOrderByCleaningTimeDesc(babyId, start, end)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CleaningRecordDTO getCleaningRecordById(Long id) {
        CleaningRecord record = cleaningRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cleaning record not found with id: " + id));
        return convertToDTO(record);
    }

    public CleaningRecordDTO createCleaningRecord(CleaningRecordDTO dto) {
        Baby baby = babyRepository.findById(dto.getBabyId())
                .orElseThrow(() -> new ResourceNotFoundException("Baby not found with id: " + dto.getBabyId()));

        CleaningRecord record = convertToEntity(dto);
        record.setBaby(baby);
        CleaningRecord savedRecord = cleaningRecordRepository.save(record);
        return convertToDTO(savedRecord);
    }

    public CleaningRecordDTO updateCleaningRecord(Long id, CleaningRecordDTO dto) {
        CleaningRecord record = cleaningRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cleaning record not found with id: " + id));

        record.setCleaningTime(dto.getCleaningTime());
        record.setCleaningType(CleaningRecord.CleaningType.valueOf(dto.getCleaningType()));
        if (dto.getDiaperContent() != null) {
            record.setDiaperContent(CleaningRecord.DiaperContent.valueOf(dto.getDiaperContent()));
        }
        record.setNotes(dto.getNotes());

        CleaningRecord updatedRecord = cleaningRecordRepository.save(record);
        return convertToDTO(updatedRecord);
    }

    public void deleteCleaningRecord(Long id) {
        if (!cleaningRecordRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cleaning record not found with id: " + id);
        }
        cleaningRecordRepository.deleteById(id);
    }

    private CleaningRecordDTO convertToDTO(CleaningRecord record) {
        CleaningRecordDTO dto = new CleaningRecordDTO();
        dto.setId(record.getId());
        dto.setBabyId(record.getBaby().getId());
        dto.setBabyName(record.getBaby().getName());
        dto.setCleaningTime(record.getCleaningTime());
        dto.setCleaningType(record.getCleaningType().name());
        if (record.getDiaperContent() != null) {
            dto.setDiaperContent(record.getDiaperContent().name());
        }
        dto.setNotes(record.getNotes());
        dto.setCreatedAt(record.getCreatedAt());
        dto.setUpdatedAt(record.getUpdatedAt());
        return dto;
    }

    private CleaningRecord convertToEntity(CleaningRecordDTO dto) {
        CleaningRecord record = new CleaningRecord();
        record.setCleaningTime(dto.getCleaningTime());
        record.setCleaningType(CleaningRecord.CleaningType.valueOf(dto.getCleaningType()));
        if (dto.getDiaperContent() != null) {
            record.setDiaperContent(CleaningRecord.DiaperContent.valueOf(dto.getDiaperContent()));
        }
        record.setNotes(dto.getNotes());
        return record;
    }
}
