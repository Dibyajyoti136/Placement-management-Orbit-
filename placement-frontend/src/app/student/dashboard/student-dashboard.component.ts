import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../core/mock-data.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <div class="page-header">
        <h1>Welcome back, {{ studentName }}! 👋</h1>
        <p>Here's your placement overview</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card" *ngFor="let stat of stats; let i = index"
             [style.animation-delay]="(i * 80) + 'ms'" style="animation: fadeInUp 0.5s ease both">
          <div class="stat-icon" [style.background]="stat.bg">{{ stat.icon }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card recent-apps" style="animation: fadeInUp 0.5s ease 0.3s both">
          <div class="card-body">
            <div class="section-header">
              <h3 class="section-title">Recent Applications</h3>
              <a routerLink="/student/applications" class="btn btn-sm btn-secondary">View All →</a>
            </div>
            <div class="app-list" *ngIf="recentApps.length > 0">
              <div class="app-item" *ngFor="let app of recentApps; let i = index"
                   [style.animation-delay]="(i * 60 + 400) + 'ms'"
                   style="animation: slideInLeft 0.4s ease both">
                <div class="app-info">
                  <h4>{{ app.jobTitle }}</h4>
                  <span class="company">{{ app.companyName }}</span>
                </div>
                <span class="badge" [ngClass]="'badge-' + app.status.toLowerCase()">{{ app.status }}</span>
              </div>
            </div>
            <div class="empty-state" *ngIf="recentApps.length === 0" style="padding: 30px 20px">
              <div class="empty-icon">📋</div>
              <h3>No applications yet</h3>
              <p>Start searching for jobs to apply</p>
            </div>
          </div>
        </div>

        <div class="card quick-actions" style="animation: fadeInUp 0.5s ease 0.4s both">
          <div class="card-body">
            <h3 class="section-title" style="margin-bottom: 16px">Quick Actions</h3>
            <div class="action-grid">
              <a routerLink="/student/jobs" class="action-card">
                <span class="action-icon">🔍</span>
                <span class="action-label">Search Jobs</span>
              </a>
              <a routerLink="/student/applications" class="action-card">
                <span class="action-icon">📋</span>
                <span class="action-label">Applications</span>
              </a>
              <a routerLink="/student/profile" class="action-card">
                <span class="action-icon">👤</span>
                <span class="action-label">Edit Profile</span>
              </a>
              <a routerLink="/student/jobs" class="action-card">
                <span class="action-icon">📄</span>
                <span class="action-label">Upload Resume</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; }
    .app-list { display: flex; flex-direction: column; gap: 8px; }
    .app-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 16px; border-radius: var(--radius-md);
      background: var(--bg-secondary); transition: all var(--transition-base);
    }
    .app-item:hover {
      background: var(--primary-50); transform: translateX(6px);
      box-shadow: var(--shadow-sm);
    }
    .app-info h4 { font-size: 0.9rem; font-weight: 600; color: var(--text-dark); }
    .app-info .company { font-size: 0.78rem; color: var(--text-secondary); }

    .action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .action-card {
      display: flex; flex-direction: column; align-items: center; gap: 10px;
      padding: 22px; border-radius: var(--radius-md);
      background: var(--bg-secondary); border: 1.5px solid transparent;
      transition: all var(--transition-spring); text-decoration: none;
    }
    .action-card:hover {
      background: var(--primary-50); border-color: var(--primary-light);
      transform: translateY(-4px); box-shadow: var(--shadow-md);
    }
    .action-icon { font-size: 1.8rem; }
    .action-label { font-size: 0.82rem; font-weight: 600; color: var(--text-primary); }
    @media (max-width: 768px) { .dashboard-grid { grid-template-columns: 1fr; } }
  `]
})
export class StudentDashboardComponent implements OnInit {
  stats = [
    { icon: '💼', label: 'Available Jobs', value: 0, bg: 'linear-gradient(135deg, #F0FDFA, #DBEAFE)' },
    { icon: '📋', label: 'Applications', value: 0, bg: 'linear-gradient(135deg, #EFF6FF, #F0FDFA)' },
    { icon: '✅', label: 'Accepted', value: 0, bg: 'linear-gradient(135deg, #D1FAE5, #CCFBF1)' },
    { icon: '📅', label: 'Interviews', value: 0, bg: 'linear-gradient(135deg, #FEF3C7, #FFF7ED)' },
  ];
  recentApps: any[] = [];
  studentName = 'Student';

  constructor(private dataService: MockDataService) {}

  ngOnInit(): void {
    const user = this.dataService.getCurrentUserSync();
    if (user) {
      if (user.name) this.studentName = user.name;
      this.dataService.getStudentById(user.id).subscribe((s: any) => {
        if (s) {
          this.studentName = s.name;
          this.loadStudentData(s.id);
        }
      });
    }
    this.dataService.getJobs().subscribe((jobs: any) => this.stats[0].value = jobs.length);
  }

  loadStudentData(studentId: number): void {
    this.dataService.getStudentApplications(studentId).subscribe((apps: any) => {
      this.stats[1].value = apps.length;
      this.stats[2].value = apps.filter((a: any) => a.status === 'ACCEPTED').length;
      this.recentApps = apps.slice(0, 5);
    });
    this.dataService.getAllInterviews().subscribe((ints: any) => {
      this.stats[3].value = ints.filter((i: any) => i.studentName === this.studentName).length;
    });
  }
}
