import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';

// Form for editing an existing trip (GET then PUT /api/trips/:tripCode)
@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-trip.component.html',
  styleUrl: './edit-trip.component.css'
})
export class EditTripComponent implements OnInit {
  editForm: FormGroup;
  trip?: Trip;
  submitted = false;
  message = '';
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService
  ) {
    this.editForm = this.formBuilder.group({
      _id: [],
      code: [{ value: '', disabled: true }, Validators.required],
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
    return this.editForm.controls;
  }

  ngOnInit(): void {
    // The trip card stores the selected trip's code before navigating here
    const tripCode = localStorage.getItem('tripCode');
    if (!tripCode) {
      alert('Something went wrong: no trip was selected to edit.');
      this.router.navigate(['']);
      return;
    }

    this.tripDataService.getTrip(tripCode).subscribe({
      next: (value: Trip[]) => {
        this.trip = value[0];
        this.editForm.patchValue({
          ...this.trip,
          start: this.toDateInput(this.trip.start)
        });
        this.message = `Trip ${tripCode} retrieved.`;
      },
      error: (err) => {
        console.error('Error loading trip:', err);
        this.errorMessage = `Trip ${tripCode} could not be loaded.`;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    if (this.editForm.invalid) {
      return;
    }
    // getRawValue() includes the disabled (read-only) code field
    const updated = this.editForm.getRawValue() as Trip;
    this.tripDataService.updateTrip(updated).subscribe({
      next: () => this.router.navigate(['']),
      error: (err) => {
        console.error('Error updating trip:', err);
        this.errorMessage = err.status === 401
          ? 'Your session has expired. Please log in again.'
          : err.error?.error || 'The trip could not be updated. Is the API running?';
      }
    });
  }

  // Convert a stored date to the yyyy-MM-dd format a date input needs
  private toDateInput(value: Date | string): string {
    const d = new Date(value);
    return isNaN(d.getTime()) ? '' : d.toISOString().substring(0, 10);
  }
}
