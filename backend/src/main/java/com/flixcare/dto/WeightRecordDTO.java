package com.flixcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeightRecordDTO {
    private Long id;
    private Long babyId;
    private String babyName;
    private LocalDateTime measurementTime;
    private Integer weightGrams;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
