import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DoctorsServices } from '../../../../services/doctors-service';
import { UsersService } from '../../../../services/users-service';
import { AppointmentsService } from '../../../../services/appointments-service';
import { DoctorResponseDTO } from '../../../../models/DTO/doctor-response-DTO';
import { UserResponseDTO } from '../../../../models/DTO/user-response-DTO';
import {
  AppointmentResponseDTO,
  AppointmentStatus,
} from '../../../../models/DTO/appointment-response-DTO';

@Component({
  selector: 'app-admin-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './admin-doctors.html',
  styleUrl: './admin-doctors.css',
})
export class AdminDoctors implements OnInit {
  private doctorsService = inject(DoctorsServices);
  private usersService = inject(UsersService);
  private appointmentsService = inject(AppointmentsService);

  doctors = signal<DoctorResponseDTO[]>([]);
  users = signal<UserResponseDTO[]>([]);
  appointments = signal<AppointmentResponseDTO[]>([]);

  searchTerm = signal('');
  isLoading = signal(false);

  message = signal<string | null>(null);
  messageType = signal<'success' | 'error' | null>(null);

  showCreateModal = signal(false);
  showProfileModal = signal(false);
  selectedDoctor = signal<DoctorResponseDTO | null>(null);

  newDoctor = signal({
    user_id: '',
    crmv: '',
  });

  filteredDoctors = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) {
      return this.doctors();
    }

    return this.doctors().filter((doctor) => {
      const status = this.getDoctorStatus(doctor).toLowerCase();

      return (
        doctor.name.toLowerCase().includes(term) ||
        doctor.crmv.toLowerCase().includes(term) ||
        doctor.user_id.toLowerCase().includes(term) ||
        doctor.doctor_profile_id.toLowerCase().includes(term) ||
        status.includes(term)
      );
    });
  });

  totalDoctors = computed(() => this.doctors().length);

  doctorsWithDoctorRole = computed(
    () => this.doctors().filter((doctor) => doctor.roles?.includes('DOCTOR')).length,
  );

  totalAppointments = computed(() => this.appointments().length);

  scheduledAppointments = computed(
    () =>
      this.appointments().filter(
        (appointment) => appointment.status === AppointmentStatus.SCHEDULED,
      ).length,
  );

  completedAppointments = computed(
    () =>
      this.appointments().filter(
        (appointment) => appointment.status === AppointmentStatus.COMPLETED,
      ).length,
  );

  availabilityStatus = computed(() => {
    if (this.doctors().length === 0) {
      return 'Sem médicos';
    }

    if (this.scheduledAppointments() > 0) {
      return 'Em atendimento';
    }

    return 'Ativa';
  });

  availableUsersForDoctor = computed(() => {
    const doctorUserIds = new Set(this.doctors().map((doctor) => doctor.user_id));

    return this.users().filter((user) => !doctorUserIds.has(user.id));
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.message.set(null);

    this.doctorsService.getDoctors().subscribe({
      next: (doctors) => {
        this.doctors.set(doctors);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar médicos', err);
        this.message.set('Erro ao carregar médicos. Tente novamente.');
        this.messageType.set('error');
        this.isLoading.set(false);
      },
    });

    this.usersService.getUsersResponseDTO().subscribe({
      next: (users) => {
        this.users.set(users);
      },
      error: (err) => {
        console.error('Erro ao carregar usuários', err);
      },
    });

    this.appointmentsService.getAppointmentsResponseDTO().subscribe({
      next: (appointments) => {
        this.appointments.set(appointments);
      },
      error: (err) => {
        console.error('Erro ao carregar agendamentos', err);
      },
    });
  }

  loadDoctors() {
    this.loadData();
  }

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  openCreateModal() {
    this.resetNewDoctor();
    this.message.set(null);
    this.messageType.set(null);
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
    this.resetNewDoctor();
  }

  updateNewDoctorField(field: 'user_id' | 'crmv', event: Event) {
    const input = event.target as HTMLInputElement;

    this.newDoctor.update((doctor) => ({
      ...doctor,
      [field]: field === 'crmv' ? input.value.toUpperCase() : input.value,
    }));
  }

  createDoctorProfile() {
    const doctor = this.newDoctor();

    if (!doctor.user_id.trim() || !doctor.crmv.trim()) {
      this.message.set('Selecione um usuário e informe o CRMV.');
      this.messageType.set('error');
      return;
    }

    if (!/^\d{4,6}-[A-Z]{2}$/.test(doctor.crmv.trim())) {
      this.message.set('CRMV inválido. Use o formato 1234-PB.');
      this.messageType.set('error');
      return;
    }

    this.doctorsService.createDoctorProfile(doctor.user_id.trim(), doctor.crmv.trim()).subscribe({
      next: () => {
        this.message.set('Perfil médico criado com sucesso.');
        this.messageType.set('success');
        this.closeCreateModal();
        this.loadData();
      },
      error: (err) => {
        console.error('Erro ao criar perfil médico', err);
        this.message.set(
          'Erro ao criar perfil médico. Verifique se o usuário existe ou se já possui perfil médico.',
        );
        this.messageType.set('error');
      },
    });
  }

  openProfile(doctor: DoctorResponseDTO) {
    this.selectedDoctor.set(doctor);
    this.showProfileModal.set(true);
  }

  closeProfile() {
    this.selectedDoctor.set(null);
    this.showProfileModal.set(false);
  }

  getDoctorAppointments(doctor: DoctorResponseDTO): AppointmentResponseDTO[] {
    return this.appointments()
      .filter((appointment) => appointment.doctor_id === doctor.doctor_profile_id)
      .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
  }

  getDoctorScheduledAppointments(doctor: DoctorResponseDTO): AppointmentResponseDTO[] {
    return this.getDoctorAppointments(doctor).filter(
      (appointment) => appointment.status === AppointmentStatus.SCHEDULED,
    );
  }

  getDoctorCompletedAppointments(doctor: DoctorResponseDTO): AppointmentResponseDTO[] {
    return this.getDoctorAppointments(doctor).filter(
      (appointment) => appointment.status === AppointmentStatus.COMPLETED,
    );
  }

  getNextAppointment(doctor: DoctorResponseDTO): AppointmentResponseDTO | null {
    const now = new Date().getTime();

    return (
      this.getDoctorScheduledAppointments(doctor).find(
        (appointment) => new Date(appointment.scheduled_at).getTime() >= now,
      ) || null
    );
  }

  getDoctorStatus(doctor: DoctorResponseDTO): string {
    return this.getDoctorScheduledAppointments(doctor).length > 0 ? 'Com agenda' : 'Disponível';
  }

  getStatusClass(doctor: DoctorResponseDTO): string {
    return this.getDoctorScheduledAppointments(doctor).length > 0
      ? 'bg-blue-100 text-blue-700'
      : 'bg-green-100 text-green-700';
  }

  formatRoles(roles: string[] | undefined): string {
    if (!roles || roles.length === 0) {
      return 'Sem cargo';
    }

    const labels: Record<string, string> = {
      ADMIN: 'Administrador',
      DOCTOR: 'Veterinário',
      TUTOR: 'Tutor',
      RECEPTIONIST: 'Recepcionista',
    };

    return roles.map((role) => labels[role] || role).join(', ');
  }

  getUserLabel(user: UserResponseDTO): string {
    return `${user.name} — ${user.email}`;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  private resetNewDoctor() {
    this.newDoctor.set({
      user_id: '',
      crmv: '',
    });
  }
}
