import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';

// Form for adding a new trip (POST /api/trips)
@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-trip.component.html',
  styleUrl: './add-trip.component.css'
})
export class AddTripComponent {
  addForm: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService
  ) {
    this.addForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  get f() {
    return this.addForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    if (this.addForm.invalid) {
      return;
    }
    this.tripDataService.addTrip(this.addForm.value as Trip).subscribe({
      next: () => this.router.navigate(['']),
      error: (err) => {
        console.error('Error adding trip:', err);
        this.errorMessage = err.status === 401
          ? 'Your session has expired. Please log in again.'
          : err.error?.error || 'The trip could not be added. Is the API running?';
      }
    });
  }
}
