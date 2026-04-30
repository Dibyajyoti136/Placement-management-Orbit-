package com.orbit.placement.controller;

import com.orbit.placement.model.Recruiter;
import com.orbit.placement.model.RecruiterStatus;
import com.orbit.placement.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/recruiters")
    public ResponseEntity<List<Recruiter>> getAllRecruiters() {
        return ResponseEntity.ok(adminService.getAllRecruiters());
    }

    @GetMapping("/recruiters/{id}")
    public ResponseEntity<Recruiter> getRecruiterById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getRecruiterById(id));
    }

    @PutMapping("/recruiters/{id}")
    public ResponseEntity<Recruiter> updateRecruiter(@PathVariable Long id, @RequestBody Recruiter recruiter) {
        return ResponseEntity.ok(adminService.updateRecruiter(id, recruiter));
    }

    @PutMapping("/recruiters/{id}/status")
    public ResponseEntity<Recruiter> updateRecruiterStatus(@PathVariable Long id, @RequestParam RecruiterStatus status) {
        return ResponseEntity.ok(adminService.updateRecruiterStatus(id, status));
    }
}
