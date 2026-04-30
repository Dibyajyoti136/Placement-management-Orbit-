import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterModule, SidebarComponent, NavbarComponent],
  template: `
    <div class="page-wrapper">
      <app-sidebar></app-sidebar>
      <app-navbar></app-navbar>
      <main class="main-content">
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class DashboardLayoutComponent {}
