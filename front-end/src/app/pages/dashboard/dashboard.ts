import { Component, inject } from '@angular/core';
import { Cards } from '../../components/cards/cards';
import { PetService } from '../../services/pet/pet';

@Component({
  selector: 'app-dashboard',
  imports: [Cards],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard {
  private petService = inject(PetService);
    pets = this.petService.pets();

}
