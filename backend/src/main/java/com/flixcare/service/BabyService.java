package com.flixcare.service;

import com.flixcare.dto.BabyDTO;
import com.flixcare.entity.Baby;
import com.flixcare.exception.ResourceNotFoundException;
import com.flixcare.repository.BabyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BabyService {

    private final BabyRepository babyRepository;

    public List<BabyDTO> getAllBabies() {
        return babyRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BabyDTO getBabyById(Long id) {
        Baby baby = babyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Baby not found with id: " + id));
        return convertToDTO(baby);
    }

    public BabyDTO createBaby(BabyDTO babyDTO) {
        Baby baby = convertToEntity(babyDTO);
        Baby savedBaby = babyRepository.save(baby);
        return convertToDTO(savedBaby);
    }

    public BabyDTO updateBaby(Long id, BabyDTO babyDTO) {
        Baby baby = babyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Baby not found with id: " + id));

        baby.setName(babyDTO.getName());
        baby.setBirthDate(babyDTO.getBirthDate());
        baby.setGender(babyDTO.getGender());
        baby.setNotes(babyDTO.getNotes());

        Baby updatedBaby = babyRepository.save(baby);
        return convertToDTO(updatedBaby);
    }

    public void deleteBaby(Long id) {
        if (!babyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Baby not found with id: " + id);
        }
        babyRepository.deleteById(id);
    }

    private BabyDTO convertToDTO(Baby baby) {
        BabyDTO dto = new BabyDTO();
        dto.setId(baby.getId());
        dto.setName(baby.getName());
        dto.setBirthDate(baby.getBirthDate());
        dto.setGender(baby.getGender());
        dto.setNotes(baby.getNotes());
        dto.setCreatedAt(baby.getCreatedAt());
        dto.setUpdatedAt(baby.getUpdatedAt());
        return dto;
    }

    private Baby convertToEntity(BabyDTO dto) {
        Baby baby = new Baby();
        baby.setName(dto.getName());
        baby.setBirthDate(dto.getBirthDate());
        baby.setGender(dto.getGender());
        baby.setNotes(dto.getNotes());
        return baby;
    }
}
