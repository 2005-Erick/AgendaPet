import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../../../services/users-service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AgendarConsultaModalComponent } from '../../../components/modals/agendar-consulta-modal/agendar-consulta-modal';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatDialogModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private usersService = inject(UsersService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  currentUser = this.usersService.currentUser;

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

  deleteMyAccount() {
    const confirmed = confirm('Tem certeza que deseja excluir sua conta?');

    if (!confirmed) {
      return;
    }
  }

  openAgendarConsultaModal() {
    const dialogRef = this.dialog.open(AgendarConsultaModalComponent, {
      width: '500px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // If true, the appointment was created successfully
        alert('Consulta agendada com sucesso!');
        // Ideally we would refresh the appointments list if we were in the appointments page.
      }
    });
  }
}
