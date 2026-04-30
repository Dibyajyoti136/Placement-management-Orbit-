import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../core/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of (toastService.toasts$ | async)" class="toast-item" [ngClass]="'toast-' + toast.type">
        <span class="toast-icon">
          {{ toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : toast.type === 'warning' ? '⚠️' : 'ℹ️' }}
        </span>
        <span class="toast-msg">{{ toast.message }}</span>
        <button class="toast-close" (click)="toastService.remove(toast.id)">✕</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .toast-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 18px;
      border-radius: var(--radius-md);
      background: white;
      box-shadow: var(--shadow-lg);
      min-width: 300px;
      max-width: 420px;
      animation: slideInRight 0.3s ease, fadeIn 0.3s ease;
      border-left: 4px solid;
    }
    .toast-success { border-color: var(--success); }
    .toast-error { border-color: var(--error); }
    .toast-warning { border-color: var(--warning); }
    .toast-info { border-color: var(--info); }
    .toast-icon { font-size: 1rem; flex-shrink: 0; }
    .toast-msg { flex: 1; font-size: 0.85rem; color: var(--text-primary); }
    .toast-close {
      background: transparent;
      color: var(--text-muted);
      font-size: 0.85rem;
      padding: 4px;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }
    .toast-close:hover { background: var(--primary-50); color: var(--text-primary); }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
