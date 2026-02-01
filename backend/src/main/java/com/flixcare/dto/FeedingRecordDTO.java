package com.flixcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedingRecordDTO {
    private Long id;
    private Long babyId;
    private String babyName;
    private LocalDateTime feedingTime;
    private String feedingType;
    private Double amountMl;
    private Integer durationMinutes;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
