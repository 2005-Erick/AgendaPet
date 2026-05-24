import { Injectable, signal } from '@angular/core';
import { HistoricoAnimal } from '../../models/historico-animal.model';

@Injectable({
  providedIn: 'root',
})
export class HistoricoAnimalService {
    private _historicosAnimal = signal<HistoricoAnimal[]> ([
    {
      nomeAnimal: 'Luna',
      titulo: 'Check-up anual',
      data: '22/05/2026',
      descricao: 'Luna está em ótima saúde',
      petId: 1,
      horario: '15:00',
      status: 'Concluido'
    },

    {
      nomeAnimal: 'Thor',
      titulo: 'Tratamento',
      data: '24/05/2026',
      descricao: 'Tratamento mensal necessário.',
      petId: 2,
      horario: '10:00',
      status: 'Pendente'
    }
  ]);

  get historicoAnimal() {
    return this._historicosAnimal.asReadonly();
  }
}
