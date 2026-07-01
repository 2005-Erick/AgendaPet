import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../../../components/header/header';
import { FooterComponent } from '../../../components/footer/footer';
import { RouterLink, Router } from '@angular/router';
import { UsersService } from '../../../services/users-service';
import { RoleEnum } from '../../../models/DTO/user-response-DTO';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  usersService = inject(UsersService);
  router = inject(Router);

  getHeroLink(): string {
    const user = this.usersService.currentUser();
    if (!user) return '/cadastro';
    const roles = user.roles || [];
    if (roles.includes(RoleEnum.ADMIN)) return '/admin-dashboard';
    if (roles.includes(RoleEnum.RECEPTIONIST)) return '/dashboard-recepcionist';
    if (roles.includes(RoleEnum.DOCTOR)) return '/dashboard-doctor';
    return '/dashboard';
  }

  getHeroButtonText(): string {
    return this.usersService.currentUser() ? 'Ir para o Dashboard' : 'Criar Conta';
  }
}
