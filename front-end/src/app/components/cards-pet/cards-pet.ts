import { Component, input } from '@angular/core';

@Component({
  selector: 'app-cards-pet',
  imports: [],
  templateUrl: './cards-pet.html',
  styleUrl: './cards-pet.css',
})
export class CardsPet {
  nome = input.required<string>();
  imagem = input.required<string>();
  raca = input.required<string>();
  proximo = input.required<string>();
  status = input.required<string>();
  idade = input.required<number>();
}
