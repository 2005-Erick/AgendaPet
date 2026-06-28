import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { iPets } from '../models/pets-model';
import { HttpClient } from '@angular/common/http';
import { PetResponseDTO } from '../models/DTO/pet-response-DTO';

@Injectable({
  providedIn: 'root',
})
export class PetsService {
  constructor(private http: HttpClient) {}
    registerPet(pet : iPets): Observable<iPets | any> {
      return this.http.post<iPets | any>('https://agendapet.onrender.com/pets', pet);
  
      // precisa de um token provavelmente
    }

    getPetsResponseDTO(): Observable<PetResponseDTO[]> {
      return this.http.get<PetResponseDTO[]>('https://agendapet.onrender.com/pets');
    }

    registerPetResponseDTO(pet: PetResponseDTO): Observable<PetResponseDTO> {
      return this.http.post<PetResponseDTO>('https://agendapet.onrender.com/pets', pet);
    }
}
