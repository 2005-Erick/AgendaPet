import { Component, inject, signal, computed } from '@angular/core';
import {AgendamentoService} from '../../../../services/agendamento';

@Component({
  selector: 'app-agendamentos-page',
  imports: [],
  templateUrl: './agendamentos-page.html',
  styleUrl: './agendamentos-page.css',
})
export class AgendamentosPage {

  private agendamentoService = inject(AgendamentoService);

  agendamentos = this.agendamentoService.agendamento;

  filters = signal({
    servico: '',
    animal: '',
    data: ''
  });

  agendamentosFiltrados = computed(() => {
    const f = this.filters();

    return this.agendamentos().filter(a =>
      a.nomeAnimal.toLowerCase().includes(f.animal.toLowerCase()) &&
      a.servico.toLowerCase().includes(f.servico.toLowerCase()) &&
      (!f.data || a.data === f.data)
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