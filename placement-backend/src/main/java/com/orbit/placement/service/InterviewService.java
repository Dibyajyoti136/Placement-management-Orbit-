package com.orbit.placement.service;

import com.orbit.placement.model.Application;
import com.orbit.placement.model.ApplicationStatus;
import com.orbit.placement.model.Interview;
import com.orbit.placement.model.InterviewDTO;
import com.orbit.placement.repository.ApplicationRepository;
import com.orbit.placement.repository.InterviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InterviewService {
    
    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;

    public InterviewService(InterviewRepository interviewRepository, ApplicationRepository applicationRepository) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
    }

    public Interview scheduleInterview(Long applicationId, Interview interviewRequest) {
        if (applicationId == null) {
            throw new IllegalArgumentException("applicationId must not be null");
        }
        if (interviewRequest == null) {
            throw new IllegalArgumentException("interviewRequest must not be null");
        }

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("No application found with id " + applicationId));

        if (app.getStatus() == ApplicationStatus.INTERVIEW_SCHEDULED) {
            throw new IllegalStateException("Interview already scheduled for application id " + applicationId);
        }

        app.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
        applicationRepository.save(app);

        interviewRequest.setApplication(app);
        return interviewRepository.save(interviewRequest);
    }

    public InterviewDTO getInterviewByApplication(Long applicationId) {
        if (applicationId == null) {
            throw new IllegalArgumentException("applicationId must not be null");
        }

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("No application found with id " + applicationId));

        Interview interview = interviewRepository.findByApplication(app)
                .orElseThrow(() -> new IllegalArgumentException("No interview found for application id " + applicationId));

        return convertToDTO(interview);
    }

    public void cancelInterview(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Interview id must not be null");
        }

        if (!interviewRepository.existsById(id)) {
            throw new IllegalArgumentException("No interview exists with id " + id);
        }

        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No interview exists with id " + id));

        Application application = interview.getApplication();
        if (application != null) {
            application.setStatus(ApplicationStatus.PENDING);
            applicationRepository.save(application);
        }

        interviewRepository.deleteById(id);
    }

    public List<InterviewDTO> getInterviewsByStudent(Long studentId) {
        if (studentId == null) {
            throw new IllegalArgumentException("studentId must not be null");
        }
        return interviewRepository.findByApplication_Student_Id(studentId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private InterviewDTO convertToDTO(Interview interview) {
        InterviewDTO dto = new InterviewDTO();
        dto.setId(interview.getId());
        dto.setApplicationId(interview.getApplication().getId());
        dto.setType(interview.getType());
        dto.setDateTime(interview.getDateTime());
        dto.setMeetingLink(interview.getMeetingLink());
        dto.setLocation(interview.getLocation());
        dto.setJobTitle(interview.getApplication().getJob().getTitle());
        dto.setCompanyName(interview.getApplication().getJob().getRecruiter().getCompanyName());
        dto.setStudentName(interview.getApplication().getStudent().getName());
        return dto;
    }
}
