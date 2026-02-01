package com.flixcare.repository;

import com.flixcare.entity.FeedingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FeedingRecordRepository extends JpaRepository<FeedingRecord, Long> {
    List<FeedingRecord> findByBabyIdOrderByFeedingTimeDesc(Long babyId);
    List<FeedingRecord> findByBabyIdAndFeedingTimeBetweenOrderByFeedingTimeDesc(
            Long babyId, LocalDateTime start, LocalDateTime end);
}
