import { Component, input } from '@angular/core';

@Component({
  selector: 'app-historico-animal',
  imports: [],
  templateUrl: './historico-animal.html',
  styleUrl: './historico-animal.css',
})
export class HistoricoAnimal {
  titulo = input.required<string>();
  data = input.required<string>();
  descricao = input.required<string>();
  nomeAnimal = input.required<string>();
}
