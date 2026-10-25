import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TripCardComponent } from './trip-card.component';
import { trips } from '../data/trips';
import { AuthenticationService } from '../services/authentication.service';

// Tests the trip card using mock data instead of the live API
describe('TripCardComponent', () => {
  let fixture: ComponentFixture<TripCardComponent>;
  let component: TripCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripCardComponent],
      providers: [
        provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
        // Mock a logged-in administrator so the Edit/Delete buttons render
        { provide: AuthenticationService, useValue: { isLoggedIn: () => true } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TripCardComponent);
    component = fixture.componentInstance;
    component.trip = trips[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the mock trip name, code, and resort', () => {
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Gale Reef');
    expect(text).toContain('GALR210214');
    expect(text).toContain('Emerald Bay, 3 stars');
  });

  it('should store the trip code when Edit is clicked', () => {
    const editButton: HTMLButtonElement = fixture.nativeElement.querySelector('button.btn-outline-primary');
    editButton.click();
    expect(localStorage.getItem('tripCode')).toBe('GALR210214');
  });
});
