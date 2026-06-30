import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PetsService } from '../../../../../services/pets-service';
import { AppointmentsService } from '../../../../../services/appointments-service';
import { ActivatedRoute, Router } from '@angular/router';
import { PetsDetailModal } from '../../../../../components/pets-detail-modal/pets-detail-modal';
import { PetResponseDTO } from '../../../../../models/DTO/pet-response-DTO';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pets-page',
  imports: [PetsDetailModal, DatePipe],
  templateUrl: './pets-page.html',
  styleUrls: ['./pets-page.css'],
  providers: [DatePipe]
})
export class PetsPage {

  private petsService = inject(PetsService);
  private appointmentsService = inject(AppointmentsService);

  pets = toSignal(this.petsService.getPetsResponseDTO(), { initialValue: [] as PetResponseDTO[] });
  agendamentos = toSignal(this.appointmentsService.getAppointmentsResponseDTO(), { initialValue: [] });

  totalPets = computed(() => this.pets().length);
  totalAgendamentos = computed(() => this.agendamentos().length);
  agendamentosFuturos = computed(() => this.agendamentos().filter(a => a.status === 'SCHEDULED').length);

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  petSelecionado = signal<string | null>(null);

  petsComAgendamento = computed(() =>
    this.pets().map(pet => ({
      ...pet,
      agendamento: this.agendamentos().find(a => String(a.pet_id) === pet.id && a.status === 'SCHEDULED') ?? null
    }))
  );

  abrirPet(id: string) {
    this.router.navigate(['/dashboard/pets-page/pet', id]);
  }

  constructor() {
    this.route.params.subscribe(params => {

      if (!params['id']) {
        this.petSelecionado.set(null);
        return;
      }

      const id : string = params['id'];
      this.petSelecionado.set(id);
    });
  }

  fecharModal() {
    this.router.navigate(['/dashboard/pets-page']);
  }
}
