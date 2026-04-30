package com.orbit.placement.repository;

import com.orbit.placement.model.Job;
import com.orbit.placement.model.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByRecruiter(Recruiter recruiter);
    
    @Query("SELECT j FROM Job j WHERE " +
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Job> searchJobs(@Param("query") String query);
}
