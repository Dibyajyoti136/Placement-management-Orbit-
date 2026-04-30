package com.orbit.placement.service;

import com.orbit.placement.dto.AuthDTOs.*;
import com.orbit.placement.model.*;
import com.orbit.placement.repository.*;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final RecruiterRepository recruiterRepository;
    private final AdminRepository adminRepository;

    public AuthService(UserRepository userRepository, StudentRepository studentRepository, 
                       RecruiterRepository recruiterRepository, AdminRepository adminRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.recruiterRepository = recruiterRepository;
        this.adminRepository = adminRepository;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Direct string comparison since security framework was removed per user request
        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return createAuthResponse(user);
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user;
        if (request.getRole() == Role.STUDENT) {
            Student student = new Student();
            student.setEmail(request.getEmail());
            student.setPassword(request.getPassword());
            student.setRole(Role.STUDENT);
            student.setName(request.getName() != null ? request.getName() : request.getEmail().split("@")[0]);
            student.setPhone(request.getPhone());
            user = studentRepository.save(student);
            
        } else if (request.getRole() == Role.RECRUITER) {
            Recruiter recruiter = new Recruiter();
            recruiter.setEmail(request.getEmail());
            recruiter.setPassword(request.getPassword());
            recruiter.setRole(Role.RECRUITER);
            recruiter.setName(request.getName() != null ? request.getName() : request.getEmail().split("@")[0]);
            recruiter.setCompanyName(request.getCompanyName());
            recruiter.setDesignation(request.getDesignation());
            recruiter.setPhone(request.getPhone());
            recruiter.setStatus(RecruiterStatus.PENDING);
            user = recruiterRepository.save(recruiter);
            
        } else if (request.getRole() == Role.ADMIN) {
            Admin admin = new Admin();
            admin.setEmail(request.getEmail());
            admin.setPassword(request.getPassword());
            admin.setRole(Role.ADMIN);
            admin.setName(request.getName() != null ? request.getName() : "Admin");
            user = adminRepository.save(admin);
            
        } else {
            throw new RuntimeException("Invalid role selected");
        }

        return createAuthResponse(user);
    }

    private AuthResponse createAuthResponse(User user) {
        AuthResponse response = new AuthResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setToken("basic-auth-token-" + user.getId()); // Dummy token since JWT security is removed

        if (user instanceof Student) {
            response.setName(((Student) user).getName());
        } else if (user instanceof Recruiter) {
            response.setName(((Recruiter) user).getName());
        } else if (user instanceof Admin) {
            response.setName(((Admin) user).getName());
        } else {
            response.setName(user.getEmail().split("@")[0]);
        }

        return response;
    }
}
