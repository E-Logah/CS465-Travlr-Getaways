import { InjectionToken } from '@angular/core';

// Injectable wrapper around the browser's localStorage, so it can be
// replaced with mock storage in unit tests
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});
