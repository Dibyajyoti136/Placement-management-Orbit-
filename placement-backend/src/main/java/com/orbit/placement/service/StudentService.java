package com.orbit.placement.service;

import com.orbit.placement.model.Student;
import com.orbit.placement.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student updateStudent(Long id, Student updates) {
        Student student = getStudentById(id);
        student.setName(updates.getName());
        student.setPhone(updates.getPhone());
        student.setBranch(updates.getBranch());
        student.setCgpa(updates.getCgpa());
        student.setSkills(updates.getSkills());
        return studentRepository.save(student);
    }

    public List<Student> searchStudents(String query) {
        if(query == null || query.trim().isEmpty()) {
            return studentRepository.findAll();
        }
        return studentRepository.searchStudents(query);
    }
}
