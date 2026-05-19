import { Component, inject } from '@angular/core';
import { Cards } from '../../components/cards/cards';
import { PetService } from '../../services/pet/pet';
import { ProximosAgendamentosService } from '../../services/proximos-agendamentos/proximos-agendamentos';
import { ProximosAgendamentos } from '../../components/proximos-agendamentos/proximos-agendamentos';
import { HistoricoAnimalService } from '../../services/historico-animal/historico-animal';
import { HistoricoAnimal } from '../../components/historico-animal/historico-animal';

@Component({
  selector: 'app-dashboard',
  imports: [Cards, ProximosAgendamentos, HistoricoAnimal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard {
  private petService = inject(PetService);
  pets = this.petService.pets();

  private proximosAgendamentosService = inject(ProximosAgendamentosService);
  agendamentos = this.proximosAgendamentosService.proximosAgendamentos()

  private historicoAnimalService = inject(HistoricoAnimalService);
  historicos = this.historicoAnimalService.historicoAnimal();
}
