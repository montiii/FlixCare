package com.flixcare.repository;

import com.flixcare.entity.MedicationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationRecordRepository extends JpaRepository<MedicationRecord, Long> {
    List<MedicationRecord> findByBabyIdOrderByMedicationTimeDesc(Long babyId);
}
