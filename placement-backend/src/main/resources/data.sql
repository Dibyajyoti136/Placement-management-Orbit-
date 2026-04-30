INSERT INTO users (id, email, password, role, created_at) VALUES (101, 'recruiter@orbit.com', '1234', 'RECRUITER', NOW()) ON DUPLICATE KEY UPDATE id=id;
INSERT INTO recruiters (id, company_name, designation, name, phone, status) VALUES (101, 'TechCorp Inc.', 'Senior HR', 'Alice Smith', '1234567890', 'APPROVED') ON DUPLICATE KEY UPDATE id=id;

INSERT INTO users (id, email, password, role, created_at) VALUES (102, 'student@orbit.com', '1234', 'STUDENT', NOW()) ON DUPLICATE KEY UPDATE id=id;
INSERT INTO students (id, branch, cgpa, name, phone, resume_url, skills) VALUES (102, 'Computer Science', 8.5, 'Bob Jones', '0987654321', '/assets/resume.pdf', 'Java, Angular, Spring Boot') ON DUPLICATE KEY UPDATE id=id;

INSERT INTO jobs (id, description, location, salary, title, type, recruiter_id, created_at) VALUES (1, 'We are looking for a passionate frontend developer proficient in Angular and TypeScript to join our core team. You will be building responsive SaaS platforms.', 'Bangalore, India', 850000, 'Frontend Angular Developer', 'Full-time', 101, NOW()) ON DUPLICATE KEY UPDATE id=id;

INSERT INTO jobs (id, description, location, salary, title, type, recruiter_id, created_at) VALUES (2, 'Join our backend infrastructure team to design, build, and maintain scalable microservices using Java and Spring Boot. High impact role.', 'Hyderabad, India', 1200000, 'Backend Backend Engineer', 'Full-time', 101, NOW()) ON DUPLICATE KEY UPDATE id=id;

INSERT INTO jobs (id, description, location, salary, title, type, recruiter_id, created_at) VALUES (3, 'Summer internship for pre-final year students. Get hands-on experience with modern cloud technologies and CI/CD pipelines.', 'Remote', 300000, 'Cloud DevOps Intern', 'Internship', 101, NOW()) ON DUPLICATE KEY UPDATE id=id;
