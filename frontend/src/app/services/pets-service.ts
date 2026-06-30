import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PetGenderEnum, PetResponseDTO, PetSpecies } from '../models/DTO/pet-response-DTO';

export interface PetCreateDTO {
  tutor_id: string;
  name: string;
  weight: number;
  avatarUrl?: string;
  gender: PetGenderEnum;
  birthday: string;
  species: PetSpecies;
  breed: string;
  description?: string;
}

export interface PetUpdateDTO {
  tutor_id?: string;
  name?: string;
  weight?: number;
  avatarUrl?: string;
  gender?: PetGenderEnum;
  birthday?: string;
  species?: PetSpecies;
  breed?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PetsService {
  private readonly backendUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getPetsResponseDTO(): Observable<PetResponseDTO[]> {
    return this.http.get<PetResponseDTO[]>(`${this.backendUrl}/pets`, {
      withCredentials: true,
    });
  }

  getPetById(id: string): Observable<PetResponseDTO> {
    return this.http.get<PetResponseDTO>(`${this.backendUrl}/pets/${id}`, {
      withCredentials: true,
    });
  }

  createPet(pet: PetCreateDTO): Observable<PetResponseDTO> {
    return this.http.post<PetResponseDTO>(`${this.backendUrl}/pets`, pet, {
      withCredentials: true,
    });
  }

  updatePet(id: string, pet: PetUpdateDTO): Observable<PetResponseDTO> {
    return this.http.patch<PetResponseDTO>(`${this.backendUrl}/pets/${id}`, pet, {
      withCredentials: true,
    });
  }

  deletePet(id: string): Observable<void> {
    return this.http.delete<void>(`${this.backendUrl}/pets/${id}`, {
      withCredentials: true,
    });
  }

  // Mantém compatibilidade caso algum componente antigo ainda use registerPet()
  registerPet(pet: PetCreateDTO): Observable<PetResponseDTO> {
    return this.createPet(pet);
  }
}
