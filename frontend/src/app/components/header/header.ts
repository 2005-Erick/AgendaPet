import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { signal } from '@angular/core';
import { UsersService } from '../../services/users-service';
import { RoleEnum, UserResponseDTO } from '../../models/DTO/user-response-DTO';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  usersService = inject(UsersService);
  router = inject(Router);
  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.update((value) => !value);
  }

  logout() {
    this.usersService.logout().subscribe({
      next: () => {
        this.usersService.clearSession();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.usersService.clearSession();
        this.router.navigate(['/login']);
      },
    });
  }

  getDashboardLink(): string {
    const user = this.usersService.currentUser();
    if (!user) return '/login';
    const roles = user.roles || [];
    if (roles.includes(RoleEnum.ADMIN)) return '/admin-dashboard';
    if (roles.includes(RoleEnum.RECEPTIONIST)) return '/dashboard-recepcionist';
    return '/dashboard';
  }
}
