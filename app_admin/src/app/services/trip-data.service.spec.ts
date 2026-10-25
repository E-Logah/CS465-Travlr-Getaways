import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TripDataService } from './trip-data.service';
import { trips } from '../data/trips';

// Verifies each service method sends the right HTTP request, using mock data
describe('TripDataService', () => {
  let service: TripDataService;
  let http: HttpTestingController;
  const url = 'http://localhost:3000/api/trips';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TripDataService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('GET returns the list of trips', () => {
    service.getTrips().subscribe((result) => expect(result.length).toBe(3));
    const req = http.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(trips);
  });

  it('POST sends a new trip', () => {
    service.addTrip(trips[1]).subscribe();
    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(trips[1]);
  });

  it('PUT updates a trip by code', () => {
    service.updateTrip(trips[2]).subscribe();
    const req = http.expectOne(`${url}/CLAR210621`);
    expect(req.request.method).toBe('PUT');
    req.flush(trips[2]);
  });

  it('DELETE removes a trip by code', () => {
    service.deleteTrip('GALR210214').subscribe();
    const req = http.expectOne(`${url}/GALR210214`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
