import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../../services/users-service';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private usersService = inject(UsersService);
  private router = inject(Router);
  currentUser = this.usersService.currentUser;

  logout() {
    this.usersService.logout();
    this.router.navigate(['/login']);
  }
}
