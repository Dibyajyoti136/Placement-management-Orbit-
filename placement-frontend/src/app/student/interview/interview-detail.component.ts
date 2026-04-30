import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MockDataService } from '../../core/mock-data.service';
import { Interview } from '../../models/user.model';

@Component({
  selector: 'app-interview-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="interview-page">
      <div class="page-header">
        <a routerLink="/student/applications" class="back-link">← Back to Applications</a>
        <h1>📅 Interview Details</h1>
        <p>Your upcoming interview information</p>
      </div>

      <!-- Loading -->
      <div class="loading-page" *ngIf="isLoading">
        <div class="spinner spinner-lg"></div>
        <p>Loading interview details...</p>
      </div>

      <!-- Interview Card -->
      <div class="interview-card card" *ngIf="!isLoading && interview" style="animation: scaleIn 0.4s ease">
        <div class="card-body">
          <div class="interview-header">
            <div class="interview-icon" [class.online]="interview.type === 'ONLINE'" [class.offline]="interview.type === 'OFFLINE'">
              {{ interview.type === 'ONLINE' ? '💻' : '🏢' }}
            </div>
            <div>
              <h2>{{ interview.jobTitle }}</h2>
              <span class="company">{{ interview.companyName }}</span>
            </div>
            <span class="badge" [ngClass]="interview.type === 'ONLINE' ? 'badge-info' : 'badge-approved'">
              {{ interview.type }}
            </span>
          </div>

          <div class="interview-details-grid">
            <div class="detail-card" style="animation: fadeInUp 0.4s ease 0.1s both">
              <div class="detail-icon">📅</div>
              <div class="detail-content">
                <span class="detail-label">Date</span>
                <span class="detail-value">{{ formatDate(interview.dateTime) }}</span>
              </div>
            </div>

            <div class="detail-card" style="animation: fadeInUp 0.4s ease 0.2s both">
              <div class="detail-icon">⏰</div>
              <div class="detail-content">
                <span class="detail-label">Time</span>
                <span class="detail-value">{{ formatTime(interview.dateTime) }}</span>
              </div>
            </div>

            <div class="detail-card" style="animation: fadeInUp 0.4s ease 0.3s both">
              <div class="detail-icon">{{ interview.type === 'ONLINE' ? '🔗' : '📍' }}</div>
              <div class="detail-content">
                <span class="detail-label">{{ interview.type === 'ONLINE' ? 'Meeting Link' : 'Location' }}</span>
                <span class="detail-value" *ngIf="interview.type === 'ONLINE'">
                  <a [href]="interview.meetingLink" target="_blank" class="meeting-link">
                    Join Meeting →
                  </a>
                </span>
                <span class="detail-value" *ngIf="interview.type === 'OFFLINE'">
                  {{ interview.location }}
                </span>
              </div>
            </div>
          </div>

          <div class="interview-tips" style="animation: fadeInUp 0.4s ease 0.4s both">
            <h3>💡 Interview Tips</h3>
            <ul>
              <li>Be ready 10 minutes before the scheduled time</li>
              <li>Keep your resume and portfolio ready</li>
              <li *ngIf="interview.type === 'ONLINE'">Test your camera and microphone</li>
              <li *ngIf="interview.type === 'OFFLINE'">Carry a printed copy of your resume</li>
              <li>Research the company beforehand</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- No Interview -->
      <div class="empty-state" *ngIf="!isLoading && !interview">
        <div class="empty-icon">📅</div>
        <h3>No Interview Scheduled</h3>
        <p>Interview details will appear here once scheduled by the recruiter.</p>
        <a routerLink="/student/applications" class="btn btn-secondary">Back to Applications</a>
      </div>
    </div>
  `,
  styles: [`
    .back-link {
      font-size: 0.85rem; color: var(--primary-dark); font-weight: 500;
      display: inline-block; margin-bottom: 12px;
      transition: all var(--transition-fast);
    }
    .back-link:hover { transform: translateX(-4px); }

    .interview-card { max-width: 700px; }
    .interview-header {
      display: flex; align-items: center; gap: 16px; margin-bottom: 28px;
    }
    .interview-icon {
      width: 56px; height: 56px; border-radius: var(--radius-lg);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem;
    }
    .interview-icon.online { background: var(--info-light); }
    .interview-icon.offline { background: var(--success-light); }
    .interview-header h2 { font-size: 1.3rem; font-weight: 700; color: var(--text-dark); }
    .interview-header .company { font-size: 0.9rem; color: var(--text-secondary); }

    .interview-details-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px; margin-bottom: 28px;
    }
    .detail-card {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 16px; border-radius: var(--radius-md);
      background: var(--bg-secondary);
    }
    .detail-icon { font-size: 1.3rem; }
    .detail-label {
      display: block; font-size: 0.75rem; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.04em; font-weight: 600;
    }
    .detail-value {
      display: block; font-size: 0.95rem; color: var(--text-dark); font-weight: 600; margin-top: 4px;
    }
    .meeting-link {
      color: var(--primary-dark); font-weight: 600;
      transition: all var(--transition-fast);
    }
    .meeting-link:hover { color: var(--accent); }

    .interview-tips {
      background: var(--primary-50); border-radius: var(--radius-md);
      padding: 20px; border-left: 4px solid var(--primary);
    }
    .interview-tips h3 { font-size: 1rem; font-weight: 700; color: var(--text-dark); margin-bottom: 12px; }
    .interview-tips ul { padding-left: 0; }
    .interview-tips li {
      padding: 6px 0; font-size: 0.88rem; color: var(--text-secondary);
      position: relative; padding-left: 20px;
    }
    .interview-tips li::before { content: '•'; position: absolute; left: 0; color: var(--primary); font-weight: 700; }
  `]
})
export class InterviewDetailComponent implements OnInit {
  interview: Interview | null = null;
  isLoading = true;

  constructor(private route: ActivatedRoute, private dataService: MockDataService) {}

  ngOnInit(): void {
    const appId = Number(this.route.snapshot.paramMap.get('appId'));
    this.dataService.getInterviewByApplication(appId).subscribe(interview => {
      this.interview = interview || null;
      this.isLoading = false;
    });
  }

  formatDate(dt: string): string {
    return new Date(dt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  formatTime(dt: string): string {
    return new Date(dt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }
}
