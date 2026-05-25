import { Component, input, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { PetService } from '../../services/pet/pet';
import { AgendamentoService } from '../../services/agendamento';

@Component({
  selector: 'app-pets-detail-modal',
  templateUrl: './pets-detail-modal.html',
  styleUrls: ['./pets-detail-modal.css'],
})
export class PetsDetailModal {
  id = input.required<number>();

  private router = inject(Router);
  private petService = inject(PetService);
  private agendamentoService = inject(AgendamentoService);

  pet = computed(() => this.petService.pets().find(p => p.id === this.id()));
  agendamentos = this.agendamentoService.agendamento();

  fechar() {
    this.router.navigate(['/dashboard/pets-page']);
  }
}
