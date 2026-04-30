import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/mock-data.service';
import { ToastService } from '../../core/toast.service';
import { Job } from '../../models/user.model';

@Component({
  selector: 'app-admin-manage-jobs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="manage-page">
      <div class="page-header">
        <h1>💼 Manage Jobs</h1>
        <p>View and moderate all job listings</p>
      </div>
      <div class="card" style="animation: fadeInUp 0.4s ease">
        <div class="card-body" style="padding: 0; overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr><th>Title</th><th>Company</th><th>Salary</th><th>Location</th><th>Type</th><th>Posted</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let job of jobs; let i = index" [style.animation-delay]="(i * 60) + 'ms'" style="animation: fadeInUp 0.3s ease both">
                <td><strong>{{ job.title }}</strong></td>
                <td>{{ job.companyName }}</td>
                <td>₹{{ job.salary | number }}</td>
                <td>{{ job.location }}</td>
                <td><span class="badge badge-info">{{ job.type }}</span></td>
                <td>{{ job.createdDate }}</td>
                <td><button class="btn btn-sm btn-danger" (click)="deleteJob(job.id)">🗑️ Delete</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminManageJobsComponent implements OnInit {
  jobs: Job[] = [];
  constructor(private dataService: MockDataService, private toast: ToastService) {}
  ngOnInit(): void { this.dataService.getJobs().subscribe(j => this.jobs = j); }
  deleteJob(id: number): void {
    this.dataService.deleteJob(id).subscribe(() => {
      this.toast.success('Job deleted');
      this.dataService.getJobs().subscribe(j => this.jobs = j);
    });
  }
}
