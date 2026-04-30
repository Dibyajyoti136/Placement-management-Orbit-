import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-bg">
        <div class="bg-orb orb-1"></div>
        <div class="bg-orb orb-2"></div>
        <div class="bg-grid"></div>
      </div>
      <div class="register-container">
        <div class="register-header">
          <div class="brand-logo">O</div>
          <h1>Create Account</h1>
          <p>Join the ORBIT Placement Platform</p>
        </div>

        <div class="role-selector">
          <button *ngFor="let r of roles" class="role-btn" [class.active]="selectedRole === r.value"
                  (click)="selectedRole = r.value">
            <span class="role-icon">{{ r.icon }}</span>
            <span class="role-name">{{ r.label }}</span>
          </button>
        </div>

        <form (ngSubmit)="onRegister()" class="register-form">
          <div class="form-row">
            <div class="form-group">
              <label>Full Name</label>
              <input class="form-control" [(ngModel)]="formData.name" name="name" placeholder="Your name" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input class="form-control" type="email" [(ngModel)]="formData.email" name="email" placeholder="you@email.com" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Password</label>
              <input class="form-control" type="password" [(ngModel)]="formData.password" name="password" placeholder="Create password" required>
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input class="form-control" [(ngModel)]="formData.phone" name="phone" placeholder="Phone number">
            </div>
          </div>

          <!-- Student Fields -->
          <div *ngIf="selectedRole === 'STUDENT'" class="role-fields" style="animation: fadeInUp 0.3s ease">
            <div class="form-row">
              <div class="form-group">
                <label>Branch</label>
                <select class="form-control" [(ngModel)]="formData.branch" name="branch">
                  <option value="">Select Branch</option>
                  <option>Computer Science</option>
                  <option>IT</option>
                  <option>ECE</option>
                  <option>Mechanical</option>
                  <option>Civil</option>
                </select>
              </div>
              <div class="form-group">
                <label>CGPA</label>
                <input class="form-control" type="number" step="0.1" min="0" max="10"
                       [(ngModel)]="formData.cgpa" name="cgpa" placeholder="e.g. 8.5">
              </div>
            </div>
          </div>

          <!-- Recruiter Fields -->
          <div *ngIf="selectedRole === 'RECRUITER'" class="role-fields" style="animation: fadeInUp 0.3s ease">
            <div class="form-row">
              <div class="form-group">
                <label>Company Name</label>
                <input class="form-control" [(ngModel)]="formData.companyName" name="companyName" placeholder="Company name" required>
              </div>
              <div class="form-group">
                <label>Designation</label>
                <input class="form-control" [(ngModel)]="formData.designation" name="designation" placeholder="Your role">
              </div>
            </div>
            <div class="pending-notice">
              <span>⏳</span>
              <p>Recruiter accounts require admin approval before gaining full access.</p>
            </div>
          </div>

          <button type="submit" class="register-btn" [class.loading]="isLoading" [disabled]="isLoading">
            <span *ngIf="!isLoading">Create Account →</span>
            <span *ngIf="isLoading" class="btn-spinner"></span>
          </button>
        </form>

        <p class="login-link" (click)="goToLogin()">Already have an account? <strong>Sign In</strong></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: #F0F9FF; position: relative; overflow: hidden;
    }
    .auth-bg { position: absolute; inset: 0; }
    .bg-grid {
      position: absolute; inset: 0; opacity: 0.03;
      background-image: radial-gradient(circle, #0F172A 1px, transparent 1px);
      background-size: 32px 32px;
    }
    .bg-orb { position: absolute; border-radius: 50%; filter: blur(80px); }
    .orb-1 {
      width: 450px; height: 450px;
      background: linear-gradient(135deg, rgba(20,184,166,0.2), rgba(59,130,246,0.15));
      top: -120px; left: -100px; animation: float 22s ease-in-out infinite;
    }
    .orb-2 {
      width: 350px; height: 350px;
      background: linear-gradient(135deg, rgba(59,130,246,0.18), rgba(139,92,246,0.08));
      bottom: -100px; right: -80px; animation: float 18s ease-in-out infinite reverse;
    }

    .register-container {
      position: relative;
      background: rgba(255,255,255,0.85); backdrop-filter: blur(20px);
      border-radius: var(--radius-xl); box-shadow: var(--shadow-xl);
      border: 1px solid rgba(255,255,255,0.5);
      padding: 40px 48px; width: 92%; max-width: 620px;
      animation: scaleIn 0.5s ease;
    }

    .register-header { text-align: center; margin-bottom: 24px; }
    .brand-logo {
      width: 56px; height: 56px; border-radius: 14px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 1.8rem; font-weight: 900; margin: 0 auto 14px;
      box-shadow: 0 6px 20px rgba(20,184,166,0.3);
    }
    .register-header h1 {
      font-size: 1.5rem; font-weight: 800; color: var(--text-dark);
    }
    .register-header p { color: var(--text-secondary); font-size: 0.9rem; }

    .role-selector {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 24px;
    }
    .role-btn {
      display: flex; align-items: center; gap: 10px; padding: 14px 16px;
      border-radius: var(--radius-md); background: var(--bg-secondary);
      border: 2px solid transparent; transition: all var(--transition-spring);
    }
    .role-btn:hover { border-color: var(--border-medium); transform: translateY(-2px); }
    .role-btn.active {
      border-color: var(--primary); background: var(--primary-50);
      box-shadow: 0 4px 12px rgba(20,184,166,0.15);
    }
    .role-icon { font-size: 1.3rem; }
    .role-name { font-weight: 600; font-size: 0.9rem; color: var(--text-primary); }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

    .pending-notice {
      display: flex; align-items: center; gap: 10px;
      background: var(--warning-light); border-radius: var(--radius-md);
      padding: 12px 16px; margin-top: 12px;
    }
    .pending-notice span { font-size: 1.2rem; }
    .pending-notice p { font-size: 0.8rem; color: #92400E; margin: 0; }

    .register-btn {
      width: 100%; padding: 14px 32px; border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white; font-weight: 700; font-size: 1rem;
      border: none; cursor: pointer; transition: all var(--transition-base);
      box-shadow: 0 4px 20px rgba(20,184,166,0.3);
      margin-top: 20px; height: 50px;
      display: flex; align-items: center; justify-content: center;
    }
    .register-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(20,184,166,0.4); }
    .register-btn.loading { opacity: 0.8; }
    .btn-spinner {
      width: 22px; height: 22px;
      border: 2.5px solid rgba(255,255,255,0.3); border-top-color: white;
      border-radius: 50%; animation: spin 0.7s linear infinite;
    }

    .login-link {
      text-align: center; margin-top: 20px;
      font-size: 0.85rem; color: var(--text-secondary); cursor: pointer;
    }
    .login-link strong { color: var(--primary-dark); }
    .login-link:hover strong { text-decoration: underline; }

    @media (max-width: 600px) {
      .register-container { padding: 28px 20px; }
      .form-row { grid-template-columns: 1fr; }
      .role-selector { grid-template-columns: 1fr; }
    }
  `]
})
export class RegisterComponent {
  selectedRole = 'STUDENT';
  isLoading = false;
  roles = [
    { value: 'STUDENT', label: 'Student', icon: '👨‍🎓' },
    { value: 'RECRUITER', label: 'Recruiter', icon: '🏢' },
  ];
  formData: any = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  onRegister(): void {
    if (!this.formData.name || !this.formData.email || !this.formData.password) {
      this.toast.warning('Please fill in required fields');
      return;
    }
    this.isLoading = true;
    this.authService.register({ ...this.formData, role: this.selectedRole }).subscribe(() => {
      this.authService.login({ email: this.formData.email, password: this.formData.password }).subscribe(() => {
        this.isLoading = false;
        this.toast.success('Account created! Welcome to ORBIT.');
        setTimeout(() => {
          if (this.selectedRole === 'RECRUITER') {
            this.toast.info('Note: Recruiter accounts require admin approval.');
          }
          this.router.navigate([this.selectedRole === 'STUDENT' ? '/student' : '/recruiter']);
        }, 800);
      });
    }, err => {
      this.isLoading = false;
      this.toast.error(err.error?.message || 'Registration failed. Please check your details.');
    });
  }

  goToLogin(): void { this.router.navigate(['/login']); }
}
