package com.flixcare.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "feeding_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class FeedingRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "baby_id", nullable = false)
    private Baby baby;

    @Column(name = "feeding_time", nullable = false)
    private LocalDateTime feedingTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "feeding_type", nullable = false)
    private FeedingType feedingType;

    @Column(name = "amount_ml")
    private Double amountMl;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(length = 500)
    private String notes;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum FeedingType {
        BREAST_LEFT,
        BREAST_RIGHT,
        BREAST_START_LEFT,
        BREAST_START_RIGHT,
        BOTTLE_FORMULA,
        BOTTLE_BREAST_MILK,
        SOLID_FOOD
    }
}
