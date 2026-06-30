import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { iPets } from '../models/pets-model';
import { HttpClient } from '@angular/common/http';
import { PetResponseDTO } from '../models/DTO/pet-response-DTO';
import {PetCreateDTO} from "../models/DTO/petCreate-response-DTO";

@Injectable({
  providedIn: 'root',
})
export class PetsService {
  constructor(private http: HttpClient) {}

    getPetsResponseDTO(): Observable<PetResponseDTO[]> {
      return this.http.get<PetResponseDTO[]>('https://agendapet.onrender.com/pets',       {
        withCredentials: true
      });
    }

    registerPet(pet: PetCreateDTO): Observable<PetResponseDTO> {
      return this.http.post<PetResponseDTO>('https://agendapet.onrender.com/pets', pet, {
        withCredentials: true
      });
    }
}
