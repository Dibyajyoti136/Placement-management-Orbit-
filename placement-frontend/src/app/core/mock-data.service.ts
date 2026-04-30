import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Job, Application, Interview, Student, Recruiter, User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  // ─── JOBS ───────────────────────────────────────────
  getJobs(title?: string, minSalary?: number, maxSalary?: number): Observable<Job[]> {
    let params = new HttpParams();
    if (title) params = params.set('query', title);
    return this.http.get<Job[]>(`${this.apiUrl}/jobs`, { params }).pipe(
      map(jobs => jobs.map(j => ({ 
        ...j, 
        companyName: (j as any).recruiter?.companyName || (j as any).companyName 
      })))
    );
  }

  getJobById(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/jobs/${id}`);
  }

  createJob(job: Partial<Job>): Observable<Job> {
    const recruiterId = job.recruiterId || JSON.parse(localStorage.getItem('orbit_user') || '{}').id;
    return this.http.post<Job>(`${this.apiUrl}/jobs/recruiter/${recruiterId}`, job);
  }

  updateJob(id: number, updates: Partial<Job>): Observable<Job> {
    const recruiterId = updates.recruiterId || JSON.parse(localStorage.getItem('orbit_user') || '{}').id;
    return this.http.put<Job>(`${this.apiUrl}/jobs/${id}/recruiter/${recruiterId}`, updates);
  }

  deleteJob(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/jobs/${id}`);
  }

  // ─── APPLICATION METHODS ────────────────────────────
  getStudentApplications(studentId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications/student/${studentId}`);
  }

  getJobApplications(jobId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications/job/${jobId}`);
  }

  getAllApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications`);
  }

  applyForJob(studentId: number, jobId: number, resumeUrl: string = '/assets/resume.pdf'): Observable<Application> {
    let params = new HttpParams().set('resumeUrl', resumeUrl);
    return this.http.post<Application>(`${this.apiUrl}/applications/student/${studentId}/job/${jobId}`, null, { params });
  }

  updateApplicationStatus(id: number, status: string): Observable<Application> {
    let params = new HttpParams().set('status', status);
    return this.http.put<Application>(`${this.apiUrl}/applications/${id}/status`, null, { params });
  }

  hasApplied(studentId: number, jobId: number): boolean {
    return false; // Typically handled in component logic with cached application list
  }

  // ─── INTERVIEW METHODS ──────────────────────────────
  getInterviewByApplication(applicationId: number): Observable<Interview> {
    return this.http.get<Interview>(`${this.apiUrl}/interviews/application/${applicationId}`);
  }

  getInterviewsByStudent(studentId: number): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.apiUrl}/interviews/student/${studentId}`);
  }

  getAllInterviews(): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.apiUrl}/interviews`);
  }

  createInterview(interview: any): Observable<Interview> {
    const applicationId = interview.applicationId;
    return this.http.post<Interview>(`${this.apiUrl}/interviews/application/${applicationId}`, interview);
  }

  updateInterview(id: number, updates: any): Observable<Interview> {
    return this.http.put<Interview>(`${this.apiUrl}/interviews/${id}`, updates);
  }

  deleteInterview(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/interviews/${id}`);
  }

  // ─── STUDENT METHODS ────────────────────────────────
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/students`);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/students/${id}`);
  }

  searchStudents(name?: string, cgpa?: number, skills?: string): Observable<Student[]> {
    let params = new HttpParams();
    const query = name || ''; // Use name as primary search for backend compatibility
    if (query) params = params.set('query', query);
    return this.http.get<Student[]>(`${this.apiUrl}/students/search`, { params });
  }

  updateStudent(id: number, updates: any): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/students/${id}`, updates);
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/students/${id}`);
  }

  // ─── RECRUITER METHODS ──────────────────────────────
  getRecruiters(): Observable<Recruiter[]> {
    return this.http.get<Recruiter[]>(`${this.apiUrl}/admin/recruiters`);
  }

  getRecruiterById(id: number): Observable<Recruiter> {
    return this.http.get<Recruiter>(`${this.apiUrl}/admin/recruiters/${id}`);
  }

  updateRecruiterStatus(id: number, status: string): Observable<Recruiter> {
    let params = new HttpParams().set('status', status);
    return this.http.put<Recruiter>(`${this.apiUrl}/admin/recruiters/${id}/status`, null, { params });
  }

  updateRecruiter(id: number, updates: any): Observable<Recruiter> {
    return this.http.put<Recruiter>(`${this.apiUrl}/admin/recruiters/${id}`, updates);
  }

  deleteRecruiter(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/recruiters/${id}`);
  }

  updateCachedUser(name: string): void {
    this.auth.updateUserName(name);
  }

  getCurrentUserSync(): User | null {
    const userStr = localStorage.getItem('orbit_user');
    return userStr ? JSON.parse(userStr) : null;
  }

}
