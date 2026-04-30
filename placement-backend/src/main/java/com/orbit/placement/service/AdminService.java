package com.orbit.placement.service;

import com.orbit.placement.model.Recruiter;
import com.orbit.placement.model.RecruiterStatus;
import com.orbit.placement.repository.RecruiterRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {
    
    private final RecruiterRepository recruiterRepository;

    public AdminService(RecruiterRepository recruiterRepository) {
        this.recruiterRepository = recruiterRepository;
    }

    public List<Recruiter> getAllRecruiters() {
        return recruiterRepository.findAll();
    }

    public Recruiter getRecruiterById(Long id) {
        return recruiterRepository.findById(id).orElseThrow(() -> new RuntimeException("Recruiter not found"));
    }

    public Recruiter updateRecruiter(Long id, Recruiter updates) {
        Recruiter recruiter = getRecruiterById(id);
        recruiter.setName(updates.getName());
        recruiter.setCompanyName(updates.getCompanyName());
        recruiter.setDesignation(updates.getDesignation());
        recruiter.setPhone(updates.getPhone());
        return recruiterRepository.save(recruiter);
    }

    public Recruiter updateRecruiterStatus(Long id, RecruiterStatus status) {
        Recruiter recruiter = recruiterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        recruiter.setStatus(status);
        return recruiterRepository.save(recruiter);
    }
}
