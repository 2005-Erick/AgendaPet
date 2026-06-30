import { Component, input, inject, ElementRef, computed } from '@angular/core';
import { Router } from '@angular/router';
import { PetResponseDTO } from '../../models/DTO/pet-response-DTO';

@Component({
  selector: 'app-cards-pet',
  templateUrl: './cards-pet.html',
  styleUrls: ['./cards-pet.css'],
})

export class CardsPet {
  pet = input.required<PetResponseDTO>();
  proximo = input<string>('Nenhum agendamento');
  status = input<string>('Saudável');
  
  idade = computed(() => {
    const bday = new Date(this.pet().birthday);
    const ageDifMs = Date.now() - bday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  });
  
  private router = inject(Router);
  private host = inject(ElementRef<HTMLElement>);

  abrirPet() {
    // marca o card como em navegação para ativar animação CSS
    try {
      this.host.nativeElement.classList.add('is-navigating');
    } catch {}

    // pequeno delay para permitir a animação antes da navegação
    setTimeout(() => {
      this.router.navigate(['/dashboard/pets-page/pet', this.pet().id]);
    }, 220);
  }
}
