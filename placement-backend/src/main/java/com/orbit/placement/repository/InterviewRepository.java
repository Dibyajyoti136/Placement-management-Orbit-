package com.orbit.placement.repository;

import com.orbit.placement.model.Interview;
import com.orbit.placement.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    Optional<Interview> findByApplication(Application application);
    List<Interview> findByApplication_Student_Id(Long studentId);
}
