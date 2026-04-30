package com.orbit.placement.repository;

import com.orbit.placement.model.Application;
import com.orbit.placement.model.Job;
import com.orbit.placement.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudent(Student student);
    List<Application> findByJob(Job job);
    boolean existsByStudentAndJob(Student student, Job job);
}
