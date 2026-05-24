import { Injectable, signal } from '@angular/core';
import { ProximosAgendamentos } from '../../models/proximos-agendamento.models';

@Injectable({
  providedIn: 'root',
})
export class ProximosAgendamentosService {
  private _proximosAgendamentos = signal<ProximosAgendamentos[]> ([
    {
      titulo: 'Vacinação da Luna',
      data: 'OUT 12',
      cidade: 'City Vet',
      horario: '10:00', 
      dataCompleta: '12/06/2026',
      petId: 1,
      servico: 'Vacinação',
      nomeAnimal: 'Luna'
    },

    {
      titulo: 'Banho do Thor',
      data: 'NOV 05',
      cidade: 'Pet Spa',
      horario: '14:30',
      dataCompleta: '13/06/2026',
      petId: 2,
      servico: 'Banho',
      nomeAnimal: 'Thor'
    },
  ]);

  get proximosAgendamentos() {
    return this._proximosAgendamentos.asReadonly();
  }
}
