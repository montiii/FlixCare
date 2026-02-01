package com.flixcare.repository;

import com.flixcare.entity.CleaningRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CleaningRecordRepository extends JpaRepository<CleaningRecord, Long> {
    List<CleaningRecord> findByBabyIdOrderByCleaningTimeDesc(Long babyId);
    List<CleaningRecord> findByBabyIdAndCleaningTimeBetweenOrderByCleaningTimeDesc(
            Long babyId, LocalDateTime start, LocalDateTime end);
}
