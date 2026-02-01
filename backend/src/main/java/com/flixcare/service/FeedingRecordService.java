package com.flixcare.service;

import com.flixcare.dto.FeedingRecordDTO;
import com.flixcare.entity.Baby;
import com.flixcare.entity.FeedingRecord;
import com.flixcare.exception.ResourceNotFoundException;
import com.flixcare.repository.BabyRepository;
import com.flixcare.repository.FeedingRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FeedingRecordService {

    private final FeedingRecordRepository feedingRecordRepository;
    private final BabyRepository babyRepository;

    public List<FeedingRecordDTO> getAllFeedingRecords() {
        return feedingRecordRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FeedingRecordDTO> getFeedingRecordsByBaby(Long babyId) {
        return feedingRecordRepository.findByBabyIdOrderByFeedingTimeDesc(babyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FeedingRecordDTO> getFeedingRecordsByBabyAndDateRange(
            Long babyId, LocalDateTime start, LocalDateTime end) {
        return feedingRecordRepository
                .findByBabyIdAndFeedingTimeBetweenOrderByFeedingTimeDesc(babyId, start, end)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public FeedingRecordDTO getFeedingRecordById(Long id) {
        FeedingRecord record = feedingRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feeding record not found with id: " + id));
        return convertToDTO(record);
    }

    public FeedingRecordDTO createFeedingRecord(FeedingRecordDTO dto) {
        Baby baby = babyRepository.findById(dto.getBabyId())
                .orElseThrow(() -> new ResourceNotFoundException("Baby not found with id: " + dto.getBabyId()));

        FeedingRecord record = convertToEntity(dto);
        record.setBaby(baby);
        FeedingRecord savedRecord = feedingRecordRepository.save(record);
        return convertToDTO(savedRecord);
    }

    public FeedingRecordDTO updateFeedingRecord(Long id, FeedingRecordDTO dto) {
        FeedingRecord record = feedingRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feeding record not found with id: " + id));

        record.setFeedingTime(dto.getFeedingTime());
        record.setFeedingType(FeedingRecord.FeedingType.valueOf(dto.getFeedingType()));
        record.setAmountMl(dto.getAmountMl());
        record.setDurationMinutes(dto.getDurationMinutes());
        record.setNotes(dto.getNotes());

        FeedingRecord updatedRecord = feedingRecordRepository.save(record);
        return convertToDTO(updatedRecord);
    }

    public void deleteFeedingRecord(Long id) {
        if (!feedingRecordRepository.existsById(id)) {
            throw new ResourceNotFoundException("Feeding record not found with id: " + id);
        }
        feedingRecordRepository.deleteById(id);
    }

    private FeedingRecordDTO convertToDTO(FeedingRecord record) {
        FeedingRecordDTO dto = new FeedingRecordDTO();
        dto.setId(record.getId());
        dto.setBabyId(record.getBaby().getId());
        dto.setBabyName(record.getBaby().getName());
        dto.setFeedingTime(record.getFeedingTime());
        dto.setFeedingType(record.getFeedingType().name());
        dto.setAmountMl(record.getAmountMl());
        dto.setDurationMinutes(record.getDurationMinutes());
        dto.setNotes(record.getNotes());
        dto.setCreatedAt(record.getCreatedAt());
        dto.setUpdatedAt(record.getUpdatedAt());
        return dto;
    }

    private FeedingRecord convertToEntity(FeedingRecordDTO dto) {
        FeedingRecord record = new FeedingRecord();
        record.setFeedingTime(dto.getFeedingTime());
        record.setFeedingType(FeedingRecord.FeedingType.valueOf(dto.getFeedingType()));
        record.setAmountMl(dto.getAmountMl());
        record.setDurationMinutes(dto.getDurationMinutes());
        record.setNotes(dto.getNotes());
        return record;
    }
}
