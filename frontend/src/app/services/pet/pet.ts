import { Injectable, signal } from '@angular/core';
import { Pet } from '../../models/pet.model';

@Injectable({
  providedIn: 'root'
})

export class PetService {

  private _pets = signal<Pet[]> ([
    {
      nome: 'Luna',
      imagem: '/golden_retriever-luna.jpg', 
      raca: 'Golden',
      idade: 3,
      status: 'Rotina',
      proximo: 'Check-up anual',
      id: 1
    },

    {
      nome: 'Thor',
      imagem: '/gato_persa-thor.jpg',
      raca: 'Persa',
      idade: 5,
      status: 'Saudável',
      proximo: 'Tratamento contra pulgas',
      id: 2
    }
  ]);

  get pets() {
    return this._pets.asReadonly();
  }
}