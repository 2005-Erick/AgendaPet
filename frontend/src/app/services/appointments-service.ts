import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  constructor(private http: HttpClient) {}
    registerAppointment(appointment: any): Observable<any> {
    return this.http.post<any>('https://agendapet.onrender.com/appointments', appointment);
  }
}
