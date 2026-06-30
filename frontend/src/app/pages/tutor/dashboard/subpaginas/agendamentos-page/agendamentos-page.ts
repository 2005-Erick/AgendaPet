import { Component, inject, signal, computed } from '@angular/core';
import { AppointmentsService } from '../../../../../services/appointments-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-agendamentos-page',
  imports: [DatePipe],
  templateUrl: './agendamentos-page.html',
  styleUrl: './agendamentos-page.css',
  providers: [DatePipe]
})
export class AgendamentosPage {

  private appointmentsService = inject(AppointmentsService);

  agendamentos = toSignal(this.appointmentsService.getAppointmentsResponseDTO(), { initialValue: [] });

  filters = signal({
    servico: '',
    animal: '',
    data: ''
  });

  agendamentosFiltrados = computed(() => {
    const f = this.filters();

    return this.agendamentos().filter(a =>
      (a.pet_name || '').toLowerCase().includes(f.animal.toLowerCase()) &&
      (a.type || '').toLowerCase().includes(f.servico.toLowerCase()) &&
      (!f.data || a.scheduled_at.startsWith(f.data))
    );
  });

  setFilter(key: 'servico' | 'animal' | 'data', value: string) {
    this.filters.update(current => ({
      ...current,
      [key]: value
    }));
  }

  clearFilters() {
    this.filters.set({
      servico: '',
      animal: '',
      data: ''
    });
  }
}