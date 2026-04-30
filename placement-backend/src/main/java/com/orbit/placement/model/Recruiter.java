package com.orbit.placement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "recruiters")
@Getter
@Setter
public class Recruiter extends User {
    
    // Inherited from User (for visibility):
    // private String email;
    // private String password;
    
    private String name;
    private String companyName;
    private String designation;
    private String phone;
    
    @Enumerated(EnumType.STRING)
    private RecruiterStatus status; // PENDING, APPROVED, REJECTED
}
