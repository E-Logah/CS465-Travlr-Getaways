import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';
import { AuthenticationService } from '../services/authentication.service';

// Displays one trip as a Bootstrap card with Edit and Delete actions
@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css'
})
export class TripCardComponent {
  @Input({ required: true }) trip!: Trip;
  @Output() tripDeleted = new EventEmitter<string>();

  constructor(
    private router: Router,
    private tripDataService: TripDataService,
    private authenticationService: AuthenticationService
  ) {}

  // Edit and Delete are only shown to a logged-in administrator
  isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  editTrip(trip: Trip): void {
    localStorage.removeItem('tripCode');
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit-trip']);
  }

  deleteTrip(trip: Trip): void {
    if (!confirm(`Delete the trip "${trip.name}" (${trip.code})?`)) {
      return;
    }
    this.tripDataService.deleteTrip(trip.code).subscribe({
      next: () => this.tripDeleted.emit(trip.code),
      error: (err) => console.error('Error deleting trip:', err)
    });
  }
}
