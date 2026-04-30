import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/mock-data.service';
import { ToastService } from '../../core/toast.service';
import { Student } from '../../models/user.model';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sp-page">
      <div class="sp-hero">
        <div class="sp-hero-pattern"></div>
        <div class="sp-hero-content">
          <div class="sp-avatar-wrap">
            <div class="sp-avatar">{{ student?.name?.charAt(0) || 'S' }}</div>
          </div>
          <h1>{{ student?.name || 'Student' }}</h1>
          <p class="sp-email">{{ student?.email }}</p>
          <div class="sp-hero-tags">
            <span class="sp-tag">🎓 {{ student?.branch || 'N/A' }}</span>
            <span class="sp-tag">⭐ {{ student?.cgpa || '0.0' }} CGPA</span>
          </div>
        </div>
      </div>

      <div class="sp-body">
        <div class="sp-stats-bar" style="animation: fadeInUp 0.5s ease 0.1s both">
          <div class="sp-stat-item" *ngFor="let s of statItems">
            <div class="sp-stat-icon" [style.background]="s.bg">{{ s.icon }}</div>
            <div><strong>{{ s.value }}</strong><span>{{ s.label }}</span></div>
          </div>
        </div>

        <div class="sp-grid">
          <div class="sp-card" style="animation: fadeInUp 0.5s ease 0.2s both">
            <h3>💡 Skills</h3>
            <div class="sp-skills-list">
              <span class="sp-skill" *ngFor="let skill of skillsList">{{ skill }}</span>
            </div>
          </div>

          <div class="sp-card sp-cgpa-card" style="animation: fadeInUp 0.5s ease 0.25s both">
            <h3>📊 Academic Score</h3>
            <div class="sp-gauge-wrap">
              <svg viewBox="0 0 120 120" class="sp-gauge">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#E2E8F0" stroke-width="10"/>
                <circle cx="60" cy="60" r="52" fill="none" stroke="url(#gaugeGrad)" stroke-width="10"
                        stroke-linecap="round" [attr.stroke-dasharray]="gaugeDash"
                        transform="rotate(-90 60 60)" style="transition: stroke-dasharray 1s ease"/>
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#14B8A6"/>
                    <stop offset="100%" stop-color="#3B82F6"/>
                  </linearGradient>
                </defs>
              </svg>
              <div class="sp-gauge-value">
                <strong>{{ student?.cgpa || '0.0' }}</strong><span>/ 10.0</span>
              </div>
            </div>
          </div>

          <div class="sp-card sp-edit-card" style="animation: fadeInUp 0.5s ease 0.3s both">
            <h3>✏️ Edit Profile</h3>
            <form (ngSubmit)="saveProfile()" *ngIf="student">
              <div class="sp-form-row">
                <div class="form-group"><label>Full Name</label>
                  <input class="form-control" [(ngModel)]="student.name" name="name">
                </div>
                <div class="form-group"><label>Email</label>
                  <input class="form-control" [value]="student.email" readonly disabled>
                </div>
              </div>
              <div class="sp-form-row">
                <div class="form-group"><label>Phone</label>
                  <input class="form-control" [(ngModel)]="student.phone" name="phone">
                </div>
                <div class="form-group"><label>CGPA</label>
                  <input class="form-control" type="number" step="0.1" min="0" max="10" [(ngModel)]="student.cgpa" name="cgpa">
                </div>
              </div>
              <div class="form-group"><label>Branch</label>
                <input class="form-control" [(ngModel)]="student.branch" name="branch">
              </div>
              <div class="form-group"><label>Skills (comma separated)</label>
                <input class="form-control" [(ngModel)]="student.skills" name="skills" placeholder="Angular, Java, Python">
              </div>
              <button type="submit" class="sp-save-btn" [disabled]="isSaving">
                {{ isSaving ? '⏳ Saving...' : '💾 Save Changes' }}
              </button>
            </form>
          </div>

          <div class="sp-card" style="animation: fadeInUp 0.5s ease 0.35s both">
            <h3>📄 Resume</h3>
            <div class="sp-resume-zone" (click)="triggerUpload()" [class.uploading]="isUploading">
              <div class="sp-rz-icon">{{ isUploading ? '⏳' : (fileName ? '✅' : '📤') }}</div>
              <div class="sp-rz-text">
                <strong>{{ fileName || 'Click to upload resume' }}</strong>
                <span>PDF, DOC — Max 5MB</span>
              </div>
              <div class="sp-rz-bar" *ngIf="isUploading">
                <div class="sp-rz-fill" [style.width]="uploadProgress + '%'"></div>
              </div>
            </div>
            <input type="file" #fileInput (change)="onFileSelect($event)" accept=".pdf,.doc,.docx" style="display:none">
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sp-hero {
      position: relative; padding: 44px 32px 52px; text-align: center;
      background: linear-gradient(135deg, #0F766E 0%, #14B8A6 40%, #3B82F6 100%);
      border-radius: 0 0 var(--radius-xl) var(--radius-xl); overflow: hidden; color: white;
    }
    .sp-hero-pattern {
      position: absolute; inset: 0; opacity: 0.06;
      background-image: radial-gradient(white 1px, transparent 1px);
      background-size: 32px 32px;
    }
    .sp-hero-content { position: relative; z-index: 2; animation: fadeInUp 0.6s ease; }
    .sp-avatar {
      width: 88px; height: 88px; border-radius: 50%;
      background: rgba(255,255,255,0.2); backdrop-filter: blur(10px);
      border: 3px solid rgba(255,255,255,0.4);
      display: flex; align-items: center; justify-content: center;
      font-size: 2.2rem; font-weight: 800; color: white; margin: 0 auto 14px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    }
    .sp-hero h1 { font-size: 1.6rem; font-weight: 800; margin-bottom: 4px; }
    .sp-email { font-size: 0.88rem; opacity: 0.7; margin-bottom: 14px; }
    .sp-hero-tags { display: flex; gap: 10px; justify-content: center; }
    .sp-tag {
      padding: 5px 14px; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 600;
      background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2);
    }
    .sp-body { padding: 0 24px 40px; margin-top: -24px; position: relative; z-index: 5; }
    .sp-stats-bar {
      display: flex; gap: 16px; justify-content: center;
      padding: 18px 28px; background: white; border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg); border: 1px solid var(--border-light); margin-bottom: 24px;
    }
    .sp-stat-item { display: flex; align-items: center; gap: 12px; padding: 0 20px; }
    .sp-stat-item:not(:last-child) { border-right: 1px solid var(--border-light); }
    .sp-stat-icon {
      width: 40px; height: 40px; border-radius: var(--radius-md);
      display: flex; align-items: center; justify-content: center; font-size: 1rem;
    }
    .sp-stat-item strong { display: block; font-size: 1.3rem; font-weight: 800; color: var(--text-dark); line-height: 1; }
    .sp-stat-item span { font-size: 0.72rem; color: var(--text-muted); }
    .sp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .sp-card {
      background: white; border-radius: var(--radius-lg); padding: 24px;
      border: 1px solid var(--border-light); box-shadow: var(--shadow-sm);
      transition: all var(--transition-base);
    }
    .sp-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
    .sp-card h3 { font-size: 1rem; font-weight: 700; color: var(--text-dark); margin-bottom: 16px; }
    .sp-skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .sp-skill {
      padding: 5px 14px; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 600;
      background: linear-gradient(135deg, var(--primary-50), var(--accent-50));
      color: var(--primary-darker); border: 1px solid rgba(20,184,166,0.15);
      transition: all 0.2s ease;
    }
    .sp-skill:hover { transform: translateY(-2px); box-shadow: 0 2px 8px rgba(20,184,166,0.15); }
    .sp-cgpa-card { text-align: center; }
    .sp-gauge-wrap { position: relative; display: inline-block; width: 150px; height: 150px; }
    .sp-gauge { width: 100%; height: 100%; }
    .sp-gauge-value {
      position: absolute; inset: 0; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
    }
    .sp-gauge-value strong { font-size: 2rem; font-weight: 800; color: var(--text-dark); line-height: 1; }
    .sp-gauge-value span { font-size: 0.75rem; color: var(--text-muted); }
    .sp-edit-card { grid-column: 1 / -1; }
    .sp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .sp-save-btn {
      width: 100%; padding: 14px; border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white; font-weight: 700; font-size: 0.95rem; border: none; cursor: pointer;
      transition: all var(--transition-base); box-shadow: 0 4px 15px rgba(20,184,166,0.3);
    }
    .sp-save-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(20,184,166,0.4); }
    .sp-save-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .sp-resume-zone {
      display: flex; align-items: center; gap: 16px; padding: 22px; border-radius: var(--radius-md);
      border: 2px dashed var(--border-medium); cursor: pointer; transition: all 0.3s ease;
      position: relative; overflow: hidden; background: var(--bg-secondary);
    }
    .sp-resume-zone:hover { border-color: var(--primary); background: var(--primary-50); }
    .sp-resume-zone.uploading { border-style: solid; border-color: var(--primary); }
    .sp-rz-icon { font-size: 1.8rem; flex-shrink: 0; }
    .sp-rz-text strong { display: block; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 2px; }
    .sp-rz-text span { font-size: 0.75rem; color: var(--text-muted); }
    .sp-rz-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: var(--primary-50); }
    .sp-rz-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent)); transition: width 0.3s ease; }

    @media (max-width: 768px) {
      .sp-grid { grid-template-columns: 1fr; }
      .sp-form-row { grid-template-columns: 1fr; }
      .sp-stats-bar { flex-direction: column; }
      .sp-stat-item:not(:last-child) { border-right: none; border-bottom: 1px solid var(--border-light); padding-bottom: 12px; }
      .sp-edit-card { grid-column: 1; }
    }
  `]
})
export class StudentProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  student: Student | null = null;
  fileName = ''; isUploading = false; uploadProgress = 0; isSaving = false;
  applicationCount = 0; acceptedCount = 0; interviewCount = 0;

  get skillsList(): string[] {
    return this.student?.skills ? this.student.skills.split(',').map(s => s.trim()).filter(s => s) : [];
  }
  get gaugeDash(): string {
    const c = 2 * Math.PI * 52; const pct = (this.student?.cgpa || 0) / 10;
    return `${c * pct} ${c * (1 - pct)}`;
  }
  get statItems() {
    return [
      { icon: '📋', label: 'Applications', value: this.applicationCount, bg: '#EFF6FF' },
      { icon: '✅', label: 'Accepted', value: this.acceptedCount, bg: '#ECFDF5' },
      { icon: '📅', label: 'Interviews', value: this.interviewCount, bg: '#FEF3C7' },
    ];
  }

  constructor(private dataService: MockDataService, private toast: ToastService) {}

  ngOnInit(): void {
    const user = this.dataService.getCurrentUserSync();
    if (user) {
      this.dataService.getStudentById(user.id).subscribe(s => {
        this.student = s || null;
        if (s) this.loadStats(s.id);
      });
    }
  }

  loadStats(studentId: number): void {
    this.dataService.getStudentApplications(studentId).subscribe(apps => {
      this.applicationCount = apps.length;
      this.acceptedCount = apps.filter(a => a.status === 'ACCEPTED').length;
    });
    this.dataService.getAllInterviews().subscribe(ints => {
      this.interviewCount = ints.filter(i => i.studentName === this.student?.name).length;
    });
  }

  triggerUpload(): void { this.fileInput?.nativeElement?.click(); }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name; this.isUploading = true; this.uploadProgress = 0;
      const interval = setInterval(() => {
        this.uploadProgress += 10;
        if (this.uploadProgress >= 100) {
          clearInterval(interval); this.isUploading = false;
          this.toast.success('Resume uploaded successfully!');
        }
      }, 150);
    }
  }

  saveProfile(): void {
    if (!this.student) return;
    this.isSaving = true;
    this.dataService.updateStudent(this.student.id, this.student).subscribe(() => {
      this.isSaving = false;
      if (this.student) this.dataService.updateCachedUser(this.student.name);
      this.toast.success('Profile updated successfully!');
    });
  }
}
