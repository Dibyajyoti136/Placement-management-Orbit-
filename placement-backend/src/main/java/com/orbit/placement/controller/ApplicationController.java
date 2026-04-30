package com.orbit.placement.controller;

import com.orbit.placement.model.Application;
import com.orbit.placement.model.ApplicationStatus;
import com.orbit.placement.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/student/{studentId}/job/{jobId}")
    public ResponseEntity<Application> apply(@PathVariable Long studentId, @PathVariable Long jobId, @RequestParam String resumeUrl) {
        return ResponseEntity.ok(applicationService.applyForJob(studentId, jobId, resumeUrl));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Application>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(applicationService.getApplicationsByStudent(studentId));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> getByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJob(jobId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(@PathVariable Long id, @RequestParam ApplicationStatus status) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status));
    }
}
