import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MockDataService } from '../../core/mock-data.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-schedule-interview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="schedule-page">
      <div class="page-header">
        <a (click)="goBack()" class="back-link" style="cursor:pointer">← Back</a>
        <h1>📅 Schedule Interview</h1>
        <p>Set up an interview for the selected applicant</p>
      </div>

      <div class="card schedule-card" style="max-width: 600px; animation: fadeInUp 0.4s ease;">
        <div class="card-body">
          <div class="form-group">
            <label>Interview Type</label>
            <div class="type-selector">
              <button class="type-btn" [class.active]="interviewType === 'ONLINE'" (click)="interviewType = 'ONLINE'">
                <span>💻</span> Online
              </button>
              <button class="type-btn" [class.active]="interviewType === 'OFFLINE'" (click)="interviewType = 'OFFLINE'">
                <span>🏢</span> Offline
              </button>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Date</label>
              <input class="form-control" type="date" [(ngModel)]="interviewDate">
            </div>
            <div class="form-group">
              <label>Time</label>
              <input class="form-control" type="time" [(ngModel)]="interviewTime">
            </div>
          </div>

          <!-- ONLINE Fields -->
          <div class="dynamic-field" *ngIf="interviewType === 'ONLINE'" style="animation: fadeInUp 0.3s ease">
            <div class="form-group">
              <label>Meeting Link</label>
              <input class="form-control" [(ngModel)]="meetingLink" placeholder="https://zoom.us/j/...">
            </div>
          </div>

          <!-- OFFLINE Fields -->
          <div class="dynamic-field" *ngIf="interviewType === 'OFFLINE'" style="animation: fadeInUp 0.3s ease">
            <div class="form-group">
              <label>Location / Address</label>
              <textarea class="form-control" rows="2" [(ngModel)]="location" placeholder="Office address, room number..."></textarea>
            </div>
          </div>

          <button class="btn btn-primary btn-lg" style="width:100%; margin-top: 12px" (click)="scheduleInterview()">
            Schedule Interview
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .back-link {
      font-size: 0.85rem; color: var(--primary-dark); font-weight: 500;
      display: inline-block; margin-bottom: 12px;
      transition: transform var(--transition-fast);
    }
    .back-link:hover { transform: translateX(-4px); }
    .type-selector {
      display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
    }
    .type-btn {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      padding: 14px; border-radius: var(--radius-md);
      background: var(--bg-secondary); border: 2px solid transparent;
      font-weight: 600; font-size: 0.9rem; color: var(--text-primary);
      transition: all var(--transition-base);
    }
    .type-btn:hover { border-color: var(--border-medium); }
    .type-btn.active {
      border-color: var(--primary); background: var(--primary-50);
      color: var(--primary-dark);
    }
    .type-btn span { font-size: 1.3rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    textarea.form-control { resize: vertical; }
  `]
})
export class ScheduleInterviewComponent implements OnInit {
  interviewType: 'ONLINE' | 'OFFLINE' = 'ONLINE';
  interviewDate = '';
  interviewTime = '';
  meetingLink = '';
  location = '';
  applicationId = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: MockDataService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.applicationId = Number(this.route.snapshot.paramMap.get('appId'));
  }

  goBack(): void { this.router.navigate(['/recruiter/applicants']); }

  scheduleInterview(): void {
    if (!this.interviewDate || !this.interviewTime) {
      this.toast.warning('Please select date and time');
      return;
    }
    const interview = {
      applicationId: this.applicationId,
      type: this.interviewType,
      dateTime: `${this.interviewDate}T${this.interviewTime}:00`,
      meetingLink: this.interviewType === 'ONLINE' ? this.meetingLink : undefined,
      location: this.interviewType === 'OFFLINE' ? this.location : undefined,
    };
    this.dataService.createInterview(interview).subscribe(() => {
      this.toast.success('Interview scheduled successfully!');
      this.router.navigate(['/recruiter/applicants']);
    });
  }
}
