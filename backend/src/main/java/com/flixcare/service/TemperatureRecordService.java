package com.flixcare.service;

import com.flixcare.dto.TemperatureRecordDTO;
import com.flixcare.entity.Baby;
import com.flixcare.entity.TemperatureRecord;
import com.flixcare.exception.ResourceNotFoundException;
import com.flixcare.repository.BabyRepository;
import com.flixcare.repository.TemperatureRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TemperatureRecordService {

    private final TemperatureRecordRepository temperatureRecordRepository;
    private final BabyRepository babyRepository;

    public List<TemperatureRecordDTO> getAllTemperatureRecords() {
        return temperatureRecordRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TemperatureRecordDTO> getTemperatureRecordsByBaby(Long babyId) {
        return temperatureRecordRepository.findByBabyIdOrderByMeasurementTimeDesc(babyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TemperatureRecordDTO> getTemperatureRecordsByBabyAndDateRange(
            Long babyId, LocalDateTime start, LocalDateTime end) {
        return temperatureRecordRepository
                .findByBabyIdAndMeasurementTimeBetweenOrderByMeasurementTimeDesc(babyId, start, end)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TemperatureRecordDTO getTemperatureRecordById(Long id) {
        TemperatureRecord record = temperatureRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Temperature record not found with id: " + id));
        return convertToDTO(record);
    }

    public TemperatureRecordDTO createTemperatureRecord(TemperatureRecordDTO dto) {
        Baby baby = babyRepository.findById(dto.getBabyId())
                .orElseThrow(() -> new ResourceNotFoundException("Baby not found with id: " + dto.getBabyId()));

        TemperatureRecord record = convertToEntity(dto);
        record.setBaby(baby);
        TemperatureRecord savedRecord = temperatureRecordRepository.save(record);
        return convertToDTO(savedRecord);
    }

    public TemperatureRecordDTO updateTemperatureRecord(Long id, TemperatureRecordDTO dto) {
        TemperatureRecord record = temperatureRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Temperature record not found with id: " + id));

        record.setMeasurementTime(dto.getMeasurementTime());
        record.setTemperatureCelsius(dto.getTemperatureCelsius());
        if (dto.getMeasurementLocation() != null) {
            record.setMeasurementLocation(TemperatureRecord.MeasurementLocation.valueOf(dto.getMeasurementLocation()));
        }
        record.setNotes(dto.getNotes());

        TemperatureRecord updatedRecord = temperatureRecordRepository.save(record);
        return convertToDTO(updatedRecord);
    }

    public void deleteTemperatureRecord(Long id) {
        if (!temperatureRecordRepository.existsById(id)) {
            throw new ResourceNotFoundException("Temperature record not found with id: " + id);
        }
        temperatureRecordRepository.deleteById(id);
    }

    private TemperatureRecordDTO convertToDTO(TemperatureRecord record) {
        TemperatureRecordDTO dto = new TemperatureRecordDTO();
        dto.setId(record.getId());
        dto.setBabyId(record.getBaby().getId());
        dto.setBabyName(record.getBaby().getName());
        dto.setMeasurementTime(record.getMeasurementTime());
        dto.setTemperatureCelsius(record.getTemperatureCelsius());
        if (record.getMeasurementLocation() != null) {
            dto.setMeasurementLocation(record.getMeasurementLocation().name());
        }
        dto.setNotes(record.getNotes());
        dto.setCreatedAt(record.getCreatedAt());
        dto.setUpdatedAt(record.getUpdatedAt());
        return dto;
    }

    private TemperatureRecord convertToEntity(TemperatureRecordDTO dto) {
        TemperatureRecord record = new TemperatureRecord();
        record.setMeasurementTime(dto.getMeasurementTime());
        record.setTemperatureCelsius(dto.getTemperatureCelsius());
        if (dto.getMeasurementLocation() != null) {
            record.setMeasurementLocation(TemperatureRecord.MeasurementLocation.valueOf(dto.getMeasurementLocation()));
        }
        record.setNotes(dto.getNotes());
        return record;
    }
}
