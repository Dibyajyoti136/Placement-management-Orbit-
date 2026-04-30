import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-bg">
        <div class="bg-orb orb-1"></div>
        <div class="bg-orb orb-2"></div>
        <div class="bg-orb orb-3"></div>
        <div class="bg-grid"></div>
      </div>

      <div class="auth-container">
        <div class="auth-left">
          <div class="brand-section">
            <div class="brand-logo">O</div>
            <h1 class="brand-name">ORBIT</h1>
            <p class="brand-tagline">Placement Management System</p>
            <div class="brand-features">
              <div class="feature-item" *ngFor="let f of features; let i = index"
                   [style.animation-delay]="(i * 100 + 300) + 'ms'"
                   style="animation: slideInLeft 0.5s ease both">
                <span class="feature-dot"></span>
                <span>{{ f }}</span>
              </div>
            </div>
            <div class="brand-stats">
              <div class="b-stat"><strong>500+</strong><span>Companies</span></div>
              <div class="b-stat"><strong>10K+</strong><span>Students</span></div>
              <div class="b-stat"><strong>95%</strong><span>Placed</span></div>
            </div>
          </div>
        </div>

        <div class="auth-right">
          <div class="auth-form-container">
            <h2 class="form-title">Welcome back 👋</h2>
            <p class="form-subtitle">Sign in to your ORBIT account</p>

            <form (ngSubmit)="onLogin()" class="auth-form">
              <div class="form-group">
                <label for="email">Email Address</label>
                <div class="input-wrap">
                  <span class="input-icon">📧</span>
                  <input id="email" type="email" class="form-control icon-input"
                         [(ngModel)]="credentials.email" name="email"
                         placeholder="you@example.com" required>
                </div>
              </div>

              <div class="form-group">
                <label for="password">Password</label>
                <div class="input-wrap">
                  <span class="input-icon">🔒</span>
                  <input id="password" type="password" class="form-control icon-input"
                         [(ngModel)]="credentials.password" name="password"
                         placeholder="••••••••" required>
                </div>
              </div>

              <button type="submit" class="login-btn" [class.loading]="isLoading" [disabled]="isLoading">
                <span *ngIf="!isLoading">Sign In →</span>
                <span *ngIf="isLoading" class="btn-spinner"></span>
              </button>
            </form>

            <div class="divider"><span>Quick Access</span></div>

            <div class="quick-login-grid">
              <button class="ql-btn" *ngFor="let q of quickLogins"
                      (click)="quickLogin(q.email)">
                <span class="ql-icon">{{ q.icon }}</span>
                <span class="ql-label">{{ q.label }}</span>
              </button>
            </div>

            <p class="register-link" (click)="goToRegister()">
              Don't have an account? <strong>Create one</strong>
            </p>
          </div>
        </div>
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
      width: 500px; height: 500px;
      background: linear-gradient(135deg, rgba(20,184,166,0.25), rgba(59,130,246,0.15));
      top: -150px; right: -100px; animation: float 20s ease-in-out infinite;
    }
    .orb-2 {
      width: 400px; height: 400px;
      background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.1));
      bottom: -120px; left: -80px; animation: float 25s ease-in-out infinite reverse;
    }
    .orb-3 {
      width: 250px; height: 250px;
      background: rgba(20,184,166,0.12);
      top: 40%; left: 30%; animation: float 18s ease-in-out infinite;
    }

    .auth-container {
      position: relative; display: flex; width: 92%; max-width: 1020px;
      background: rgba(255,255,255,0.85); backdrop-filter: blur(20px);
      border-radius: var(--radius-xl); box-shadow: var(--shadow-xl);
      border: 1px solid rgba(255,255,255,0.5);
      overflow: hidden; animation: scaleIn 0.5s ease;
    }

    /* ── Left Panel ── */
    .auth-left {
      flex: 1; padding: 48px;
      background: linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #0D9488 100%);
      display: flex; align-items: center; justify-content: center;
      position: relative; overflow: hidden;
    }
    .auth-left::before {
      content: ''; position: absolute; inset: 0;
      background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
      background-size: 24px 24px;
    }
    .brand-section { position: relative; text-align: center; color: white; z-index: 2; }
    .brand-logo {
      width: 72px; height: 72px; border-radius: 18px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 2.2rem; font-weight: 900; margin: 0 auto 18px;
      box-shadow: 0 8px 30px rgba(20,184,166,0.4);
      animation: glowPulse 3s ease-in-out infinite;
    }
    .brand-name { font-size: 2.2rem; font-weight: 900; letter-spacing: 0.2em; margin-bottom: 6px; }
    .brand-tagline { opacity: 0.6; font-size: 0.92rem; margin-bottom: 36px; }

    .brand-features { text-align: left; margin-bottom: 36px; }
    .feature-item {
      display: flex; align-items: center; gap: 12px;
      padding: 8px 0; font-size: 0.9rem; opacity: 0.85; font-weight: 500;
    }
    .feature-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--primary); box-shadow: 0 0 8px var(--primary); flex-shrink: 0;
    }

    .brand-stats {
      display: flex; gap: 24px; justify-content: center;
      padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);
    }
    .b-stat { text-align: center; }
    .b-stat strong { display: block; font-size: 1.4rem; font-weight: 800; }
    .b-stat span { font-size: 0.72rem; opacity: 0.5; text-transform: uppercase; letter-spacing: 0.08em; }

    /* ── Right Panel ── */
    .auth-right { flex: 1; padding: 40px 48px; overflow-y: auto; max-height: 90vh; }
    .auth-form-container { max-width: 380px; margin: 0 auto; }
    .form-title {
      font-size: 1.7rem; font-weight: 800; color: var(--text-dark);
      margin-bottom: 4px; letter-spacing: -0.5px;
    }
    .form-subtitle { color: var(--text-secondary); margin-bottom: 28px; font-size: 0.9rem; }
    .auth-form { margin-bottom: 20px; }

    .input-wrap { position: relative; }
    .input-icon {
      position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
      font-size: 0.9rem; z-index: 2;
    }
    .icon-input { padding-left: 42px; }

    .login-btn {
      width: 100%; padding: 14px 32px; border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white; font-weight: 700; font-size: 1rem;
      border: none; cursor: pointer; transition: all var(--transition-base);
      box-shadow: 0 4px 20px rgba(20,184,166,0.3);
      height: 50px; display: flex; align-items: center; justify-content: center;
    }
    .login-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(20,184,166,0.4); }
    .login-btn.loading { opacity: 0.8; }
    .login-btn:disabled { cursor: not-allowed; }
    .btn-spinner {
      width: 22px; height: 22px;
      border: 2.5px solid rgba(255,255,255,0.3); border-top-color: white;
      border-radius: 50%; animation: spin 0.7s linear infinite;
    }

    .divider {
      text-align: center; position: relative; margin: 24px 0;
    }
    .divider::before {
      content: ''; position: absolute; top: 50%; left: 0; right: 0;
      height: 1px; background: var(--border-light);
    }
    .divider span {
      position: relative; background: white; padding: 0 16px;
      font-size: 0.78rem; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;
    }

    .quick-login-grid {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 10px; margin-bottom: 24px;
    }
    .ql-btn {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      padding: 16px 10px; border-radius: var(--radius-md);
      background: var(--bg-secondary); border: 1.5px solid var(--border-light);
      transition: all var(--transition-spring);
    }
    .ql-btn:hover {
      border-color: var(--primary); background: var(--primary-50);
      transform: translateY(-3px); box-shadow: var(--shadow-md);
    }
    .ql-icon { font-size: 1.5rem; }
    .ql-label { font-size: 0.75rem; font-weight: 600; color: var(--text-primary); }

    .register-link {
      text-align: center; font-size: 0.85rem; color: var(--text-secondary); cursor: pointer;
    }
    .register-link strong { color: var(--primary-dark); }
    .register-link:hover strong { text-decoration: underline; }

    @media (max-width: 768px) {
      .auth-container { flex-direction: column; }
      .auth-left { display: none; }
      .auth-right { padding: 32px 24px; }
    }
  `]
})
export class LoginComponent {
  credentials: LoginRequest = { email: '', password: '' };
  isLoading = false;

  features = [
    'Streamlined Placement Process',
    'Smart Job Matching & Analytics',
    'Real-time Interview Scheduling',
    'Seamless Student-Recruiter Connect'
  ];

  quickLogins = [
    { email: 'student@orbit.com', icon: '👨‍🎓', label: 'Student' },
    { email: 'recruiter@orbit.com', icon: '🏢', label: 'Recruiter' },
    { email: 'admin@orbit.com', icon: '🛡️', label: 'Admin' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  onLogin(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.toast.warning('Please fill in all fields');
      return;
    }
    this.isLoading = true;
    this.authService.login(this.credentials).subscribe({
      next: (user) => {
        this.isLoading = false;
        if (user) {
          this.toast.success('Welcome back!');
          this.routeByRole(user.role);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.error(err.error?.message || 'Invalid credentials or backend unavailable.');
      }
    });
  }

  quickLogin(email: string): void {
    this.credentials = { email, password: 'password' };
    this.onLogin();
  }

  goToRegister(): void { this.router.navigate(['/register']); }

  private routeByRole(role: string): void {
    switch (role) {
      case 'STUDENT': this.router.navigate(['/student']); break;
      case 'RECRUITER': this.router.navigate(['/recruiter']); break;
      case 'ADMIN': this.router.navigate(['/admin']); break;
    }
  }
}
