import { Component, inject } from '@angular/core';
import { PetService } from '../../../../services/pet/pet';
import { ProximosAgendamentosService } from '../../../../services/proximos-agendamentos/proximos-agendamentos';
import { HistoricoAnimalService } from '../../../../services/historico-animal/historico-animal';
import { UsersService } from '../../../../services/users-service';
import { CardsPet } from '../../../../components/cards-pet/cards-pet';
import { HistoricoAnimal } from '../../../../components/historico-animal/historico-animal';
import { ProximosAgendamentos } from '../../../../components/proximos-agendamentos/proximos-agendamentos';

@Component({
  selector: 'app-dashboard-page',
  imports: [CardsPet, HistoricoAnimal, ProximosAgendamentos],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  private usersService = inject(UsersService);
  private petService = inject(PetService);
  pets = this.petService.pets();

  private proximosAgendamentosService = inject(ProximosAgendamentosService);
  agendamentos = this.proximosAgendamentosService.proximosAgendamentos();

  private historicoAnimalService = inject(HistoricoAnimalService);
  historicos = this.historicoAnimalService.historicoAnimal();

  get userName() {
    return this.usersService.currentUser()?.name || 'Usuário';
  }
}
