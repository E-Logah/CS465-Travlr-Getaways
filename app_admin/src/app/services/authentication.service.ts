import { Inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripDataService } from './trip-data.service';

// Stores the JWT and answers "is someone logged in?" for the rest of the app
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private tokenKey = 'travlr-token';

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) {}

  getToken(): string {
    return this.storage.getItem(this.tokenKey) || '';
  }

  saveToken(token: string): void {
    this.storage.setItem(this.tokenKey, token);
  }

  logout(): void {
    this.storage.removeItem(this.tokenKey);
  }

  // Log in and save the returned token
  login(email: string, password: string): Observable<AuthResponse> {
    return this.tripDataService.login(email, password)
      .pipe(tap((response) => this.saveToken(response.token)));
  }

  // Register a new administrator and save the returned token
  register(user: User, password: string): Observable<AuthResponse> {
    return this.tripDataService.register(user, password)
      .pipe(tap((response) => this.saveToken(response.token)));
  }

  // Logged in = a token exists and its expiry time is still in the future
  isLoggedIn(): boolean {
    const payload = this.decodePayload();
    return !!payload && payload['exp'] > Date.now() / 1000;
  }

  getCurrentUser(): User | null {
    if (!this.isLoggedIn()) {
      return null;
    }
    const payload = this.decodePayload()!;
    return { email: payload['email'], name: payload['name'] };
  }

  // Read the middle (payload) section of the JWT
  private decodePayload(): { [key: string]: any } | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }
}
