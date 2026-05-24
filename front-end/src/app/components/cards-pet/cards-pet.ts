import { Component, input, inject, ElementRef } from '@angular/core';
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
  private host = inject(ElementRef<HTMLElement>);

  abrirPet() {
    // marca o card como em navegação para ativar animação CSS
    try {
      this.host.nativeElement.classList.add('is-navigating');
    } catch {}

    // pequeno delay para permitir a animação antes da navegação
    setTimeout(() => {
      this.router.navigate(['/dashboard/pets-page', this.id()]);
    }, 220);
  }
}
