import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DoctorResponseDTO } from '../models/DTO/doctor-response-DTO';

@Injectable({
  providedIn: 'root',
})

export class DoctorsServices {
  constructor(private http: HttpClient) {}

  getDoctors(): Observable<DoctorResponseDTO[]> {
    return this.http.get<DoctorResponseDTO[]>('https://agendapet.onrender.com/doctors');
  }  
}
