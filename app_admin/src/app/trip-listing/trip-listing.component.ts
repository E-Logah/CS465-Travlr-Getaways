import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Trip } from '../models/trip';
import { trips as mockTrips } from '../data/trips';
import { TripCardComponent } from '../trip-card/trip-card.component';
import { TripDataService } from '../services/trip-data.service';
import { AuthenticationService } from '../services/authentication.service';

// Lists every trip returned by the API as a grid of trip cards
@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [TripCardComponent],
  templateUrl: './trip-listing.component.html',
  styleUrl: './trip-listing.component.css'
})
export class TripListingComponent implements OnInit {
  trips: Trip[] = [];
  message = '';
  usingMockData = false;

  constructor(
    private tripDataService: TripDataService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  ngOnInit(): void {
    this.getTrips();
  }

  addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  onTripDeleted(code: string): void {
    this.trips = this.trips.filter((t) => t.code !== code);
    this.message = `Trip ${code} deleted. There are ${this.trips.length} trips in the database.`;
  }

  private getTrips(): void {
    this.tripDataService.getTrips().subscribe({
      next: (value: Trip[]) => {
        this.trips = value;
        this.usingMockData = false;
        this.message = value.length > 0
          ? `There are ${value.length} trips available.`
          : 'There were no trips retrieved from the database.';
      },
      error: (err) => {
        if (err.status === 404) {
          this.trips = [];
          this.message = 'There were no trips retrieved from the database.';
          return;
        }
        // API unreachable: fall back to the mock data so the UI can still be tested
        console.error('Error loading trips:', err);
        this.trips = mockTrips;
        this.usingMockData = true;
        this.message = 'Could not reach the API at localhost:3000. Showing mock trip data.';
      }
    });
  }
}
