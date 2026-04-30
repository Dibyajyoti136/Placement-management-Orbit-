import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/mock-data.service';
import { ToastService } from '../../core/toast.service';
import { Recruiter } from '../../models/user.model';

@Component({
  selector: 'app-manage-recruiters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="manage-page">
      <div class="page-header">
        <h1>🏢 Manage Recruiters</h1>
        <p>Control recruiter access and status</p>
      </div>

      <div class="filter-bar" style="animation: fadeInUp 0.4s ease">
        <button class="filter-btn" [class.active]="statusFilter === ''" (click)="statusFilter = ''; filter()">All</button>
        <button class="filter-btn" [class.active]="statusFilter === 'PENDING'" (click)="statusFilter = 'PENDING'; filter()">⏳ Pending</button>
        <button class="filter-btn" [class.active]="statusFilter === 'APPROVED'" (click)="statusFilter = 'APPROVED'; filter()">✅ Approved</button>
        <button class="filter-btn" [class.active]="statusFilter === 'REJECTED'" (click)="statusFilter = 'REJECTED'; filter()">❌ Rejected</button>
      </div>

      <div class="card" style="animation: fadeInUp 0.4s ease 0.1s both">
        <div class="card-body" style="padding: 0; overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th><th>Company</th><th>Designation</th><th>Email</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let rec of filteredRecruiters; let i = index" [style.animation-delay]="(i * 60) + 'ms'" style="animation: fadeInUp 0.3s ease both">
                <td><strong>{{ rec.name }}</strong></td>
                <td>{{ rec.companyName }}</td>
                <td>{{ rec.designation }}</td>
                <td>{{ rec.email }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'badge-pending': rec.status === 'PENDING',
                    'badge-approved': rec.status === 'APPROVED',
                    'badge-rejected': rec.status === 'REJECTED'
                  }">{{ rec.status }}</span>
                </td>
                <td class="actions">
                  <button class="btn btn-sm btn-secondary" (click)="editRecruiter(rec)">✏️</button>
                  <button class="btn btn-sm btn-success" *ngIf="rec.status !== 'APPROVED'" (click)="updateStatus(rec, 'APPROVED')">✓</button>
                  <button class="btn btn-sm btn-danger" *ngIf="rec.status !== 'REJECTED'" (click)="updateStatus(rec, 'REJECTED')">✕</button>
                  <button class="btn btn-sm btn-danger" (click)="deleteRecruiter(rec.id)" title="Delete Account">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Edit Modal -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Edit Recruiter</h2>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-group"><label>Full Name</label><input class="form-control" [(ngModel)]="editForm.name"></div>
            <div class="form-group"><label>Email (Read-only)</label><input class="form-control" [value]="editForm.email" readonly disabled></div>
            <div class="form-group"><label>Company Name</label><input class="form-control" [(ngModel)]="editForm.companyName"></div>
            <div class="form-group"><label>Designation</label><input class="form-control" [(ngModel)]="editForm.designation"></div>
            <div class="form-group"><label>Phone</label><input class="form-control" [(ngModel)]="editForm.phone"></div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()">Cancel</button>
            <button class="btn btn-primary" (click)="saveRecruiter()">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-bar {
      display: flex; gap: 8px; margin-bottom: 16px;
    }
    .filter-btn {
      padding: 8px 18px; border-radius: var(--radius-full);
      background: var(--bg-card); border: 1.5px solid var(--border-light);
      font-size: 0.82rem; font-weight: 600; color: var(--text-primary);
      transition: all var(--transition-base);
    }
    .filter-btn:hover { border-color: var(--primary); }
    .filter-btn.active {
      background: var(--primary); color: white; border-color: var(--primary);
    }
    .actions { display: flex; gap: 6px; }
  `]
})
export class ManageRecruitersComponent implements OnInit {
  recruiters: Recruiter[] = [];
  filteredRecruiters: Recruiter[] = [];
  statusFilter = '';
  showModal = false;
  editForm: Partial<Recruiter> = {};
  editingId = 0;

  constructor(private dataService: MockDataService, private toast: ToastService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.dataService.getRecruiters().subscribe(r => {
      this.recruiters = r;
      this.filter();
    });
  }

  filter(): void {
    this.filteredRecruiters = this.statusFilter
      ? this.recruiters.filter(r => r.status === this.statusFilter)
      : [...this.recruiters];
  }

  editRecruiter(r: Recruiter): void {
    this.editingId = r.id;
    this.editForm = { ...r };
    this.showModal = true;
  }

  closeModal(): void { this.showModal = false; }

  saveRecruiter(): void {
    this.dataService.updateRecruiter(this.editingId, this.editForm).subscribe(() => {
      this.toast.success('Recruiter updated');
      this.load();
      this.closeModal();
    });
  }

  updateStatus(rec: Recruiter, status: 'APPROVED' | 'REJECTED'): void {
    this.dataService.updateRecruiterStatus(rec.id, status).subscribe(() => {
      rec.status = status;
      this.toast.success(`Recruiter ${status.toLowerCase()}`);
      this.filter();
    });
  }

  deleteRecruiter(id: number): void {
    this.dataService.deleteRecruiter(id).subscribe(() => {
      this.toast.success('Recruiter deleted');
      this.load();
    });
  }
}
