import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthenticationService } from './authentication.service';
import { BROWSER_STORAGE } from '../storage';

// Builds a mock (unsigned) JWT with the given payload, for testing only
function mockToken(payload: object): string {
  const encode = (obj: object) => btoa(JSON.stringify(obj)).replace(/=+$/, '');
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.mock-signature`;
}

// Tests the authentication logic with mock tokens and mock storage
describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let http: HttpTestingController;
  let store: { [key: string]: string };

  beforeEach(() => {
    store = {};
    const mockStorage = {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => { store[k] = v; },
      removeItem: (k: string) => { delete store[k]; }
    };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BROWSER_STORAGE, useValue: mockStorage }
      ]
    });
    service = TestBed.inject(AuthenticationService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('is logged out when there is no token', () => {
    expect(service.isLoggedIn()).toBeFalse();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('is logged in with an unexpired token and reads the user from it', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    service.saveToken(mockToken({ email: 'admin@travlr.com', name: 'Admin', exp }));
    expect(service.isLoggedIn()).toBeTrue();
    expect(service.getCurrentUser()?.email).toBe('admin@travlr.com');
  });

  it('is logged out when the token has expired', () => {
    const exp = Math.floor(Date.now() / 1000) - 60;
    service.saveToken(mockToken({ email: 'admin@travlr.com', name: 'Admin', exp }));
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('login() posts credentials and saves the returned token', () => {
    const token = mockToken({ email: 'a@b.com', name: 'A', exp: Math.floor(Date.now() / 1000) + 3600 });
    service.login('a@b.com', 'secret').subscribe();
    const req = http.expectOne('http://localhost:3000/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'a@b.com', password: 'secret' });
    req.flush({ token });
    expect(service.getToken()).toBe(token);
  });

  it('logout() removes the token', () => {
    service.saveToken('abc');
    service.logout();
    expect(service.getToken()).toBe('');
  });
});
