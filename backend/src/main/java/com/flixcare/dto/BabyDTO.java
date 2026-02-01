package com.flixcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BabyDTO {
    private Long id;
    private String name;
    private LocalDate birthDate;
    private String gender;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
