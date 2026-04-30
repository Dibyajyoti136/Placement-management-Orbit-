package com.orbit.placement.dto;

import com.orbit.placement.model.Role;
import lombok.Data;

public class AuthDTOs {
    
    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String email;
        private String password;
        private Role role;
        
        // Common details
        private String name;
        private String phone;
        
        // Recruiter specific
        private String companyName;
        private String designation;
    }

    @Data
    public static class AuthResponse {
        private Long id;
        private String email;
        private Role role;
        private String name;
        private String token;
    }
}
