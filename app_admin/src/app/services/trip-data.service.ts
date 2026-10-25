import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

// Data service that talks to the Express REST API
@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  private apiBaseUrl = 'http://localhost:3000/api/trips';
  private authBaseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // GET /api/trips
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiBaseUrl);
  }

  // GET /api/trips/:tripCode (the API returns an array with one trip)
  getTrip(tripCode: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.apiBaseUrl}/${tripCode}`);
  }

  // POST /api/trips
  addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.apiBaseUrl, formData);
  }

  // PUT /api/trips/:tripCode
  updateTrip(formData: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.apiBaseUrl}/${formData.code}`, formData);
  }

  // DELETE /api/trips/:tripCode
  deleteTrip(tripCode: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/${tripCode}`);
  }

  // POST /api/login
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authBaseUrl}/login`, { email, password });
  }

  // POST /api/register
  register(user: User, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authBaseUrl}/register`, { ...user, password });
  }
}
