package com.orbit.placement.controller;

import com.orbit.placement.model.Interview;
import com.orbit.placement.model.InterviewDTO;
import com.orbit.placement.service.InterviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping("/application/{applicationId}")
    public ResponseEntity<Interview> scheduleInterview(@PathVariable Long applicationId, @RequestBody Interview interview) {
        return ResponseEntity.ok(interviewService.scheduleInterview(applicationId, interview));
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<InterviewDTO> getByApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(interviewService.getInterviewByApplication(applicationId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelInterview(@PathVariable Long id) {
        interviewService.cancelInterview(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<InterviewDTO>> getInterviewsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(interviewService.getInterviewsByStudent(studentId));
    }
}
