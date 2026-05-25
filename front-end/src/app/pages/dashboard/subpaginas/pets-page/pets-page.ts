import { Component, inject, signal, computed } from '@angular/core';
import { PetService } from '../../../../services/pet/pet';
import { AgendamentoService } from '../../../../services/agendamento';
import { ActivatedRoute, Router } from '@angular/router';
import {PetsDetailModal} from '../../../../components/pets-detail-modal/pets-detail-modal';

@Component({
  selector: 'app-pets-page',
  imports: [PetsDetailModal],
  templateUrl: './pets-page.html',
  styleUrls: ['./pets-page.css'],
})
export class PetsPage {

  private petService = inject(PetService);
  private agendamentoService = inject(AgendamentoService);

  pets = this.petService.pets;
  agendamentos = this.agendamentoService.agendamento;

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  petSelecionado = signal<number | null>(null);

  petsComAgendamento = computed(() =>
    this.pets().map(pet => ({
      ...pet,
      agendamento: this.agendamentos().find(a => a.petId === pet.id) ?? null
    }))
  );

  abrirPet(id: number) {
    this.router.navigate(['/dashboard/pets-page/pet', id]);
  }

  constructor() {
    this.route.params.subscribe(params => {

      if (!params['id']) {
        this.petSelecionado.set(null);
        return;
      }

      const id : number = Number(params['id']);

      const petExiste = this.petService.pets().some(p => p.id === id);

      if (!petExiste) {
        this.router.navigate(['/404']);
        return;
      }

      this.petSelecionado.set(id);
    });
  }

  fecharModal() {
    this.router.navigate(['/dashboard/pets-page']);
  }
}
