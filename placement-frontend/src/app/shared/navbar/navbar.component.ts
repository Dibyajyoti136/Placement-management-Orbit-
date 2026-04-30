import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="navbar">
      <div class="navbar-left">
        <h2 class="navbar-title">{{ getPageTitle() }}</h2>
      </div>
      <div class="navbar-right">
        <div class="navbar-search">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="Search..." class="search-input">
        </div>
        <button class="notification-btn" title="Notifications">
          🔔
          <span class="notification-dot"></span>
        </button>
        <div class="user-dropdown" (click)="toggleDropdown(); $event.stopPropagation()">
          <div class="user-avatar" [title]="authService.currentUser?.name || 'User'">{{ getUserInitial() }}</div>
          <div class="dropdown-menu" *ngIf="showDropdown" (click)="$event.stopPropagation()">
            <div class="dropdown-header">
              <strong>{{ authService.currentUser?.name }}</strong>
              <span class="user-email-text">{{ authService.currentUser?.email }}</span>
              <span class="role-tag">{{ authService.currentUser?.role }}</span>
            </div>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item" (click)="navigateProfile()">👤 Profile</button>
            <button class="dropdown-item logout" (click)="logout()">🚪 Logout</button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      position: fixed; top: 0; right: 0; left: var(--sidebar-width);
      height: var(--navbar-height);
      background: rgba(255,255,255,0.75); backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-light);
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 28px; z-index: 90;
      transition: left var(--transition-base);
      animation: slideDown 0.4s ease;
    }
    .navbar-title {
      font-size: 1.1rem; font-weight: 700; color: var(--text-dark);
    }
    .navbar-right { display: flex; align-items: center; gap: 14px; }

    .navbar-search {
      display: flex; align-items: center;
      background: var(--bg-secondary); border-radius: var(--radius-full);
      padding: 8px 16px; gap: 8px; border: 1.5px solid transparent;
      transition: all var(--transition-base);
    }
    .navbar-search:focus-within {
      border-color: var(--primary); background: white;
      box-shadow: 0 0 0 3px rgba(20,184,166,0.1);
    }
    .search-icon { font-size: 0.85rem; }
    .search-input {
      border: none; background: transparent; outline: none;
      font-size: 0.85rem; color: var(--text-primary); width: 180px;
    }

    .notification-btn {
      position: relative; width: 40px; height: 40px;
      border-radius: var(--radius-full); background: var(--bg-secondary);
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem; transition: all var(--transition-base);
    }
    .notification-btn:hover { background: var(--primary-50); transform: scale(1.05); }
    .notification-dot {
      position: absolute; top: 8px; right: 8px; width: 8px; height: 8px;
      background: var(--error); border-radius: 50%; border: 2px solid white;
      animation: pulse 2s infinite;
    }

    .user-dropdown { position: relative; cursor: pointer; }
    .user-avatar {
      width: 40px; height: 40px; border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.9rem; transition: all var(--transition-base);
    }
    .user-avatar:hover { box-shadow: var(--shadow-glow); transform: scale(1.05); }

    .dropdown-menu {
      position: absolute; top: calc(100% + 8px); right: 0;
      background: white; border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl); border: 1px solid var(--border-light);
      min-width: 220px; padding: 8px;
      animation: modalIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 100;
    }
    .dropdown-header {
      padding: 12px; display: flex; flex-direction: column; gap: 4px;
    }
    .dropdown-header strong { font-size: 0.85rem; color: var(--text-dark); }
    .user-email-text { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px; }
    .role-tag {
      font-size: 0.68rem;
      background: linear-gradient(135deg, var(--primary-50), var(--accent-50));
      color: var(--primary-darker); padding: 2px 10px;
      border-radius: var(--radius-full); width: fit-content;
      text-transform: uppercase; font-weight: 700; letter-spacing: 0.06em;
    }
    .dropdown-divider { height: 1px; background: var(--border-light); margin: 4px 0; }
    .dropdown-item {
      display: flex; align-items: center; gap: 8px; width: 100%;
      padding: 10px 12px; border-radius: var(--radius-md);
      font-size: 0.85rem; color: var(--text-primary);
      background: transparent; transition: all var(--transition-fast); text-align: left;
    }
    .dropdown-item:hover { background: var(--primary-50); }
    .dropdown-item.logout { color: var(--error); }
    .dropdown-item.logout:hover { background: var(--error-light); }

    @media (max-width: 768px) {
      .navbar { left: var(--sidebar-collapsed); padding: 0 16px; }
      .navbar-search { display: none; }
    }
  `]
})
export class NavbarComponent {
  showDropdown = false;

  constructor(public authService: AuthService, private router: Router) {}

  @HostListener('document:click')
  onDocClick(): void { this.showDropdown = false; }

  getPageTitle(): string {
    const role = this.authService.userRole;
    switch (role) {
      case 'STUDENT': return '👨‍🎓 Student Portal';
      case 'RECRUITER': return '🏢 Recruiter Portal';
      case 'ADMIN': return '🛡️ Admin Panel';
      default: return 'ORBIT';
    }
  }

  getUserInitial(): string {
    const name = this.authService.currentUser?.name;
    if (name) return name.charAt(0).toUpperCase();
    return this.authService.currentUser?.email?.charAt(0).toUpperCase() || 'U';
  }

  toggleDropdown(): void { this.showDropdown = !this.showDropdown; }

  navigateProfile(): void {
    this.showDropdown = false;
    const role = this.authService.userRole?.toLowerCase();
    this.router.navigate([`/${role}/profile`]);
  }

  logout(): void {
    this.showDropdown = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
