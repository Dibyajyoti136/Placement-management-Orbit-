package com.orbit.placement.repository;

import com.orbit.placement.model.Recruiter;
import com.orbit.placement.model.RecruiterStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecruiterRepository extends JpaRepository<Recruiter, Long> {
    List<Recruiter> findByStatus(RecruiterStatus status);
}
