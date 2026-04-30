import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../core/mock-data.service';
import { Application } from '../../models/user.model';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="applications-page">
      <div class="page-header">
        <h1>📋 My Applications</h1>
        <p>Track your job application progress and interview schedules</p>
      </div>

      <!-- Loading Skeleton -->
      <div class="card" *ngIf="isLoading" style="animation: fadeInUp 0.4s ease">
        <div class="card-body">
          <div class="skeleton skeleton-row" *ngFor="let s of [1,2,3,4]"></div>
        </div>
      </div>

      <!-- Applications Table -->
      <div class="card border-glow" *ngIf="!isLoading && applications.length > 0" style="animation: fadeInUp 0.5s ease">
        <div class="card-body" style="padding: 0; overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Job Role</th>
                <th>Company</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Next Steps</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let app of applications; let i = index" 
                  [style.animation-delay]="(i * 60) + 'ms'" 
                  style="animation: rowSlideIn 0.4s ease both">
                <td>
                  <div class="job-info">
                    <span class="job-icon">💼</span>
                    <strong>{{ app.jobTitle }}</strong>
                  </div>
                </td>
                <td>
                  <span class="company-tag">{{ app.companyName }}</span>
                </td>
                <td>
                  <span class="date-text">📅 {{ app.appliedDate | date:'mediumDate' || app.appliedDate }}</span>
                </td>
                <td>
                  <span class="badge" [ngClass]="{
                    'badge-pending': app.status === 'PENDING',
                    'badge-accepted': app.status === 'ACCEPTED',
                    'badge-declined': app.status === 'DECLINED'
                  }">
                    <span class="status-dot"></span>
                    {{ app.status }}
                  </span>
                </td>
                <td>
                  <a *ngIf="app.status === 'ACCEPTED'" [routerLink]="['/student/interview', app.id]" class="btn btn-sm btn-primary interview-btn">
                    📅 Schedule/View Interview
                  </a>
                  <span *ngIf="app.status === 'PENDING'" class="text-waiting">⏳ Pending HR Review</span>
                  <span *ngIf="app.status === 'DECLINED'" class="text-declined">❌ Application Closed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!isLoading && applications.length === 0" style="animation: scaleIn 0.4s ease">
        <div class="empty-icon blob-anim">📋</div>
        <h3>No applications yet</h3>
        <p>You haven't applied to any jobs yet. Discover and apply to your dream roles now!</p>
        <a routerLink="/student/jobs" class="btn btn-lg btn-primary empty-btn">🔍 Browse Jobs</a>
      </div>
    </div>
  `,
  styles: [`
    .applications-page { display: flex; flex-direction: column; gap: 20px; }
    
    .border-glow {
      border: 1px solid rgba(20, 184, 166, 0.2);
    }
    .border-glow:hover {
      box-shadow: 0 10px 30px rgba(20, 184, 166, 0.1);
      border-color: rgba(20, 184, 166, 0.4);
    }

    .job-info { display: flex; align-items: center; gap: 10px; }
    .job-icon { 
      width: 32px; height: 32px; border-radius: var(--radius-sm);
      background: var(--bg-secondary); display: flex; align-items: center; justify-content: center;
      font-size: 0.9rem; flex-shrink: 0;
    }
    .job-info strong { color: var(--text-dark); font-size: 0.95rem; }

    .company-tag {
      font-weight: 600; font-size: 0.85rem; color: var(--primary-darker);
      background: var(--primary-50); padding: 4px 10px; border-radius: var(--radius-sm);
    }

    .date-text { color: var(--text-secondary); font-size: 0.85rem; font-weight: 500; }

    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; }
    .badge-pending .status-dot { background: #92400E; animation: pulse 1.5s infinite; }
    .badge-accepted .status-dot { background: #065F46; }
    .badge-declined .status-dot { background: #991B1B; }

    .interview-btn { font-size: 0.8rem; padding: 8px 16px; box-shadow: 0 4px 12px rgba(20, 184, 166, 0.2); }
    .interview-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(20, 184, 166, 0.3); }

    .text-waiting { color: #D97706; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 4px; }
    .text-declined { color: var(--error); font-size: 0.85rem; font-weight: 600; opacity: 0.8; }

    .blob-anim {
      font-size: 4rem; margin-bottom: 24px;
      animation: float 4s ease-in-out infinite;
      filter: drop-shadow(0 10px 15px rgba(20, 184, 166, 0.2));
    }
    
    .empty-btn { margin-top: 16px; border-radius: var(--radius-full); }
    
    @keyframes rowSlideIn {
      from { opacity: 0; transform: translateX(-15px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `]
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  isLoading = true;

  constructor(private dataService: MockDataService) {}

  ngOnInit(): void {
    const user = this.dataService.getCurrentUserSync();
    if (user) {
      this.dataService.getStudentApplications(user.id).subscribe(apps => {
        this.applications = apps;
        this.isLoading = false;
      });
    } else {
      this.isLoading = false;
    }
  }
}
