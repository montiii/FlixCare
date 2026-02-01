package com.flixcare.repository;

import com.flixcare.entity.WeightRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WeightRecordRepository extends JpaRepository<WeightRecord, Long> {
    List<WeightRecord> findByBabyIdOrderByMeasurementTimeDesc(Long babyId);
}
