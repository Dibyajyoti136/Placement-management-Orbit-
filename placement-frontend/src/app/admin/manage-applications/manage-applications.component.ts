import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/mock-data.service';
import { ToastService } from '../../core/toast.service';
import { Application } from '../../models/user.model';

@Component({
  selector: 'app-manage-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="manage-page">
      <div class="page-header">
        <h1>📄 Manage Applications</h1>
        <p>View and override application statuses</p>
      </div>
      <div class="card" style="animation: fadeInUp 0.4s ease">
        <div class="card-body" style="padding: 0; overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr><th>Student</th><th>Job</th><th>Company</th><th>Applied</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let app of applications; let i = index" [style.animation-delay]="(i * 60) + 'ms'" style="animation: fadeInUp 0.3s ease both">
                <td><strong>{{ app.studentName }}</strong></td>
                <td>{{ app.jobTitle }}</td>
                <td>{{ app.companyName }}</td>
                <td>{{ app.appliedDate }}</td>
                <td>
                  <select class="form-control status-select" [(ngModel)]="app.status" (ngModelChange)="updateStatus(app)" [ngClass]="'s-' + app.status.toLowerCase()" style="width:130px; padding:6px 10px; font-size:0.78rem;">
                    <option value="PENDING">PENDING</option>
                    <option value="ACCEPTED">ACCEPTED</option>
                    <option value="DECLINED">DECLINED</option>
                  </select>
                </td>
                <td><span class="badge" [ngClass]="'badge-' + app.status.toLowerCase()">{{ app.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .s-pending { color: #8B6914; background: var(--warning-light); border-color: var(--warning); }
    .s-accepted { color: #1B7A41; background: var(--success-light); border-color: var(--success); }
    .s-declined { color: #A93226; background: var(--error-light); border-color: var(--error); }
  `]
})
export class ManageApplicationsComponent implements OnInit {
  applications: Application[] = [];
  constructor(private dataService: MockDataService, private toast: ToastService) {}
  ngOnInit(): void { this.dataService.getAllApplications().subscribe(a => this.applications = a); }
  updateStatus(app: Application): void {
    this.dataService.updateApplicationStatus(app.id, app.status).subscribe(() => {
      this.toast.success(`Status updated to ${app.status}`);
    });
  }
}
