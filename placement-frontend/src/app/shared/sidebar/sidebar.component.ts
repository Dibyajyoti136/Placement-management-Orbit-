import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed">
      <!-- Logo -->
      <div class="sidebar-logo">
        <div class="logo-icon">O</div>
        <span class="logo-text" *ngIf="!isCollapsed">ORBIT</span>
      </div>

      <!-- Menu -->
      <nav class="sidebar-nav">
        <a *ngFor="let item of menuItems; let i = index"
           [routerLink]="item.route"
           routerLinkActive="active"
           [routerLinkActiveOptions]="{exact: item.route.split('/').length <= 2}"
           class="nav-item"
           [style.animation-delay]="(i * 60) + 'ms'">
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label" *ngIf="!isCollapsed">{{ item.label }}</span>
          <span class="active-indicator"></span>
        </a>
      </nav>

      <!-- Collapse Toggle -->
      <button class="collapse-btn" (click)="toggleCollapse()">
        <span>{{ isCollapsed ? '▶' : '◀' }}</span>
      </button>

      <!-- User Info -->
      <div class="sidebar-footer" *ngIf="!isCollapsed">
        <div class="user-avatar">{{ getUserInitial() }}</div>
        <div class="user-info">
          <span class="user-name">{{ authService.currentUser?.name }}</span>
          <span class="user-role">{{ authService.currentUser?.role }}</span>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed; left: 0; top: 0; bottom: 0;
      width: var(--sidebar-width);
      background: var(--bg-sidebar); backdrop-filter: blur(16px);
      border-right: 1px solid var(--border-light);
      z-index: 100; display: flex; flex-direction: column;
      transition: width var(--transition-base);
      overflow: hidden;
      animation: slideInLeft 0.4s ease;
    }
    .sidebar.collapsed { width: var(--sidebar-collapsed); }

    .sidebar-logo {
      display: flex; align-items: center; gap: 12px;
      padding: 20px; border-bottom: 1px solid var(--border-light);
    }
    .logo-icon {
      width: 40px; height: 40px; border-radius: 12px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem; font-weight: 900; flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(20,184,166,0.3);
    }
    .logo-text {
      font-size: 1.3rem; font-weight: 800; color: var(--text-dark);
      letter-spacing: 0.15em;
    }

    .sidebar-nav { flex: 1; padding: 12px 10px; overflow-y: auto; }
    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 14px; border-radius: var(--radius-md);
      color: var(--text-secondary); font-weight: 500; font-size: 0.88rem;
      transition: all var(--transition-base);
      margin-bottom: 3px; position: relative;
      animation: slideInLeft 0.4s ease both;
    }
    .nav-item:hover {
      background: var(--bg-sidebar-hover); color: var(--primary-dark);
      transform: translateX(4px);
    }
    .nav-item.active {
      background: linear-gradient(135deg, var(--primary-50), var(--accent-50));
      color: var(--primary-darker); font-weight: 600;
    }
    .active-indicator {
      position: absolute; right: 0; top: 50%; transform: translateY(-50%);
      width: 4px; height: 0; border-radius: 4px;
      background: linear-gradient(180deg, var(--primary), var(--accent));
      transition: height var(--transition-base);
    }
    .nav-item.active .active-indicator { height: 24px; }
    .nav-icon { font-size: 1.1rem; width: 28px; text-align: center; flex-shrink: 0; }

    .collapse-btn {
      margin: 8px 10px; padding: 10px; border-radius: var(--radius-md);
      background: var(--bg-secondary); color: var(--text-secondary);
      text-align: center; transition: all var(--transition-base);
    }
    .collapse-btn:hover { background: var(--primary-50); color: var(--primary-dark); }

    .sidebar-footer {
      padding: 16px; border-top: 1px solid var(--border-light);
      display: flex; align-items: center; gap: 12px;
    }
    .user-avatar {
      width: 36px; height: 36px; border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.85rem; flex-shrink: 0;
    }
    .user-info { display: flex; flex-direction: column; overflow: hidden; }
    .user-name {
      font-size: 0.85rem; color: var(--text-dark); white-space: nowrap;
      overflow: hidden; text-overflow: ellipsis; font-weight: 700; line-height: 1.2;
    }
    .user-role {
      font-size: 0.68rem; color: var(--text-muted); font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.06em;
    }

    @media (max-width: 768px) {
      .sidebar { width: var(--sidebar-collapsed); }
      .sidebar.collapsed { width: 0; padding: 0; }
      .nav-label, .logo-text, .sidebar-footer, .collapse-btn { display: none; }
    }
  `]
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  menuItems: MenuItem[] = [];

  constructor(public authService: AuthService) {}

  ngOnInit(): void { this.setMenuItems(); }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    document.documentElement.style.setProperty(
      '--sidebar-width',
      this.isCollapsed ? 'var(--sidebar-collapsed)' : '260px'
    );
  }

  getUserInitial(): string {
    const name = this.authService.currentUser?.name;
    if (name) return name.charAt(0).toUpperCase();
    return this.authService.currentUser?.email?.charAt(0).toUpperCase() || 'U';
  }

  private setMenuItems(): void {
    const role = this.authService.userRole;
    switch (role) {
      case 'STUDENT':
        this.menuItems = [
          { icon: '🏠', label: 'Dashboard', route: '/student' },
          { icon: '🔍', label: 'Search Jobs', route: '/student/jobs' },
          { icon: '📋', label: 'My Applications', route: '/student/applications' },
          { icon: '�', label: 'My Interviews', route: '/student/interviews' },
          { icon: '�👤', label: 'My Profile', route: '/student/profile' },
        ];
        break;
      case 'RECRUITER':
        this.menuItems = [
          { icon: '🏠', label: 'Dashboard', route: '/recruiter' },
          { icon: '📝', label: 'Manage Jobs', route: '/recruiter/jobs' },
          { icon: '👥', label: 'Applicants', route: '/recruiter/applicants' },
          { icon: '🔍', label: 'Search Students', route: '/recruiter/search' },
          { icon: '👤', label: 'My Profile', route: '/recruiter/profile' },
        ];
        break;
      case 'ADMIN':
        this.menuItems = [
          { icon: '🏠', label: 'Dashboard', route: '/admin' },
          { icon: '✅', label: 'Verify Recruiters', route: '/admin/verify' },
          { icon: '👨‍🎓', label: 'Students', route: '/admin/students' },
          { icon: '🏢', label: 'Recruiters', route: '/admin/recruiters' },
          { icon: '💼', label: 'Jobs', route: '/admin/jobs' },
          { icon: '📄', label: 'Applications', route: '/admin/applications' },
          { icon: '📅', label: 'Interviews', route: '/admin/interviews' },
        ];
        break;
    }
  }
}
