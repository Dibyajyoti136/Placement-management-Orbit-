import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../core/mock-data.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <div class="page-header">
        <h1>🛡️ Admin Dashboard</h1>
        <p>System overview and management</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card" *ngFor="let stat of stats; let i = index" [style.animation-delay]="(i * 100) + 'ms'" style="animation: fadeInUp 0.5s ease both">
          <div class="stat-icon" [style.background]="stat.bg" [style.color]="stat.color">{{ stat.icon }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>

      <div class="admin-grid">
        <a *ngFor="let item of managementItems; let i = index" [routerLink]="item.route" class="mgmt-card card" [style.animation-delay]="(i * 80 + 300) + 'ms'" style="animation: fadeInUp 0.4s ease both">
          <div class="card-body">
            <span class="mgmt-icon">{{ item.icon }}</span>
            <h3>{{ item.label }}</h3>
            <p>{{ item.description }}</p>
            <span class="mgmt-arrow">→</span>
          </div>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .admin-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;
    }
    .mgmt-card { cursor: pointer; position: relative; overflow: hidden; }
    .mgmt-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-4px); }
    .mgmt-card .card-body { display: flex; flex-direction: column; gap: 8px; }
    .mgmt-icon { font-size: 2rem; }
    .mgmt-card h3 { font-size: 1.05rem; font-weight: 700; color: var(--text-dark); }
    .mgmt-card p { font-size: 0.83rem; color: var(--text-secondary); flex: 1; }
    .mgmt-arrow {
      position: absolute; bottom: 20px; right: 24px;
      font-size: 1.2rem; color: var(--primary); opacity: 0;
      transition: all var(--transition-base);
    }
    .mgmt-card:hover .mgmt-arrow { opacity: 1; transform: translateX(4px); }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats = [
    { icon: '👨‍🎓', label: 'Students', value: 0, bg: '#F7FCEB', color: '#93C215' },
    { icon: '🏢', label: 'Recruiters', value: 0, bg: '#F0F8FF', color: '#0A3641' },
    { icon: '💼', label: 'Jobs', value: 0, bg: '#D1FAE5', color: '#059669' },
    { icon: '📄', label: 'Applications', value: 0, bg: '#FEF3C7', color: '#D97706' },
    { icon: '📅', label: 'Interviews', value: 0, bg: '#FEE2E2', color: '#DC2626' },
    { icon: '⏳', label: 'Pending Approval', value: 0, bg: '#F3E8FF', color: '#9333EA' },
  ];
  managementItems = [
    { icon: '✅', label: 'Verify Recruiters', description: 'Approve or reject recruiter registrations', route: '/admin/verify' },
    { icon: '👨‍🎓', label: 'Manage Students', description: 'View, edit, and manage student accounts', route: '/admin/students' },
    { icon: '🏢', label: 'Manage Recruiters', description: 'Control recruiter access and status', route: '/admin/recruiters' },
    { icon: '💼', label: 'Manage Jobs', description: 'View and moderate all job listings', route: '/admin/jobs' },
    { icon: '📄', label: 'Manage Applications', description: 'Overview and override application statuses', route: '/admin/applications' },
    { icon: '📅', label: 'Manage Interviews', description: 'View, edit, and manage all interviews', route: '/admin/interviews' },
  ];

  constructor(private dataService: MockDataService) {}

  ngOnInit(): void {
    this.dataService.getStudents().subscribe(s => this.stats[0].value = s.length);
    this.dataService.getRecruiters().subscribe(r => {
      this.stats[1].value = r.length;
      this.stats[5].value = r.filter(x => x.status === 'PENDING').length;
    });
    this.dataService.getJobs().subscribe(j => this.stats[2].value = j.length);
    this.dataService.getAllApplications().subscribe(a => this.stats[3].value = a.length);
    this.dataService.getAllInterviews().subscribe(i => this.stats[4].value = i.length);
  }
}
