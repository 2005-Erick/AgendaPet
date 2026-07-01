import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  AppointmentResponseDTO,
  AppointmentStatus,
  AppointmentTypes,
  PaymentStatus,
} from '../models/DTO/appointment-response-DTO';
import { environment } from '../../environments/environment';

export interface AppointmentCreateDTO {
  doctor_id: string;
  pet_id: string;
  scheduled_at: string;
  type: AppointmentTypes;
  status?: AppointmentStatus;
  price?: number;
  paymentStatus?: PaymentStatus;
  note?: string;
}

export interface AppointmentUpdateDTO {
  doctor_id?: string;
  pet_id?: string;
  scheduled_at?: string;
  type?: AppointmentTypes;
  status?: AppointmentStatus;
  price?: number;
  paymentStatus?: PaymentStatus;
  note?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private readonly backendUrl = environment.backendUrl;

  constructor(private http: HttpClient) {}

  getAppointmentsResponseDTO(): Observable<AppointmentResponseDTO[]> {
    return this.http.get<AppointmentResponseDTO[]>(`${this.backendUrl}/appointments`, {
      withCredentials: true,
    });
  }

  createAppointment(dto: AppointmentCreateDTO): Observable<AppointmentResponseDTO> {
    return this.http.post<AppointmentResponseDTO>(`${this.backendUrl}/appointments`, dto, {
      withCredentials: true,
    });
  }

  updateAppointment(id: string, dto: AppointmentUpdateDTO): Observable<AppointmentResponseDTO> {
    return this.http.patch<AppointmentResponseDTO>(`${this.backendUrl}/appointments/${id}`, dto, {
      withCredentials: true,
    });
  }

  deleteAppointment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.backendUrl}/appointments/${id}`, {
      withCredentials: true,
    });
  }

  registerAppointment(dto: AppointmentCreateDTO): Observable<AppointmentResponseDTO> {
    return this.createAppointment(dto);
  }
}
