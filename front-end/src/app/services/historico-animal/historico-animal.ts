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
      data: '2 dias atrás',
      descricao: 'Luna está em ótima saúde'
    },

    {
      nomeAnimal: 'Thor',
      titulo: 'Tratamento',
      data: 'Atrasado',
      descricao: 'Tratamento mensal necessário.'
    }
  ]);

  get historicoAnimal() {
    return this._historicosAnimal.asReadonly();
  }
}
