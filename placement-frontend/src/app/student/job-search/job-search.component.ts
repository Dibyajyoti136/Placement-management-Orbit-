import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/mock-data.service';
import { ToastService } from '../../core/toast.service';
import { Job } from '../../models/user.model';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="job-search-page">
      <div class="page-header">
        <h1>🔍 Discover Opportunities</h1>
        <p>Find and apply to your dream job</p>
      </div>

      <!-- Search & Filters -->
      <div class="card filter-card" style="animation: fadeInUp 0.4s ease">
        <div class="card-body filter-body">
          <div class="search-input-wrap">
            <span class="search-icon">🔎</span>
            <input type="text" class="form-control" placeholder="Search by job title or keyword..."
                   [(ngModel)]="searchQuery" (keyup.enter)="searchJobs()">
          </div>
          <button class="btn btn-primary search-btn" (click)="searchJobs()" [disabled]="isLoading">
            {{ isLoading ? 'Searching...' : 'Search Jobs' }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div class="jobs-grid" *ngIf="isLoading">
        <div class="card skeleton-card" *ngFor="let s of [1,2,3,4,5,6]" style="animation: pulse 1.5s infinite"></div>
      </div>

      <!-- Jobs Grid -->
      <div class="jobs-grid" *ngIf="!isLoading && jobs.length > 0">
        <div class="card job-card" *ngFor="let job of jobs; let i = index" 
             [style.animation-delay]="(i * 80) + 'ms'" style="animation: slideUp 0.5s ease both">
          <div class="card-body">
            <div class="jc-header">
              <div class="company-logo">{{ job.companyName?.charAt(0) || 'C' }}</div>
              <div class="jc-title-wrap">
                <h3 class="job-title">{{ job.title }}</h3>
                <span class="company-name">{{ job.companyName }}</span>
              </div>
            </div>
            
            <p class="job-desc">{{ job.description }}</p>
            
            <div class="job-meta-grid">
              <div class="meta-item">
                <span class="meta-icon">💰</span>
                <div>
                  <span class="meta-label">Salary</span>
                  <strong>{{ job.salary | currency:'INR' }}</strong>
                </div>
              </div>
              <div class="meta-item">
                <span class="meta-icon">📍</span>
                <div>
                  <span class="meta-label">Location</span>
                  <strong>{{ job.location }}</strong>
                </div>
              </div>
            </div>
            
            <div class="jc-footer">
              <span class="post-date">Posted on {{ job.createdDate | date:'mediumDate' || job.createdDate }}</span>
              <button class="btn btn-primary btn-sm apply-btn" 
                      [class.applied]="hasApplied(job.id)"
                      [disabled]="hasApplied(job.id) || applyingId === job.id"
                      (click)="apply(job.id)">
                <span *ngIf="applyingId === job.id" class="btn-spinner"></span>
                <span *ngIf="applyingId !== job.id">{{ hasApplied(job.id) ? '✅ Applied' : '🚀 Apply Now' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!isLoading && jobs.length === 0" style="animation: scaleIn 0.4s ease">
        <div class="empty-icon blob-anim">🔍</div>
        <h3>No jobs found</h3>
        <p>We couldn't find any jobs matching "{{ searchQuery }}". Try adjusting your search.</p>
        <button class="btn btn-secondary" style="margin-top: 16px" (click)="searchQuery=''; searchJobs()">
          Clear Search
        </button>
      </div>
    </div>
  `,
  styles: [`
    .job-search-page { display: flex; flex-direction: column; gap: 24px; }
    
    .filter-card { border-radius: var(--radius-xl); overflow: visible; z-index: 10; }
    .filter-body { display: flex; gap: 16px; padding: 24px; }
    
    .search-input-wrap { flex: 1; position: relative; }
    .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 1.1rem; }
    .search-input-wrap input { padding-left: 48px; height: 52px; border-radius: var(--radius-full); font-size: 1rem; }
    
    .search-btn { height: 52px; padding: 0 32px; border-radius: var(--radius-full); font-size: 1rem; }

    .jobs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; }
    
    .job-card { 
      border-radius: var(--radius-xl); display: flex; flex-direction: column;
      border: 1px solid rgba(20, 184, 166, 0.15); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .job-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
      border-color: rgba(20, 184, 166, 0.4);
    }
    
    .jc-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
    .company-logo {
      width: 56px; height: 56px; border-radius: 16px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white; font-size: 1.6rem; font-weight: 800; display: flex;
      align-items: center; justify-content: center; flex-shrink: 0;
      box-shadow: 0 8px 20px rgba(20, 184, 166, 0.25);
    }
    .jc-title-wrap { flex: 1; overflow: hidden; }
    .job-title { font-size: 1.15rem; font-weight: 800; color: var(--text-dark); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .company-name { font-size: 0.9rem; color: var(--primary-darker); font-weight: 600; }
    
    .job-desc {
      font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;
      margin-bottom: 24px; display: -webkit-box; -webkit-line-clamp: 3;
      -webkit-box-orient: vertical; overflow: hidden; flex: 1;
    }
    
    .job-meta-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;
      padding: 16px; background: var(--bg-secondary); border-radius: var(--radius-lg);
    }
    .meta-item { display: flex; align-items: center; gap: 12px; }
    .meta-icon {
      width: 32px; height: 32px; border-radius: 8px; background: white;
      display: flex; align-items: center; justify-content: center; font-size: 1rem;
      box-shadow: var(--shadow-sm);
    }
    .meta-label { display: block; font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; }
    .meta-item strong { display: block; font-size: 0.95rem; color: var(--text-dark); font-weight: 800; }
    
    .jc-footer {
      display: flex; align-items: center; justify-content: space-between;
      padding-top: 20px; border-top: 1px solid var(--border-light); margin-top: auto;
    }
    .post-date { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
    
    .apply-btn { padding: 10px 24px; border-radius: var(--radius-full); font-size: 0.85rem; }
    .apply-btn.applied { 
      background: var(--success-light); color: var(--success); 
      border: 1px solid rgba(16, 185, 129, 0.3); box-shadow: none; pointer-events: none;
    }

    .blob-anim { font-size: 4rem; filter: drop-shadow(0 10px 15px rgba(20, 184, 166, 0.2)); animation: float 4s ease-in-out infinite; margin-bottom: 20px;}
    
    @media (max-width: 768px) {
      .filter-body { flex-direction: column; }
      .search-btn { width: 100%; }
      .jobs-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class JobSearchComponent implements OnInit {
  jobs: Job[] = [];
  searchQuery = '';
  isLoading = true;
  applyingId: number | null = null;
  appliedJobIds: Set<number> = new Set();
  studentId: number | null = null;

  constructor(private dataService: MockDataService, private toast: ToastService) {}

  ngOnInit(): void {
    const user = this.dataService.getCurrentUserSync();
    if (user) {
      this.studentId = user.id;
      this.loadAppliedJobs();
    }
    this.searchJobs();
  }

  loadAppliedJobs(): void {
    if (!this.studentId) return;
    this.dataService.getStudentApplications(this.studentId).subscribe(apps => {
      this.appliedJobIds = new Set(apps.map(a => a.jobId));
    });
  }

  searchJobs(): void {
    this.isLoading = true;
    this.dataService.getJobs(this.searchQuery).subscribe(jobs => {
      this.jobs = jobs;
      this.isLoading = false;
    });
  }

  hasApplied(jobId: number): boolean {
    return this.appliedJobIds.has(jobId);
  }

  apply(jobId: number): void {
    if (!this.studentId) {
      this.toast.error('Please login as a student to apply.');
      return;
    }
    this.applyingId = jobId;
    this.dataService.applyForJob(this.studentId, jobId).subscribe(() => {
      this.appliedJobIds.add(jobId);
      this.applyingId = null;
      this.toast.success('Successfully applied for the job! 🎉');
    }, err => {
      this.applyingId = null;
      this.toast.error(err.error?.message || 'Failed to apply. Please try again.');
    });
  }
}
