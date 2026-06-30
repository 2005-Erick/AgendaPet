import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UsersService } from './users-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const usersService = inject(UsersService);
  let authReq = req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const isLogoutRequest = req.url.includes('/auth/logout');

      if (!isLogoutRequest && (error.status === 401 || error.status === 403)) {
        usersService.logout().subscribe({
          next: () => usersService.clearSession(),
          error: () => usersService.clearSession(),
        });

        const url = router.url;
        // Don't redirect to login if we are already on public pages or during initial load (url === '')
        const isPublicPage =
          url.startsWith('/login') ||
          url.startsWith('/cadastro') ||
          url === '/' ||
          url === '' ||
          url.startsWith('/?') ||
          url.startsWith('/preco');
        usersService.clearSession();
        if (!isPublicPage) {
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    }),
  );
};
