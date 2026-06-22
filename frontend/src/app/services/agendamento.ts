import { Injectable , signal} from '@angular/core';
import { Agendamento } from '../models/agendament-model';

@Injectable({
  providedIn: 'root',
})
export class AgendamentoService {
  private _agendamento = signal<Agendamento[]>([    
    {
      id: 1,
      nomeAnimal: 'Luna',
      titulo: 'Check-up anual',
      data: '22/05/2026',
      descricao: 'Luna está em ótima saúde',
      petId: 1,
      horario: '15:00',
      status: 'Concluido',
      cidade: 'Pet Spa',
      servico: 'Check-up'
    },

    {
      id: 2,
      nomeAnimal: 'Thor',
      titulo: 'Tratamento do Thor',
      data: '24/05/2026',
      descricao: 'Tratamento mensal necessário.',
      petId: 2,
      horario: '10:00',
      status: 'Pendente',
      servico: 'Tratamento',
      cidade: 'Pet Spa'

    },
    {
      id: 3,
      titulo: 'Vacinação da Luna',
      dataFormatada: 'OUT 12',
      cidade: 'City Vet',
      horario: '10:00', 
      data: '12/06/2026',
      petId: 1,
      servico: 'Vacinação',
      nomeAnimal: 'Luna',
      status: 'Agendado'
    },

    {
      id: 4,
      titulo: 'Banho do Thor',
      dataFormatada: 'NOV 05',
      cidade: 'Pet Spa',
      horario: '14:30',
      data: '13/06/2026',
      petId: 2,
      servico: 'Banho',
      nomeAnimal: 'Thor',
      status: 'Agendado'
    },
  ])
  get agendamento() {
    return this._agendamento.asReadonly();
  }
}
