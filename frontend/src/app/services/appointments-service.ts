import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppointmentResponseDTO } from '../models/DTO/appointment-response-DTO';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  constructor(private http: HttpClient) {}
  registerAppointment(appointment: any): Observable<any> {
    return this.http.post('https://agendapet.onrender.com/appointments',appointment,
    {
      withCredentials: true
    }
    );
  }

  getAppointmentsResponseDTO(): Observable<AppointmentResponseDTO[]> {
    return this.http.get<AppointmentResponseDTO[]>('https://agendapet.onrender.com/appointments');
  }

  registerAppointmentResponseDTO(appointment: AppointmentResponseDTO): Observable<AppointmentResponseDTO> {
    return this.http.post<AppointmentResponseDTO>('https://agendapet.onrender.com/appointments', appointment, {
      withCredentials: true
    });
  }
}
