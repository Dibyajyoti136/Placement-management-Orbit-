import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/mock-data.service';
import { ToastService } from '../../core/toast.service';
import { Job } from '../../models/user.model';

@Component({
  selector: 'app-manage-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="manage-jobs-page">
      <div class="page-header">
        <div>
          <h1>📝 Manage Jobs</h1>
          <p>Create, edit, and manage your job postings</p>
        </div>
        <button class="btn btn-primary" (click)="openModal()">+ New Job</button>
      </div>

      <!-- Jobs Table -->
      <div class="card" style="animation: fadeInUp 0.4s ease">
        <div class="card-body" style="padding: 0; overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Salary</th>
                <th>Location</th>
                <th>Type</th>
                <th>Openings</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let job of jobs; let i = index" [style.animation-delay]="(i * 60) + 'ms'" style="animation: fadeInUp 0.3s ease both">
                <td><strong>{{ job.title }}</strong><br><span class="text-sm text-muted">{{ job.companyName }}</span></td>
                <td>₹{{ job.salary | number }}</td>
                <td>{{ job.location }}</td>
                <td><span class="badge badge-info">{{ job.type }}</span></td>
                <td>{{ job.openings || 'N/A' }}</td>
                <td>{{ job.createdDate }}</td>
                <td class="actions">
                  <button class="btn btn-sm btn-secondary" (click)="editJob(job)">✏️</button>
                  <button class="btn btn-sm btn-danger" (click)="deleteJob(job.id)">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingJob ? 'Edit Job' : 'Create New Job' }}</h2>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label>Job Title</label>
                <input class="form-control" [(ngModel)]="form.title" placeholder="e.g. Software Engineer">
              </div>
              <div class="form-group">
                <label>Company Name</label>
                <input class="form-control" [(ngModel)]="form.companyName" placeholder="Company name">
              </div>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea class="form-control" rows="3" [(ngModel)]="form.description" placeholder="Job description..."></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Salary (₹)</label>
                <input class="form-control" type="number" [(ngModel)]="form.salary" placeholder="Annual salary">
              </div>
              <div class="form-group">
                <label>Location</label>
                <input class="form-control" [(ngModel)]="form.location" placeholder="City, Country">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Type</label>
                <select class="form-control" [(ngModel)]="form.type">
                  <option>Full-time</option>
                  <option>Internship</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                </select>
              </div>
              <div class="form-group">
                <label>Openings</label>
                <input class="form-control" type="number" [(ngModel)]="form.openings" placeholder="Number of positions">
              </div>
            </div>
            <div class="form-group">
              <label>Requirements</label>
              <input class="form-control" [(ngModel)]="form.requirements" placeholder="e.g. Angular, Java, Spring Boot">
            </div>
            <div class="form-group">
              <label>Deadline</label>
              <input class="form-control" type="date" [(ngModel)]="form.deadline">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()">Cancel</button>
            <button class="btn btn-primary" (click)="saveJob()">{{ editingJob ? 'Update' : 'Create' }} Job</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; }
    .text-sm { font-size: 0.78rem; }
    .text-muted { color: var(--text-muted); }
    .actions { display: flex; gap: 6px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    textarea.form-control { resize: vertical; }
    @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
  `]
})
export class ManageJobsComponent implements OnInit {
  jobs: Job[] = [];
  showModal = false;
  editingJob: Job | null = null;
  form: Partial<Job> = {};

  constructor(private dataService: MockDataService, private toast: ToastService) {}

  ngOnInit(): void { this.loadJobs(); }

  loadJobs(): void {
    this.dataService.getJobs().subscribe(jobs => this.jobs = jobs);
  }

  openModal(job?: Job): void {
    this.editingJob = job || null;
    this.form = job ? { ...job } : { type: 'Full-time', companyName: 'TechNova Solutions', recruiterId: 2 };
    this.showModal = true;
  }

  editJob(job: Job): void { this.openModal(job); }

  closeModal(): void { this.showModal = false; this.editingJob = null; }

  saveJob(): void {
    if (!this.form.title) { this.toast.warning('Job title is required'); return; }
    if (this.editingJob) {
      this.dataService.updateJob(this.editingJob.id, this.form).subscribe(() => {
        this.toast.success('Job updated!');
        this.loadJobs();
        this.closeModal();
      });
    } else {
      this.dataService.createJob(this.form).subscribe(() => {
        this.toast.success('Job created!');
        this.loadJobs();
        this.closeModal();
      });
    }
  }

  deleteJob(id: number): void {
    this.dataService.deleteJob(id).subscribe(() => {
      this.toast.success('Job deleted');
      this.loadJobs();
    });
  }
}
