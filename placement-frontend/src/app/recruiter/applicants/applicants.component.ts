import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../core/mock-data.service';
import { ToastService } from '../../core/toast.service';
import { Application } from '../../models/user.model';

@Component({
  selector: 'app-applicants',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="applicants-page">
      <div class="page-header">
        <h1>👥 Applicants</h1>
        <p>Review and manage job applicants</p>
      </div>

      <!-- Applicants Table -->
      <div class="card" style="animation: fadeInUp 0.4s ease">
        <div class="card-body" style="padding: 0; overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>Skills</th>
                <th>Job Applied</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let app of applications; let i = index" [style.animation-delay]="(i * 70) + 'ms'" style="animation: fadeInUp 0.3s ease both">
                <td>
                  <div class="student-cell">
                    <div class="student-avatar">{{ app.studentName?.charAt(0) }}</div>
                    <strong>{{ app.studentName }}</strong>
                  </div>
                </td>
                <td>{{ app.studentBranch }}</td>
                <td><strong>{{ app.studentCgpa }}</strong></td>
                <td>
                  <div class="skills-wrap">
                    <span class="skill-chip" *ngFor="let s of getSkills(app.studentSkills)">{{ s }}</span>
                  </div>
                </td>
                <td>{{ app.jobTitle }}</td>
                <td><a href="javascript:void(0)" class="resume-link">📄 View</a></td>
                <td>
                  <select class="form-control status-select" [(ngModel)]="app.status" (ngModelChange)="updateStatus(app)" [ngClass]="'status-' + app.status.toLowerCase()">
                    <option value="PENDING">PENDING</option>
                    <option value="ACCEPTED">ACCEPTED</option>
                    <option value="DECLINED">DECLINED</option>
                  </select>
                </td>
                <td>
                  <button class="btn btn-sm btn-primary" *ngIf="app.status === 'ACCEPTED'" [routerLink]="['/recruiter/schedule-interview', app.id]">📅 Schedule</button>
                  <span *ngIf="app.status !== 'ACCEPTED'" class="text-muted">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .student-cell {
      display: flex; align-items: center; gap: 10px;
    }
    .student-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-light), var(--primary));
      color: white; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.8rem; flex-shrink: 0;
    }
    .skills-wrap { display: flex; gap: 4px; flex-wrap: wrap; }
    .skill-chip {
      padding: 2px 8px; border-radius: var(--radius-full);
      background: var(--bg-secondary); font-size: 0.7rem;
      color: var(--text-secondary); font-weight: 500;
      border: 1px solid var(--border-light);
    }
    .resume-link { color: var(--primary-dark); font-weight: 500; font-size: 0.85rem; }
    .status-select {
      padding: 6px 10px; font-size: 0.78rem; font-weight: 600;
      border-radius: var(--radius-sm); min-width: 110px;
    }
    .status-select.status-pending { color: #8B6914; background: var(--warning-light); border-color: var(--warning); }
    .status-select.status-accepted { color: #1B7A41; background: var(--success-light); border-color: var(--success); }
    .status-select.status-declined { color: #A93226; background: var(--error-light); border-color: var(--error); }
    .text-muted { color: var(--text-muted); font-size: 0.85rem; }
  `]
})
export class ApplicantsComponent implements OnInit {
  applications: Application[] = [];

  constructor(private dataService: MockDataService, private toast: ToastService) {}

  ngOnInit(): void {
    this.dataService.getAllApplications().subscribe(apps => this.applications = apps);
  }

  getSkills(skills?: string): string[] {
    return skills?.split(', ').slice(0, 3) || [];
  }

  updateStatus(app: Application): void {
    this.dataService.updateApplicationStatus(app.id, app.status).subscribe(() => {
      this.toast.success(`Status updated to ${app.status}`);
    });
  }
}
