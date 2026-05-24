import { Component, input, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { PetService } from '../../services/pet/pet';
import { ProximosAgendamentosService } from '../../services/proximos-agendamentos/proximos-agendamentos';
import { HistoricoAnimalService } from '../../services/historico-animal/historico-animal';

@Component({
  selector: 'app-pets-detail-modal',
  templateUrl: './pets-detail-modal.html',
  styleUrls: ['./pets-detail-modal.css'],
})
export class PetsDetailModal {
  id = input.required<number>();

  private router = inject(Router);
  private petService = inject(PetService);
  private proximosAgendamentosService = inject(ProximosAgendamentosService);
  private historicoAnimalService = inject(HistoricoAnimalService);

  pet = computed(() => this.petService.pets().find(p => p.id === this.id()));
  agendamentos = this.proximosAgendamentosService.proximosAgendamentos();
  historicos = this.historicoAnimalService.historicoAnimal();

  fechar() {
    this.router.navigate(['/dashboard/pets-page']);
  }
}
