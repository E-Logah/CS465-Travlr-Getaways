import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthenticationService } from '../services/authentication.service';

// Adds "Authorization: Bearer <token>" to every API call except login/register
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthenticationService);
  const isAuthCall = req.url.includes('/login') || req.url.includes('/register');

  if (auth.isLoggedIn() && !isAuthCall) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${auth.getToken()}` }
    });
    return next(authReq);
  }
  return next(req);
};
