package com.orbit.placement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "students")
@Getter
@Setter
public class Student extends User {
    
    // Inherited from User (for visibility):
    // private String email;
    // private String password;
    
    private String name;
    private String branch;
    private Double cgpa;
    private String skills; // comma separated
    private String resumeUrl;
    private String phone;
}
