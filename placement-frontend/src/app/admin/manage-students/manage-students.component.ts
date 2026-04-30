import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/mock-data.service';
import { ToastService } from '../../core/toast.service';
import { Student } from '../../models/user.model';

@Component({
  selector: 'app-manage-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="manage-page">
      <div class="page-header">
        <h1>👨‍🎓 Manage Students</h1>
        <p>View, edit, and manage student accounts</p>
      </div>
      <div class="card" style="animation: fadeInUp 0.4s ease">
        <div class="card-body" style="padding: 0; overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>Skills</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let student of students; let i = index" [style.animation-delay]="(i * 60) + 'ms'" style="animation: fadeInUp 0.3s ease both">
                <td><strong>{{ student.name }}</strong></td>
                <td>{{ student.email }}</td>
                <td>{{ student.branch }}</td>
                <td><strong>{{ student.cgpa }}</strong></td>
                <td><span class="skills-text">{{ student.skills }}</span></td>
                <td>{{ student.phone }}</td>
                <td class="actions">
                  <button class="btn btn-sm btn-secondary" (click)="editStudent(student)">✏️</button>
                  <button class="btn btn-sm btn-danger" (click)="deleteStudent(student.id)">🗑️</button>
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
            <h2>Edit Student</h2>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-group"><label>Name</label><input class="form-control" [(ngModel)]="editForm.name"></div>
            <div class="form-group"><label>Email (Read-only)</label><input class="form-control" [value]="editForm.email" readonly disabled></div>
            <div class="form-group"><label>Branch</label><select class="form-control" [(ngModel)]="editForm.branch">
              <option>Computer Science</option>
              <option>IT</option>
              <option>ECE</option>
              <option>Mechanical</option>
              <option>Civil</option>
            </select></div>
            <div class="form-group"><label>CGPA</label><input class="form-control" type="number" step="0.1" [(ngModel)]="editForm.cgpa"></div>
            <div class="form-group"><label>Skills</label><input class="form-control" [(ngModel)]="editForm.skills"></div>
            <div class="form-group"><label>Phone</label><input class="form-control" [(ngModel)]="editForm.phone"></div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()">Cancel</button>
            <button class="btn btn-primary" (click)="saveStudent()">Save</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .skills-text { font-size: 0.82rem; color: var(--text-secondary); }
    .actions { display: flex; gap: 6px; }
  `]
})
export class ManageStudentsComponent implements OnInit {
  students: Student[] = [];
  showModal = false;
  editForm: Partial<Student> = {};
  editingId = 0;

  constructor(private dataService: MockDataService, private toast: ToastService) {}

  ngOnInit(): void { this.load(); }

  load(): void { this.dataService.getStudents().subscribe(s => this.students = s); }

  editStudent(s: Student): void {
    this.editingId = s.id;
    this.editForm = { ...s };
    this.showModal = true;
  }

  closeModal(): void { this.showModal = false; }

  saveStudent(): void {
    this.dataService.updateStudent(this.editingId, this.editForm).subscribe(() => {
      this.toast.success('Student updated');
      this.load();
      this.closeModal();
    });
  }

  deleteStudent(id: number): void {
    this.dataService.deleteStudent(id).subscribe(() => {
      this.toast.success('Student deleted');
      this.load();
    });
  }
}
