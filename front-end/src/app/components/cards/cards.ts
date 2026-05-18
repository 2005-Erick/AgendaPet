import { Component, input } from '@angular/core';

@Component({
  selector: 'app-cards',
  imports: [],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})
export class Cards {
  nome = input.required<string>();
  imagem = input.required<string>();
  raca = input.required<string>();
  proximo = input.required<string>();
  status = input.required<string>();
  idade = input.required<number>();
}
