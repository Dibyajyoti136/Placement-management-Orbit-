import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/mock-data.service';
import { ToastService } from '../../core/toast.service';
import { Recruiter } from '../../models/user.model';

@Component({
  selector: 'app-recruiter-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="rp-page">
      <div class="rp-header">
        <div class="rp-header-grid"></div>
        <div class="rp-header-content">
          <div class="rp-logo-badge">
            <span>{{ recruiter?.companyName?.charAt(0) || 'R' }}</span>
          </div>
          <div class="rp-header-info">
            <h1>{{ recruiter?.companyName || 'Company' }}</h1>
            <p class="rp-subtitle">{{ recruiter?.name }} · {{ recruiter?.designation }}</p>
            <div class="rp-meta-row">
              <span class="rp-meta">📧 {{ recruiter?.email }}</span>
              <span class="rp-meta" *ngIf="recruiter?.phone">📞 {{ recruiter?.phone }}</span>
            </div>
          </div>
          <div class="rp-status-badge" [ngClass]="'status-' + (recruiter?.status?.toLowerCase() || 'pending')">
            <span class="rp-status-dot"></span>
            {{ recruiter?.status || 'PENDING' }}
          </div>
        </div>
      </div>

      <div class="rp-body">
        <div class="rp-stats-row" style="animation: fadeInUp 0.5s ease 0.1s both">
          <div class="rp-stat-card" *ngFor="let stat of stats; let i = index"
               [style.animation-delay]="(i * 60 + 150) + 'ms'" style="animation: fadeInUp 0.4s ease both">
            <div class="rp-stat-icon" [style.background]="stat.bg">{{ stat.icon }}</div>
            <div class="rp-stat-val">{{ stat.value }}</div>
            <div class="rp-stat-lbl">{{ stat.label }}</div>
          </div>
        </div>

        <div class="rp-grid">
          <div class="rp-card rp-info-card" style="animation: fadeInUp 0.5s ease 0.25s both">
            <div class="rp-card-header"><h3>🏢 Company Overview</h3></div>
            <div class="rp-info-list">
              <div class="rp-info-item" *ngFor="let info of infoItems">
                <div class="rp-info-icon">{{ info.icon }}</div>
                <div><span class="rp-info-label">{{ info.label }}</span><strong>{{ info.value }}</strong></div>
              </div>
            </div>
          </div>

          <div class="rp-card rp-form-card" style="animation: fadeInUp 0.5s ease 0.3s both">
            <div class="rp-card-header">
              <h3>✏️ Edit Profile</h3>
              <span class="rp-card-badge">Recruiter</span>
            </div>
            <form (ngSubmit)="saveProfile()" *ngIf="recruiter" class="rp-form">
              <div class="rp-form-row">
                <div class="form-group"><label>Full Name</label>
                  <input class="form-control" [(ngModel)]="recruiter.name" name="name">
                </div>
                <div class="form-group"><label>Email</label>
                  <input class="form-control" [value]="recruiter.email" readonly disabled>
                </div>
              </div>
              <div class="rp-form-row">
                <div class="form-group"><label>Company Name</label>
                  <input class="form-control" [(ngModel)]="recruiter.companyName" name="company">
                </div>
                <div class="form-group"><label>Designation</label>
                  <input class="form-control" [(ngModel)]="recruiter.designation" name="designation">
                </div>
              </div>
              <div class="form-group"><label>Phone</label>
                <input class="form-control" [(ngModel)]="recruiter.phone" name="phone">
              </div>
              <button type="submit" class="rp-save-btn" [disabled]="isSaving">
                {{ isSaving ? '⏳ Saving...' : '💾 Save Changes' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rp-header {
      position: relative; padding: 36px 32px; overflow: hidden;
      background: linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0D9488 100%);
      border-radius: 0 0 var(--radius-xl) var(--radius-xl);
    }
    .rp-header-grid {
      position: absolute; inset: 0; opacity: 0.04;
      background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
      background-size: 48px 48px;
    }
    .rp-header-content {
      position: relative; z-index: 2; display: flex; align-items: center; gap: 24px;
      animation: fadeInUp 0.6s ease;
    }
    .rp-logo-badge {
      width: 80px; height: 80px; border-radius: var(--radius-lg);
      background: linear-gradient(135deg, var(--primary), var(--accent));
      display: flex; align-items: center; justify-content: center;
      font-size: 2.2rem; font-weight: 900; color: white; flex-shrink: 0;
      box-shadow: 0 8px 24px rgba(20,184,166,0.3);
    }
    .rp-header-info { flex: 1; color: white; }
    .rp-header-info h1 { font-size: 1.7rem; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 4px; }
    .rp-subtitle { font-size: 0.9rem; color: rgba(255,255,255,0.7); margin-bottom: 8px; }
    .rp-meta-row { display: flex; gap: 20px; }
    .rp-meta { font-size: 0.8rem; color: rgba(255,255,255,0.5); }
    .rp-status-badge {
      padding: 8px 18px; border-radius: var(--radius-full); font-size: 0.75rem;
      font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
      display: flex; align-items: center; gap: 8px; flex-shrink: 0;
    }
    .rp-status-dot { width: 8px; height: 8px; border-radius: 50%; }
    .status-approved { background: rgba(16,185,129,0.15); color: #34D399; }
    .status-approved .rp-status-dot { background: #34D399; box-shadow: 0 0 8px #34D399; }
    .status-pending { background: rgba(251,191,36,0.15); color: #FBBF24; }
    .status-pending .rp-status-dot { background: #FBBF24; animation: pulse 1.5s infinite; }
    .status-rejected { background: rgba(239,68,68,0.15); color: #F87171; }
    .status-rejected .rp-status-dot { background: #F87171; }

    .rp-body { padding: 0 24px 40px; margin-top: -16px; position: relative; z-index: 5; }
    .rp-stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .rp-stat-card {
      background: white; border-radius: var(--radius-lg); padding: 20px; text-align: center;
      border: 1px solid var(--border-light); box-shadow: var(--shadow-sm);
      transition: all var(--transition-spring);
    }
    .rp-stat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
    .rp-stat-icon {
      width: 42px; height: 42px; border-radius: var(--radius-md);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem; margin: 0 auto 10px;
    }
    .rp-stat-val { font-size: 1.5rem; font-weight: 800; color: var(--text-dark); }
    .rp-stat-lbl { font-size: 0.72rem; color: var(--text-muted); margin-top: 4px; }

    .rp-grid { display: grid; grid-template-columns: 360px 1fr; gap: 20px; }
    .rp-card {
      background: white; border-radius: var(--radius-lg); border: 1px solid var(--border-light);
      box-shadow: var(--shadow-sm); transition: all var(--transition-base); overflow: hidden;
    }
    .rp-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
    .rp-card-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 24px; border-bottom: 1px solid var(--border-light); background: var(--bg-secondary);
    }
    .rp-card-header h3 { font-size: 0.95rem; font-weight: 700; color: var(--text-dark); margin: 0; }
    .rp-card-badge {
      padding: 3px 10px; border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white; font-size: 0.68rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.08em;
    }
    .rp-info-list { padding: 8px 0; }
    .rp-info-item {
      display: flex; align-items: center; gap: 14px; padding: 12px 24px;
      transition: background 0.2s ease;
    }
    .rp-info-item:hover { background: var(--bg-secondary); }
    .rp-info-item:not(:last-child) { border-bottom: 1px solid var(--border-light); }
    .rp-info-icon { font-size: 1.1rem; width: 28px; text-align: center; }
    .rp-info-label {
      font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;
      letter-spacing: 0.06em; font-weight: 600; display: block;
    }
    .rp-info-item strong { font-size: 0.88rem; color: var(--text-dark); }
    .rp-form { padding: 24px; }
    .rp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .rp-save-btn {
      width: 100%; padding: 14px; border-radius: var(--radius-full);
      background: linear-gradient(135deg, #0F172A, #1E3A5F);
      color: white; font-weight: 700; font-size: 0.95rem; border: none; cursor: pointer;
      transition: all var(--transition-base); box-shadow: 0 4px 15px rgba(15,23,42,0.2);
    }
    .rp-save-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(15,23,42,0.3); }
    .rp-save-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    @media (max-width: 900px) {
      .rp-grid { grid-template-columns: 1fr; }
      .rp-stats-row { grid-template-columns: 1fr 1fr; }
      .rp-form-row { grid-template-columns: 1fr; }
      .rp-header-content { flex-direction: column; text-align: center; }
      .rp-meta-row { justify-content: center; }
    }
  `]
})
export class RecruiterProfileComponent implements OnInit {
  recruiter: Recruiter | null = null;
  isSaving = false;
  stats = [
    { icon: '💼', label: 'Posted Jobs', value: 0, bg: '#F0FDFA' },
    { icon: '👥', label: 'Applicants', value: 0, bg: '#EFF6FF' },
    { icon: '✅', label: 'Accepted', value: 0, bg: '#ECFDF5' },
    { icon: '📅', label: 'Interviews', value: 0, bg: '#FEF3C7' },
  ];

  get infoItems() {
    return [
      { icon: '🏷️', label: 'Company', value: this.recruiter?.companyName || '—' },
      { icon: '💼', label: 'Designation', value: this.recruiter?.designation || '—' },
      { icon: '👤', label: 'Contact', value: this.recruiter?.name || '—' },
      { icon: '📧', label: 'Email', value: this.recruiter?.email || '—' },
      { icon: '📱', label: 'Phone', value: this.recruiter?.phone || '—' },
    ];
  }

  constructor(private dataService: MockDataService, private toast: ToastService) {}

  ngOnInit(): void {
    const user = this.dataService.getCurrentUserSync();
    if (user) {
      this.dataService.getRecruiterById(user.id).subscribe(r => {
        this.recruiter = r || null;
        if (r) this.loadStats(r.id);
      });
    }
  }

  loadStats(recruiterId: number): void {
    this.dataService.getJobs().subscribe(jobs => {
      this.stats[0].value = jobs.filter(j => j.recruiterId === recruiterId).length;
    });
    this.dataService.getAllApplications().subscribe(apps => {
      this.stats[1].value = apps.length;
      this.stats[2].value = apps.filter(a => a.status === 'ACCEPTED').length;
    });
    this.dataService.getAllInterviews().subscribe(ints => {
      this.stats[3].value = ints.length;
    });
  }

  saveProfile(): void {
    if (!this.recruiter) return;
    this.isSaving = true;
    this.dataService.updateRecruiter(this.recruiter.id, this.recruiter).subscribe(() => {
      this.isSaving = false;
      if (this.recruiter) this.dataService.updateCachedUser(this.recruiter.name || this.recruiter.companyName);
      this.toast.success('Profile updated successfully!');
    });
  }
}
