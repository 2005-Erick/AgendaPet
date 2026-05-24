import { Component, input, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cards-pet',
  templateUrl: './cards-pet.html',
  styleUrls: ['./cards-pet.css'],
})

export class CardsPet {
  nome = input.required<string>();
  imagem = input.required<string>();
  raca = input.required<string>();
  proximo = input.required<string>();
  status = input.required<string>();
  idade = input.required<number>();
  id = input.required<number>();
  
  private router = inject(Router);

  abrirPet() {
    this.router.navigate(['/dashboard/pets-page', this.id()]);
  }
}
