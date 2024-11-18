import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, combineLatest, filter, from, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return combineLatest([authService.isInitialized(), authService.observe()]).pipe(
    // Wait until AuthService is initialized
    filter(([isInitialized, _]) => isInitialized),
    map(([isInitialized, authenticated]) => {
      if (authenticated) {
        return true;
      }
      // Redirect to the sign-in page if not authenticated
      router.navigate(['auth']);
      return false;
    }),
    catchError((e) => {
      // Handle any errors
      router.navigate(['auth']);
      return of(false);
    })
  );
};
