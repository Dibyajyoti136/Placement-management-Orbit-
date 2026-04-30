import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../core/mock-data.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- PENDING STATUS -->
    <div class="pending-screen" *ngIf="recruiterStatus === 'PENDING'">
      <div class="pending-card">
        <div class="pending-pulse"></div>
        <div class="pending-icon">⏳</div>
        <h2>Account Under Review</h2>
        <p>Your recruiter account is pending admin approval. You'll be notified once approved.</p>
        <div class="pending-steps">
          <div class="step done"><span class="step-dot"></span> Registration Complete</div>
          <div class="step active"><span class="step-dot pulse"></span> Admin Review</div>
          <div class="step"><span class="step-dot"></span> Account Activated</div>
        </div>
      </div>
    </div>

    <!-- REJECTED STATUS -->
    <div class="rejected-screen" *ngIf="recruiterStatus === 'REJECTED'">
      <div class="rejected-card">
        <div class="rejected-icon">❌</div>
        <h2>Account Rejected</h2>
        <p>Your recruiter application has been rejected by the admin. Please contact support for more information.</p>
        <button class="btn btn-secondary">📧 Contact Support</button>
      </div>
    </div>

    <!-- APPROVED - FULL DASHBOARD -->
    <div class="dashboard" *ngIf="recruiterStatus === 'APPROVED'">
      <div class="page-header">
        <h1>Welcome, {{ recruiterName }}! 🏢</h1>
        <p>Manage your job postings and applicants</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card" *ngFor="let stat of stats; let i = index" [style.animation-delay]="(i * 100) + 'ms'" style="animation: fadeInUp 0.5s ease both">
          <div class="stat-icon" [style.background]="stat.bg" [style.color]="stat.color">{{ stat.icon }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card" style="animation: fadeInUp 0.5s ease 0.3s both">
          <div class="card-body">
            <div class="section-header">
              <h3 class="section-title">Recent Applicants</h3>
              <a routerLink="/recruiter/applicants" class="btn btn-sm btn-secondary">View All →</a>
            </div>
            <div class="applicant-list">
              <div class="applicant-item" *ngFor="let app of recentApplicants; let i = index" [style.animation-delay]="(i * 80 + 400) + 'ms'" style="animation: slideInLeft 0.4s ease both">
                <div class="applicant-avatar">{{ app.studentName?.charAt(0) }}</div>
                <div class="applicant-info">
                  <h4>{{ app.studentName }}</h4>
                  <span>{{ app.jobTitle }} · {{ app.studentBranch }}</span>
                </div>
                <span class="badge" [ngClass]="'badge-' + app.status.toLowerCase()">{{ app.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card" style="animation: fadeInUp 0.5s ease 0.4s both">
          <div class="card-body">
            <h3 class="section-title" style="margin-bottom: 16px">Quick Actions</h3>
            <div class="action-grid">
              <a routerLink="/recruiter/jobs" class="action-card"><span>📝</span><span>Post Job</span></a>
              <a routerLink="/recruiter/applicants" class="action-card"><span>👥</span><span>Applicants</span></a>
              <a routerLink="/recruiter/search" class="action-card"><span>🔍</span><span>Search</span></a>
              <a routerLink="/recruiter/profile" class="action-card"><span>👤</span><span>Profile</span></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Pending Screen */
    .pending-screen, .rejected-screen {
      display: flex; align-items: center; justify-content: center;
      min-height: calc(100vh - var(--navbar-height) - 56px);
    }
    .pending-card, .rejected-card {
      text-align: center; max-width: 480px; padding: 48px;
      background: white; border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg); position: relative; overflow: hidden;
      animation: scaleIn 0.5s ease;
    }
    .pending-pulse {
      position: absolute; top: 0; left: 0; right: 0; height: 4px;
      background: linear-gradient(90deg, var(--warning), var(--primary), var(--warning));
      background-size: 200% 100%;
      animation: shimmer 2s infinite;
    }
    .pending-icon, .rejected-icon {
      font-size: 3rem; margin-bottom: 16px;
    }
    .pending-card h2, .rejected-card h2 {
      font-size: 1.4rem; font-weight: 700; color: var(--text-dark); margin-bottom: 10px;
    }
    .pending-card p, .rejected-card p {
      color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 28px;
    }
    .pending-steps {
      display: flex; flex-direction: column; gap: 16px; align-items: flex-start;
      margin: 0 auto; width: fit-content;
    }
    .step {
      display: flex; align-items: center; gap: 12px;
      font-size: 0.9rem; color: var(--text-muted);
    }
    .step.done { color: var(--success); }
    .step.active { color: var(--warning); font-weight: 600; }
    .step-dot {
      width: 12px; height: 12px; border-radius: 50%;
      background: var(--text-muted); flex-shrink: 0;
    }
    .step.done .step-dot { background: var(--success); }
    .step.active .step-dot { background: var(--warning); }
    .step-dot.pulse { animation: pulse 1.5s ease-in-out infinite; }

    .rejected-card { border-top: 4px solid var(--error); }

    /* Dashboard */
    .dashboard-grid {
      display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px;
    }
    .applicant-list { display: flex; flex-direction: column; gap: 10px; }
    .applicant-item {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px; border-radius: var(--radius-md);
      background: var(--bg-secondary); transition: all var(--transition-base);
    }
    .applicant-item:hover { background: var(--primary-50); transform: translateX(4px); }
    .applicant-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-light), var(--primary));
      color: white; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.85rem; flex-shrink: 0;
    }
    .applicant-info { flex: 1; }
    .applicant-info h4 { font-size: 0.88rem; font-weight: 600; color: var(--text-dark); }
    .applicant-info span { font-size: 0.78rem; color: var(--text-secondary); }

    .action-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
    }
    .action-card {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      padding: 18px; border-radius: var(--radius-md);
      background: var(--bg-secondary); border: 1.5px solid transparent;
      transition: all var(--transition-base); text-decoration: none;
    }
    .action-card:hover {
      background: var(--primary-50); border-color: var(--primary);
      transform: translateY(-3px); box-shadow: var(--shadow-md);
    }
    .action-card span:first-child { font-size: 1.5rem; }
    .action-card span:last-child { font-size: 0.8rem; font-weight: 600; color: var(--text-primary); }

    @media (max-width: 768px) { .dashboard-grid { grid-template-columns: 1fr; } }
  `]
})
export class RecruiterDashboardComponent implements OnInit {
  recruiterStatus: 'PENDING' | 'APPROVED' | 'REJECTED' = 'APPROVED';
  stats = [
    { icon: '💼', label: 'Active Jobs', value: 0, bg: '#F7FCEB', color: '#93C215' },
    { icon: '👥', label: 'Total Applicants', value: 0, bg: '#F0F8FF', color: '#0A3641' },
    { icon: '✅', label: 'Accepted', value: 0, bg: '#D1FAE5', color: '#059669' },
    { icon: '📅', label: 'Interviews', value: 0, bg: '#FEF3C7', color: '#D97706' },
  ];
  recentApplicants: any[] = [];
  recruiterName = 'Recruiter';

  constructor(private dataService: MockDataService) {}

  ngOnInit(): void {
    const user = this.dataService.getCurrentUserSync();
    if (user) {
      if (user.name) this.recruiterName = user.name;
      this.dataService.getRecruiterById(user.id).subscribe((r: any) => {
        if (r) {
          this.recruiterName = r.companyName; // Using companyName as display name
          this.recruiterStatus = r.status || 'APPROVED';
          this.loadRecruiterData(r.id);
        }
      });
    }
  }

  loadRecruiterData(recruiterId: number): void {
    if (this.recruiterStatus === 'APPROVED') {
      this.dataService.getJobs().subscribe((jobs: any) => {
        // Filter jobs posted by this recruiter
        const myJobs = jobs.filter((j: any) => j.recruiterId === recruiterId);
        this.stats[0].value = myJobs.length;
      });

      this.dataService.getAllApplications().subscribe((apps: any) => {
        // Filter applicants for this recruiter's jobs
        this.stats[1].value = apps.length;
        this.stats[2].value = apps.filter((a: any) => a.status === 'ACCEPTED').length;
        this.recentApplicants = apps.slice(0, 5);
      });

      this.dataService.getAllInterviews().subscribe((ints: any) => {
         this.stats[3].value = ints.length; 
      });
    }
  }
}
