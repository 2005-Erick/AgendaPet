import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PetsService } from '../../../../../services/pets-service';
import { UsersService } from '../../../../../services/users-service';
import { CardsPet } from '../../../../../components/cards-pet/cards-pet';
import { HistoricoAnimal } from '../../../../../components/historico-animal/historico-animal';
import { ProximosAgendamentos } from '../../../../../components/proximos-agendamentos/proximos-agendamentos';
import { AppointmentsService } from '../../../../../services/appointments-service';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AgendarConsultaModalComponent } from '../../../../../components/modals/agendar-consulta-modal/agendar-consulta-modal';

@Component({
  selector: 'app-dashboard-page',
  imports: [CardsPet, HistoricoAnimal, ProximosAgendamentos, DatePipe, UpperCasePipe, MatDialogModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
  providers: [DatePipe]
})
export class DashboardPage {
  private usersService = inject(UsersService);
  private petsService = inject(PetsService);
  pets = toSignal(this.petsService.getPetsResponseDTO(), { initialValue: [] });

  get userName() {
    return this.usersService.currentUser()?.name || 'Usuário';
  }

  private appointmentsService = inject(AppointmentsService);
  agendamentos = toSignal(this.appointmentsService.getAppointmentsResponseDTO(), { initialValue: [] });
  
  proximosAgendamentosCount = computed(() => this.agendamentos().filter(a => a.status === 'SCHEDULED').length);

  private dialog = inject(MatDialog);
  
  openAgendarConsultaModal() {
    const dialogRef = this.dialog.open(AgendarConsultaModalComponent, {
      width: '500px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alert('Consulta agendada com sucesso! Atualize a página para ver.');
      }
    });
  }
}
