import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/mock-data.service';
import { ToastService } from '../../core/toast.service';
import { Recruiter } from '../../models/user.model';

@Component({
  selector: 'app-verify-recruiters',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="verify-page">
      <div class="page-header">
        <h1>✅ Recruiter Verification</h1>
        <p>Approve or reject recruiter registrations</p>
      </div>

      <div class="recruiters-grid">
        <div class="recruiter-card card" *ngFor="let rec of recruiters; let i = index" [style.animation-delay]="(i * 100) + 'ms'" style="animation: fadeInUp 0.4s ease both" [class.approved]="rec.status === 'APPROVED'" [class.rejected]="rec.status === 'REJECTED'">
          <div class="card-body">
            <div class="rec-header">
              <div class="rec-avatar">{{ rec.companyName.charAt(0) }}</div>
              <div class="rec-info">
                <h3>{{ rec.name }}</h3>
                <span>{{ rec.companyName }} · {{ rec.designation }}</span>
              </div>
              <span class="badge" [ngClass]="{
                'badge-pending': rec.status === 'PENDING',
                'badge-approved': rec.status === 'APPROVED',
                'badge-rejected': rec.status === 'REJECTED'
              }">{{ rec.status }}</span>
            </div>
            <div class="rec-details">
              <span>📧 {{ rec.email }}</span>
              <span>📱 {{ rec.phone }}</span>
            </div>
            <div class="rec-actions" *ngIf="rec.status === 'PENDING'">
              <button class="btn btn-success" (click)="approve(rec)">✓ Approve</button>
              <button class="btn btn-danger" (click)="reject(rec)">✕ Reject</button>
            </div>
            <div class="rec-status-msg" *ngIf="rec.status === 'APPROVED'">
              <span class="status-anim approved-anim">✅ Approved - Full access granted</span>
            </div>
            <div class="rec-status-msg" *ngIf="rec.status === 'REJECTED'">
              <span class="status-anim rejected-anim">❌ Rejected - Access denied</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .recruiters-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 16px;
    }
    .recruiter-card { overflow: hidden; transition: all var(--transition-base); }
    .recruiter-card.approved { border-left: 4px solid var(--success); }
    .recruiter-card.rejected { border-left: 4px solid var(--error); }
    .rec-header {
      display: flex; align-items: center; gap: 12px; margin-bottom: 14px;
    }
    .rec-avatar {
      width: 44px; height: 44px; border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--primary-light), var(--primary));
      color: white; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 1.1rem; flex-shrink: 0;
    }
    .rec-info { flex: 1; }
    .rec-info h3 { font-size: 1rem; font-weight: 700; color: var(--text-dark); }
    .rec-info span { font-size: 0.82rem; color: var(--text-secondary); }
    .rec-details {
      display: flex; gap: 20px; margin-bottom: 16px;
      font-size: 0.82rem; color: var(--text-secondary);
    }
    .rec-actions { display: flex; gap: 10px; }
    .rec-status-msg { margin-top: 4px; }
    .status-anim { font-size: 0.85rem; font-weight: 600; animation: fadeInUp 0.3s ease; }
    .approved-anim { color: var(--success); }
    .rejected-anim { color: var(--error); }
  `]
})
export class VerifyRecruitersComponent implements OnInit {
  recruiters: Recruiter[] = [];

  constructor(private dataService: MockDataService, private toast: ToastService) {}

  ngOnInit(): void {
    this.dataService.getRecruiters().subscribe(recs => this.recruiters = recs);
  }

  approve(rec: Recruiter): void {
    this.dataService.updateRecruiterStatus(rec.id, 'APPROVED').subscribe(() => {
      rec.status = 'APPROVED';
      this.toast.success(`${rec.name} has been approved!`);
    });
  }

  reject(rec: Recruiter): void {
    this.dataService.updateRecruiterStatus(rec.id, 'REJECTED').subscribe(() => {
      rec.status = 'REJECTED';
      this.toast.error(`${rec.name} has been rejected`);
    });
  }
}
