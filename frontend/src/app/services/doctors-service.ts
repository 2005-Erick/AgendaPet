import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DoctorResponseDTO } from '../models/DTO/doctor-response-DTO';

@Injectable({
  providedIn: 'root',
})
export class DoctorsServices {
  private readonly backendUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<DoctorResponseDTO[]> {
    return this.http.get<DoctorResponseDTO[]>(`${this.backendUrl}/doctors`, {
      withCredentials: true,
    });
  }

  createDoctorProfile(userId: string, crmv: string): Observable<DoctorResponseDTO> {
    return this.http.post<DoctorResponseDTO>(
      `${this.backendUrl}/doctors`,
      {
        user_id: userId,
        crmv,
      },
      {
        withCredentials: true,
      },
    );
  }
}
