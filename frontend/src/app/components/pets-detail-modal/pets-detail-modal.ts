import { Component, input, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { PetsService } from '../../services/pets-service';
import { AppointmentsService } from '../../services/appointments-service';
import { PetResponseDTO } from '../../models/DTO/pet-response-DTO';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pets-detail-modal',
  imports: [DatePipe],
  templateUrl: './pets-detail-modal.html',
  styleUrls: ['./pets-detail-modal.css'],
  providers: [DatePipe]
})
export class PetsDetailModal {
  id = input.required<string>();

  private router = inject(Router);
  private petsService = inject(PetsService);
  private appointmentsService = inject(AppointmentsService);

  pets = toSignal(this.petsService.getPetsResponseDTO(), { initialValue: [] as PetResponseDTO[] });
  
  pet = computed(() => this.pets().find(p => p.id === this.id()));
  agendamentos = toSignal(this.appointmentsService.getAppointmentsResponseDTO(), { initialValue: [] });

  idade = computed(() => {
    const p = this.pet();
    if (!p) return 0;
    const bday = new Date(p.birthday);
    const ageDifMs = Date.now() - bday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  });

  fechar() {
    this.router.navigate(['/dashboard/pets-page']);
  }
}
