import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

// Blocks the add/edit pages unless an administrator is logged in
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthenticationService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};
