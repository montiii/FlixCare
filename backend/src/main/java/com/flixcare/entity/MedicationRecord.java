package com.flixcare.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "medication_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "baby_id", nullable = false)
    private Baby baby;

    @Column(name = "medication_time", nullable = false)
    private LocalDateTime medicationTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "medication_type", nullable = false)
    private MedicationType medicationType;

    @Column(name = "dosage")
    private String dosage;

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (medicationTime == null) {
            medicationTime = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
