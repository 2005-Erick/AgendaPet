import { Component, inject } from '@angular/core';
import { Cards } from '../../components/cards/cards';
import { PetService } from '../../services/pet/pet';
import { ProximosAgendamentosService } from '../../services/proximos-agendamentos/proximos-agendamentos';
import { ProximosAgendamentos } from '../../components/proximos-agendamentos/proximos-agendamentos';

@Component({
  selector: 'app-dashboard',
  imports: [Cards, ProximosAgendamentos],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard {
  private petService = inject(PetService);
  pets = this.petService.pets();

  private proximosAgendamentosService = inject(ProximosAgendamentosService);
  agendamentos = this.proximosAgendamentosService.proximosAgendamentos()
}
