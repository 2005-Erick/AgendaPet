import { Component, inject, signal, effect } from '@angular/core';
import { PetService } from '../../../../services/pet/pet';
import {HistoricoAnimalService} from '../../../../services/historico-animal/historico-animal';
import { ActivatedRoute, Router } from '@angular/router';
import { PetsDetailModal } from '../../../../components/pets-detail-modal/pets-detail-modal';

@Component({
  selector: 'app-pets-page',
  imports: [PetsDetailModal],
  templateUrl: './pets-page.html',
  styleUrls: ['./pets-page.css'],
})

export class PetsPage {
  private petService = inject(PetService);
  pets = this.petService.pets();
  private historicoAnimalService = inject(HistoricoAnimalService);
  historicos = this.historicoAnimalService.historicoAnimal();

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  petSelecionado = signal<number | null>(null);

  abrirPet(id: number) {
    this.router.navigate(['/dashboard/pets-page/pet', id]);
  }

  constructor() {
    effect(() => {
      this.route.params.subscribe(params => {
        const idParam = params['id'];
        const id = idParam ? Number(idParam) : null;

        this.petSelecionado.set(Number.isNaN(id) ? null : id);
      })
    });
  }

  fecharModal() {
    this.router.navigate(['/dashboard/pets-page']);
  }
}

