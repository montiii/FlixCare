package com.flixcare.repository;

import com.flixcare.entity.TemperatureRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TemperatureRecordRepository extends JpaRepository<TemperatureRecord, Long> {
    List<TemperatureRecord> findByBabyIdOrderByMeasurementTimeDesc(Long babyId);
    List<TemperatureRecord> findByBabyIdAndMeasurementTimeBetweenOrderByMeasurementTimeDesc(
            Long babyId, LocalDateTime start, LocalDateTime end);
}
