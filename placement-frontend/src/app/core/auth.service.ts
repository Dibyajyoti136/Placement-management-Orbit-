import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('orbit_user');
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  login(request: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, request).pipe(
      tap(res => {
        if (res) {
          const user: User = {
            id: res.id,
            email: res.email,
            role: res.role,
            name: res.name || res.displayName || res.email.split('@')[0],
            token: res.token
          };
          localStorage.setItem('orbit_user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, request);
  }

  updateUserName(name: string): void {
    const current = this.currentUserSubject.value;
    if (current) {
      const updated = { ...current, name };
      this.currentUserSubject.next(updated);
      localStorage.setItem('orbit_user', JSON.stringify(updated));
    }
  }

  logout(): void {
    localStorage.removeItem('orbit_user');
    this.currentUserSubject.next(null);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  get userRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }
}
