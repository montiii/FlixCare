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
@Table(name = "cleaning_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class CleaningRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "baby_id", nullable = false)
    private Baby baby;

    @Column(name = "cleaning_time", nullable = false)
    private LocalDateTime cleaningTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "cleaning_type", nullable = false)
    private CleaningType cleaningType;

    @Enumerated(EnumType.STRING)
    @Column(name = "diaper_content")
    private DiaperContent diaperContent;

    @Column(length = 500)
    private String notes;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum CleaningType {
        DIAPER_CHANGE,
        BATH,
        SPONGE_BATH,
        HAIR_WASH
    }

    public enum DiaperContent {
        WET,
        DIRTY,
        BOTH,
        CLEAN
    }
}
