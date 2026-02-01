package com.flixcare.dto;

import com.flixcare.entity.MedicationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicationRecordDTO {
    private Long id;
    private Long babyId;
    private String babyName;
    private LocalDateTime medicationTime;
    private MedicationType medicationType;
    private String dosage;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
