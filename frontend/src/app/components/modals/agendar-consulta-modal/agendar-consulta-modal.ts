import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AppointmentsService } from '../../../services/appointments-service';
import { DoctorsServices } from '../../../services/doctors-service';
import { PetsService } from '../../../services/pets-service';
import { DoctorResponseDTO } from '../../../models/DTO/doctor-response-DTO';
import { PetResponseDTO } from '../../../models/DTO/pet-response-DTO';
import { AppointmentTypes } from '../../../models/DTO/appointment-response-DTO';

@Component({
  selector: 'app-agendar-consulta-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './agendar-consulta-modal.html',
  styleUrl: './agendar-consulta-modal.css'
})
export class AgendarConsultaModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AgendarConsultaModalComponent>);
  private appointmentsService = inject(AppointmentsService);
  private doctorsService = inject(DoctorsServices);
  private petsService = inject(PetsService);

  form: FormGroup;
  doctors: DoctorResponseDTO[] = [];
  pets: PetResponseDTO[] = [];
  appointmentTypes = Object.values(AppointmentTypes);

  constructor() {
    this.form = this.fb.group({
      doctor_id: ['', Validators.required],
      pet_id: ['', Validators.required],
      scheduled_at: ['', Validators.required],
      type: ['', Validators.required],
      note: ['']
    });
  }

  ngOnInit(): void {
    this.loadDoctors();
    this.loadPets();
  }

  loadDoctors() {
    this.doctorsService.getDoctors().subscribe({
      next: (data) => this.doctors = data,
      error: (err) => console.error('Erro ao carregar médicos:', err)
    });
  }

  loadPets() {
    this.petsService.getPetsResponseDTO().subscribe({
      next: (data) => this.pets = data,
      error: (err) => console.error('Erro ao carregar pets:', err)
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const payload = {
        ...formValue,
        // The backend expects scheduled_at as a string (ISO)
        scheduled_at: new Date(formValue.scheduled_at).toISOString()
      };
      
      this.appointmentsService.createAppointment(payload).subscribe({
        next: (res) => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Erro ao agendar consulta:', err);
          alert('Erro ao agendar consulta: ' + (err.error?.message || 'Conflito de horário ou erro no servidor.'));
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
