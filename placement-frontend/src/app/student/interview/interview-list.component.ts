import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../core/mock-data.service';
import { Interview } from '../../models/user.model';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-interview-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="interview-list-page">
      <div class="page-header">
        <h1>📅 My Interviews</h1>
        <p>View all your scheduled interviews</p>
      </div>

      <!-- Loading -->
      <div class="loading-page" *ngIf="isLoading">
        <div class="spinner spinner-lg"></div>
        <p>Loading interviews...</p>
      </div>

      <!-- Interview List -->
      <div class="interview-list" *ngIf="!isLoading && interviews.length > 0">
        <div class="interview-card card" *ngFor="let interview of interviews" style="animation: fadeInUp 0.4s ease both">
          <div class="card-body">
            <div class="interview-header">
              <div class="interview-icon" [class.online]="interview.type === 'ONLINE'" [class.offline]="interview.type === 'OFFLINE'">
                {{ interview.type === 'ONLINE' ? '💻' : '🏢' }}
              </div>
              <div>
                <h3>{{ interview.jobTitle }}</h3>
                <span class="company">{{ interview.companyName }}</span>
              </div>
              <a [routerLink]="['/student/interview', interview.applicationId]" class="btn btn-sm btn-primary">
                View Details
              </a>
            </div>

            <div class="interview-details">
              <div class="detail-item">
                <span class="icon">📅</span>
                <span>{{ formatDate(interview.dateTime) }}</span>
              </div>
              <div class="detail-item">
                <span class="icon">⏰</span>
                <span>{{ formatTime(interview.dateTime) }}</span>
              </div>
              <div class="detail-item">
                <span class="icon">{{ interview.type === 'ONLINE' ? '🔗' : '📍' }}</span>
                <span>{{ interview.type === 'ONLINE' ? 'Online Meeting' : interview.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Interviews -->
      <div class="empty-state" *ngIf="!isLoading && interviews.length === 0">
        <div class="empty-icon">📅</div>
        <h3>No Scheduled Interviews</h3>
        <p>You don't have any interviews scheduled yet. Check your applications for updates.</p>
        <a routerLink="/student/applications" class="btn btn-secondary">View Applications</a>
      </div>
    </div>
  `,
  styles: [`
    .interview-list-page { max-width: 800px; margin: 0 auto; }
    .page-header { text-align: center; margin-bottom: 32px; }
    .page-header h1 { font-size: 2rem; font-weight: 700; color: var(--text-dark); margin-bottom: 8px; }
    .page-header p { color: var(--text-secondary); font-size: 1rem; }

    .interview-list { display: flex; flex-direction: column; gap: 16px; }
    .interview-card { margin-bottom: 0; }
    .interview-header {
      display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
    }
    .interview-icon {
      width: 48px; height: 48px; border-radius: var(--radius-lg);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem;
    }
    .interview-icon.online { background: var(--info-light); }
    .interview-icon.offline { background: var(--success-light); }
    .interview-header h3 { font-size: 1.2rem; font-weight: 600; color: var(--text-dark); margin: 0; }
    .company { font-size: 0.9rem; color: var(--text-secondary); }

    .interview-details { display: flex; flex-direction: column; gap: 12px; }
    .detail-item {
      display: flex; align-items: center; gap: 12px;
      padding: 8px 0; font-size: 0.9rem; color: var(--text-secondary);
    }
    .detail-item .icon { font-size: 1.1rem; }

    .empty-state {
      text-align: center; padding: 60px 20px;
      background: var(--bg-secondary); border-radius: var(--radius-lg);
    }
    .empty-icon { font-size: 4rem; margin-bottom: 16px; opacity: 0.6; }
    .empty-state h3 { font-size: 1.5rem; color: var(--text-dark); margin-bottom: 8px; }
    .empty-state p { color: var(--text-secondary); margin-bottom: 24px; }
  `]
})
export class InterviewListComponent implements OnInit {
  interviews: Interview[] = [];
  isLoading = true;

  constructor(private dataService: MockDataService, private authService: AuthService) {}

  ngOnInit(): void {
    const studentId = this.authService.currentUser?.id;
    if (studentId) {
      this.dataService.getInterviewsByStudent(studentId).subscribe(interviews => {
        this.interviews = interviews;
        this.isLoading = false;
      });
    } else {
      this.isLoading = false;
    }
  }

  formatDate(dt: string): string {
    return new Date(dt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  formatTime(dt: string): string {
    return new Date(dt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }
}