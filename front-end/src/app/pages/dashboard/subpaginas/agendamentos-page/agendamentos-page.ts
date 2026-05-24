import { Component, inject, signal, computed } from '@angular/core';
import { HistoricoAnimalService } from '../../../../services/historico-animal/historico-animal';
import { ProximosAgendamentosService } from '../../../../services/proximos-agendamentos/proximos-agendamentos';

@Component({
  selector: 'app-agendamentos-page',
  imports: [],
  templateUrl: './agendamentos-page.html',
  styleUrl: './agendamentos-page.css',
})
export class AgendamentosPage {

  private historicoAnimalService = inject(HistoricoAnimalService);
  private proximosAgendamentosService = inject(ProximosAgendamentosService);

  historico = this.historicoAnimalService.historicoAnimal;
  proximosAgendamentos = this.proximosAgendamentosService.proximosAgendamentos;

  filters = signal({
    servico: '',
    animal: '',
    data: ''
  });

  historicosFiltrados = computed(() => {
    const f = this.filters();

    return this.historico().filter(h =>
      h.nomeAnimal.toLowerCase().includes(f.animal.toLowerCase()) &&
      h.titulo.toLowerCase().includes(f.servico.toLowerCase()) &&
      (!f.data || h.data === f.data)
    );
  });

  proximosFiltrados = computed(() => {
    const f = this.filters();

    return this.proximosAgendamentos().filter(p =>
      p.nomeAnimal.toLowerCase().includes(f.animal.toLowerCase()) &&
      p.servico.toLowerCase().includes(f.servico.toLowerCase()) &&
      (!f.data || p.dataCompleta === f.data)
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