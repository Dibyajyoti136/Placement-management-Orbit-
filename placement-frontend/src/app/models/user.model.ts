export interface User {
  id: number;
  email: string;
  role: 'STUDENT' | 'RECRUITER' | 'ADMIN';
  name: string;
  token?: string;
}

export interface Student {
  id: number;
  userId: number;
  name: string;
  email: string;
  branch: string;
  cgpa: number;
  skills: string;
  resumeUrl: string;
  phone: string;
  profileImage?: string;
}

export interface Recruiter {
  id: number;
  userId: number;
  name: string;
  email: string;
  companyName: string;
  designation: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  phone: string;
  companyLogo?: string;
}

export interface Admin {
  id: number;
  userId: number;
  name: string;
  email: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  salary: number;
  location: string;
  type: string;
  companyName: string;
  companyLogo?: string;
  recruiterId: number;
  createdDate: string;
  deadline?: string;
  requirements?: string;
  openings?: number;
}

export interface Application {
  id: number;
  studentId: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  resumeUrl: string;
  appliedDate: string;
  studentName?: string;
  studentBranch?: string;
  studentCgpa?: number;
  studentSkills?: string;
}

export interface Interview {
  id: number;
  applicationId: number;
  type: 'ONLINE' | 'OFFLINE';
  dateTime: string;
  meetingLink?: string;
  location?: string;
  jobTitle?: string;
  companyName?: string;
  studentName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: string;
  name: string;
  companyName?: string;
  designation?: string;
  branch?: string;
  phone?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
