package com.orbit.placement.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InterviewDTO {

    private Long id;
    private Long applicationId;
    private InterviewType type;
    private LocalDateTime dateTime;
    private String meetingLink;
    private String location;
    private String jobTitle;
    private String companyName;
    private String studentName;
}