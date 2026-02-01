package com.flixcare.repository;

import com.flixcare.entity.Baby;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BabyRepository extends JpaRepository<Baby, Long> {
    List<Baby> findByNameContainingIgnoreCase(String name);
}
