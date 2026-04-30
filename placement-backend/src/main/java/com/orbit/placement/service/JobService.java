package com.orbit.placement.service;

import com.orbit.placement.model.Job;
import com.orbit.placement.model.Recruiter;
import com.orbit.placement.repository.JobRepository;
import com.orbit.placement.repository.RecruiterRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobService {
    
    private final JobRepository jobRepository;
    private final RecruiterRepository recruiterRepository;

    public JobService(JobRepository jobRepository, RecruiterRepository recruiterRepository) {
        this.jobRepository = jobRepository;
        this.recruiterRepository = recruiterRepository;
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public List<Job> searchJobs(String query) {
        if(query == null || query.trim().isEmpty()) return getAllJobs();
        return jobRepository.searchJobs(query);
    }

    public List<Job> getJobsByRecruiter(Long recruiterId) {
        Recruiter recruiter = recruiterRepository.findById(recruiterId)
            .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        return jobRepository.findByRecruiter(recruiter);
    }

    public Job createJob(Long recruiterId, Job jobRequest) {
        Recruiter recruiter = recruiterRepository.findById(recruiterId)
            .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        jobRequest.setRecruiter(recruiter);
        return jobRepository.save(jobRequest);
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}
