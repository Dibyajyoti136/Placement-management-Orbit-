package com.orbit.placement.repository;

import com.orbit.placement.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    @Query("SELECT s FROM Student s WHERE " +
           "(LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.skills) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Student> searchStudents(@Param("query") String query);
}
