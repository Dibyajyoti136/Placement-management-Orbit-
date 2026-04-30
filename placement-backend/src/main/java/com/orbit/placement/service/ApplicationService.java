package com.orbit.placement.service;

import com.orbit.placement.model.*;
import com.orbit.placement.repository.ApplicationRepository;
import com.orbit.placement.repository.JobRepository;
import com.orbit.placement.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                              StudentRepository studentRepository, JobRepository jobRepository) {
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
    }

    public Application applyForJob(Long studentId, Long jobId, String resumeUrl) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        Job job = jobRepository.findById(jobId).orElseThrow();

        if (applicationRepository.existsByStudentAndJob(student, job)) {
            throw new RuntimeException("Already applied for this job.");
        }

        Application app = new Application();
        app.setStudent(student);
        app.setJob(job);
        app.setResumeUrl(resumeUrl);
        return applicationRepository.save(app);
    }

    public List<Application> getApplicationsByStudent(Long studentId) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        return applicationRepository.findByStudent(student);
    }

    public List<Application> getApplicationsByJob(Long jobId) {
        Job job = jobRepository.findById(jobId).orElseThrow();
        return applicationRepository.findByJob(job);
    }

    public Application updateApplicationStatus(Long applicationId, ApplicationStatus status) {
        Application app = applicationRepository.findById(applicationId).orElseThrow();
        app.setStatus(status);
        return applicationRepository.save(app);
    }
}
