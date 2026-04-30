import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/mock-data.service';
import { Student } from '../../models/user.model';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-search-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-page">
      <div class="page-header">
        <h1>🔍 Search Students</h1>
        <p>Find the best candidates for your openings</p>
      </div>

      <!-- Filters -->
      <div class="card filter-panel" style="animation: fadeInUp 0.4s ease">
        <div class="card-body">
          <div class="filters-grid">
            <div class="filter-item">
              <label>Student Name</label>
              <input class="form-control" [(ngModel)]="nameQuery" (ngModelChange)="onSearch()" placeholder="Search by name...">
            </div>
            <div class="filter-item">
              <label>Min CGPA</label>
              <input class="form-control" type="number" step="0.1" min="0" max="10" [(ngModel)]="cgpaQuery" (ngModelChange)="onSearch()" placeholder="e.g. 7.0">
            </div>
            <div class="filter-item">
              <label>Skills</label>
              <input class="form-control" [(ngModel)]="skillsQuery" (ngModelChange)="onSearch()" placeholder="e.g. Java, Angular">
            </div>
          </div>
        </div>
      </div>

      <div class="results-bar" style="animation: fadeInUp 0.4s ease 0.1s both">
        <span>{{ filteredStudents.length }} students found</span>
      </div>

      <!-- Student Cards -->
      <div class="students-grid">
        <div class="student-card card" *ngFor="let student of filteredStudents; let i = index" [style.animation-delay]="(i * 80) + 'ms'" style="animation: fadeInUp 0.4s ease both">
          <div class="card-body">
            <div class="student-header">
              <div class="student-avatar">{{ student.name.charAt(0) }}</div>
              <div>
                <h3 [innerHTML]="highlightMatch(student.name, nameQuery)"></h3>
                <span class="student-branch">{{ student.branch }}</span>
              </div>
              <div class="cgpa-badge">
                <strong>{{ student.cgpa }}</strong>
                <span>CGPA</span>
              </div>
            </div>
            <div class="student-skills">
              <span class="skill-tag" *ngFor="let skill of student.skills.split(', ')" [class.matched]="isSkillMatched(skill)" [innerHTML]="highlightMatch(skill, skillsQuery)"></span>
            </div>
            <div class="student-footer">
              <span class="student-email">📧 {{ student.email }}</span>
              <a href="javascript:void(0)" class="btn btn-sm btn-secondary">📄 Resume</a>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="filteredStudents.length === 0">
        <div class="empty-icon">🔍</div>
        <h3>No students found</h3>
        <p>Try different search criteria</p>
      </div>
    </div>
  `,
  styles: [`
    .filters-grid {
      display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;
    }
    .filter-item label {
      display: block; font-weight: 600; font-size: 0.8rem;
      color: var(--text-primary); margin-bottom: 6px;
      text-transform: uppercase; letter-spacing: 0.04em;
    }
    .results-bar {
      margin-bottom: 16px; font-size: 0.9rem;
      color: var(--text-secondary); font-weight: 500;
    }
    .students-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 16px;
    }
    .student-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); }
    .student-header {
      display: flex; align-items: center; gap: 12px; margin-bottom: 14px;
    }
    .student-avatar {
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 1.1rem; flex-shrink: 0;
    }
    .student-header h3 { font-size: 1rem; font-weight: 700; color: var(--text-dark); margin: 0; }
    .student-branch { font-size: 0.82rem; color: var(--text-secondary); }
    .cgpa-badge {
      margin-left: auto; text-align: center;
      padding: 6px 14px; border-radius: var(--radius-md);
      background: var(--primary-50);
    }
    .cgpa-badge strong { display: block; font-size: 1.2rem; color: var(--primary-dark); }
    .cgpa-badge span { font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; }

    .student-skills {
      display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px;
    }
    .skill-tag {
      padding: 3px 10px; border-radius: var(--radius-full);
      background: var(--bg-secondary); font-size: 0.75rem;
      color: var(--text-secondary); border: 1px solid var(--border-light);
      transition: all var(--transition-fast);
    }
    .skill-tag.matched {
      background: var(--primary-50); color: var(--primary-dark);
      border-color: var(--primary); font-weight: 600;
    }

    .student-footer {
      display: flex; align-items: center; justify-content: space-between;
      padding-top: 12px; border-top: 1px solid var(--border-light);
    }
    .student-email { font-size: 0.8rem; color: var(--text-muted); }

    :host ::ng-deep .highlight {
      background: rgba(78, 205, 196, 0.25);
      padding: 0 2px;
      border-radius: 2px;
      font-weight: 700;
    }

    @media (max-width: 768px) {
      .filters-grid { grid-template-columns: 1fr; }
      .students-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class SearchStudentsComponent implements OnInit {
  nameQuery = '';
  cgpaQuery: number | null = null;
  skillsQuery = '';
  filteredStudents: Student[] = [];
  private searchSubject = new Subject<void>();

  constructor(private dataService: MockDataService) {}

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(250)).subscribe(() => this.doSearch());
    this.doSearch();
  }

  onSearch(): void { this.searchSubject.next(); }

  doSearch(): void {
    this.dataService.searchStudents(this.nameQuery || undefined, this.cgpaQuery || undefined, this.skillsQuery || undefined)
      .subscribe(students => this.filteredStudents = students);
  }

  highlightMatch(text: string, query: string): string {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  isSkillMatched(skill: string): boolean {
    return !!this.skillsQuery && skill.toLowerCase().includes(this.skillsQuery.toLowerCase());
  }
}
