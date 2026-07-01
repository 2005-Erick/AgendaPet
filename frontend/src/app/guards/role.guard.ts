import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users-service';
import { catchError, map, of } from 'rxjs';
import { RoleEnum, UserResponseDTO } from '../models/DTO/user-response-DTO';

export function roleGuard(allowedRoles: RoleEnum[]): CanActivateFn {
  return (route, state) => {
    const usersService = inject(UsersService);
    const router = inject(Router);

    const checkRole = (user: UserResponseDTO) => {
      if (!user || !user.roles) {
        return router.createUrlTree(['/login']);
      }

      // Se a rota acessada for o dashboard comum
      const isDashboardRoute = state.url === '/dashboard' || state.url.startsWith('/dashboard/');
      
      if (isDashboardRoute && allowedRoles.includes(RoleEnum.TUTOR) && allowedRoles.length === 1) {
        if (user.roles.includes(RoleEnum.ADMIN)) {
          return router.createUrlTree(['/admin-dashboard']);
        }
        if (user.roles.includes(RoleEnum.DOCTOR)) {
          return router.createUrlTree(['/dashboard-doctor']);
        }
        if (user.roles.includes(RoleEnum.RECEPTIONIST)) {
          return router.createUrlTree(['/dashboard-recepcionist']);
        }
      }

      // Verifica se o usuário tem a permissão exigida pela rota atual
      const hasRole = user.roles.some((role) => allowedRoles.includes(role));
      if (hasRole) {
        return true;
      }

      // Se o usuário não tem a role da rota, redireciona para a rota correta dele
      if (user.roles.includes(RoleEnum.ADMIN)) {
        return router.createUrlTree(['/admin-dashboard']);
      }
      if (user.roles.includes(RoleEnum.DOCTOR)) {
        return router.createUrlTree(['/dashboard-doctor']);
      }
      if (user.roles.includes(RoleEnum.RECEPTIONIST)) {
        return router.createUrlTree(['/dashboard-recepcionist']);
      }
      if (user.roles.includes(RoleEnum.TUTOR)) {
        return router.createUrlTree(['/dashboard']);
      }

      return router.createUrlTree(['/login']);
    };

    const currentUser = usersService.currentUser();
    
    // Se o usuário já estiver carregado no signal, não faz nova chamada HTTP
    if (currentUser) {
      return checkRole(currentUser);
    }

    // Se o usuário não estiver no signal, busca no backend e atualiza o signal
    return usersService.loadCurrentUser().pipe(
      map((user) => checkRole(user)),
      catchError(() => {
        return of(router.createUrlTree(['/login']));
      })
    );
  };
}
