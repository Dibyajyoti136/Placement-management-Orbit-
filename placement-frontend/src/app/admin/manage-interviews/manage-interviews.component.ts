import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/mock-data.service';
import { ToastService } from '../../core/toast.service';
import { Interview } from '../../models/user.model';

@Component({
  selector: 'app-manage-interviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="manage-page">
      <div class="page-header">
        <h1>📅 Manage Interviews</h1>
        <p>View, edit, and manage all scheduled interviews</p>
      </div>
      <div class="card" style="animation: fadeInUp 0.4s ease">
        <div class="card-body" style="padding: 0; overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr><th>Student</th><th>Job</th><th>Company</th><th>Type</th><th>Date & Time</th><th>Link/Location</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let int of interviews; let i = index" [style.animation-delay]="(i * 60) + 'ms'" style="animation: fadeInUp 0.3s ease both">
                <td><strong>{{ int.studentName }}</strong></td>
                <td>{{ int.jobTitle }}</td>
                <td>{{ int.companyName }}</td>
                <td><span class="badge" [ngClass]="int.type === 'ONLINE' ? 'badge-info' : 'badge-approved'">{{ int.type }}</span></td>
                <td>{{ formatDateTime(int.dateTime) }}</td>
                <td>{{ int.type === 'ONLINE' ? (int.meetingLink || '—') : (int.location || '—') }}</td>
                <td class="actions">
                  <button class="btn btn-sm btn-secondary" (click)="editInterview(int)">✏️</button>
                  <button class="btn btn-sm btn-danger" (click)="deleteInterview(int.id)">🗑️</button>
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
            <h2>Edit Interview</h2>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Type</label>
              <select class="form-control" [(ngModel)]="editForm.type">
                <option value="ONLINE">ONLINE</option>
                <option value="OFFLINE">OFFLINE</option>
              </select>
            </div>
            <div class="form-group">
              <label>Date & Time</label>
              <input class="form-control" type="datetime-local" [(ngModel)]="editForm.dateTime">
            </div>
            <div class="form-group" *ngIf="editForm.type === 'ONLINE'">
              <label>Meeting Link</label>
              <input class="form-control" [(ngModel)]="editForm.meetingLink">
            </div>
            <div class="form-group" *ngIf="editForm.type === 'OFFLINE'">
              <label>Location</label>
              <input class="form-control" [(ngModel)]="editForm.location">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()">Cancel</button>
            <button class="btn btn-primary" (click)="saveInterview()">Save</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`.actions { display: flex; gap: 6px; }`]
})
export class ManageInterviewsComponent implements OnInit {
  interviews: Interview[] = [];
  showModal = false;
  editForm: Partial<Interview> = {};
  editingId = 0;

  constructor(private dataService: MockDataService, private toast: ToastService) {}
  ngOnInit(): void { this.load(); }

  load(): void { this.dataService.getAllInterviews().subscribe(i => this.interviews = i); }

  formatDateTime(dt: string): string {
    return new Date(dt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  }

  editInterview(int: Interview): void {
    this.editingId = int.id;
    this.editForm = { ...int };
    this.showModal = true;
  }

  closeModal(): void { this.showModal = false; }

  saveInterview(): void {
    this.dataService.updateInterview(this.editingId, this.editForm).subscribe(() => {
      this.toast.success('Interview updated');
      this.load();
      this.closeModal();
    });
  }

  deleteInterview(id: number): void {
    this.dataService.deleteInterview(id).subscribe(() => {
      this.toast.success('Interview deleted');
      this.load();
    });
  }
}
