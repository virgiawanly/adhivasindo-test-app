import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, combineLatest, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return combineLatest([authService.isInitialized(), authService.observe()]).pipe(
    switchMap(([isInitialized, authenticated]) => {
      if (!isInitialized) {
        // If initialization is not complete, wait until it is
        router.navigate(['/']);
        return of(false);
      }

      if (authenticated) {
        // If the user is authenticated, redirect to the home page
        router.navigate(['/']);
        return of(false); // Prevent the access
      }

      // Allow access if not authenticated
      return of(true);
    }),
    catchError((e) => {
      // Handle any errors and redirect to the sign-in page
      router.navigate(['/']);
      return of(false);
    })
  );
};
