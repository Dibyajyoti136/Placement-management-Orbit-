import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

// Landing
import { LandingPageComponent } from './landing/landing.component';

// Auth
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

// Layout
import { DashboardLayoutComponent } from './shared/layout/dashboard-layout.component';

// Student
import { StudentDashboardComponent } from './student/dashboard/student-dashboard.component';
import { JobSearchComponent } from './student/job-search/job-search.component';
import { ApplicationsComponent } from './student/applications/applications.component';
import { InterviewDetailComponent } from './student/interview/interview-detail.component';
import { InterviewListComponent } from './student/interview/interview-list.component';
import { StudentProfileComponent } from './student/profile/student-profile.component';

// Recruiter
import { RecruiterDashboardComponent } from './recruiter/dashboard/recruiter-dashboard.component';
import { ManageJobsComponent } from './recruiter/manage-jobs/manage-jobs.component';
import { ApplicantsComponent } from './recruiter/applicants/applicants.component';
import { SearchStudentsComponent } from './recruiter/search-students/search-students.component';
import { ScheduleInterviewComponent } from './recruiter/schedule-interview/schedule-interview.component';
import { RecruiterProfileComponent } from './recruiter/profile/recruiter-profile.component';

// Admin
import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard.component';
import { VerifyRecruitersComponent } from './admin/verify-recruiters/verify-recruiters.component';
import { ManageStudentsComponent } from './admin/manage-students/manage-students.component';
import { ManageRecruitersComponent } from './admin/manage-recruiters/manage-recruiters.component';
import { AdminManageJobsComponent } from './admin/manage-jobs/admin-manage-jobs.component';
import { ManageApplicationsComponent } from './admin/manage-applications/manage-applications.component';
import { ManageInterviewsComponent } from './admin/manage-interviews/manage-interviews.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Student Routes
  {
    path: 'student',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['STUDENT'] },
    children: [
      { path: '', component: StudentDashboardComponent },
      { path: 'jobs', component: JobSearchComponent },
      { path: 'applications', component: ApplicationsComponent },
      { path: 'interviews', component: InterviewListComponent },
      { path: 'interview/:appId', component: InterviewDetailComponent },
      { path: 'profile', component: StudentProfileComponent },
    ]
  },

  // Recruiter Routes
  {
    path: 'recruiter',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['RECRUITER'] },
    children: [
      { path: '', component: RecruiterDashboardComponent },
      { path: 'jobs', component: ManageJobsComponent },
      { path: 'applicants', component: ApplicantsComponent },
      { path: 'search', component: SearchStudentsComponent },
      { path: 'schedule-interview/:appId', component: ScheduleInterviewComponent },
      { path: 'profile', component: RecruiterProfileComponent },
    ]
  },

  // Admin Routes
  {
    path: 'admin',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'verify', component: VerifyRecruitersComponent },
      { path: 'students', component: ManageStudentsComponent },
      { path: 'recruiters', component: ManageRecruitersComponent },
      { path: 'jobs', component: AdminManageJobsComponent },
      { path: 'applications', component: ManageApplicationsComponent },
      { path: 'interviews', component: ManageInterviewsComponent },
    ]
  },

  { path: '**', redirectTo: 'login' },
];
