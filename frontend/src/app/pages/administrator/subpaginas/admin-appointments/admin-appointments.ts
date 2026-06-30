import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
} from '@angular/forms';
import { AppointmentsService } from '../../../../services/appointments-service';
import { DoctorsServices } from '../../../../services/doctors-service';
import { PetsService } from '../../../../services/pets-service';
import {
  AppointmentResponseDTO,
  AppointmentTypes,
  AppointmentStatus,
  PaymentStatus,
} from '../../../../models/DTO/appointment-response-DTO';
import { DoctorResponseDTO } from '../../../../models/DTO/doctor-response-DTO';
import { PetResponseDTO } from '../../../../models/DTO/pet-response-DTO';

@Component({
  selector: 'app-admin-appointments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DatePipe],
  templateUrl: './admin-appointments.html',
  styleUrls: ['./admin-appointments.css'],
})
export class AdminAppointments implements OnInit {
  private appointmentsService = inject(AppointmentsService);
  private doctorsService = inject(DoctorsServices);
  private petsService = inject(PetsService);

  appointments = signal<AppointmentResponseDTO[]>([]);
  doctors = signal<DoctorResponseDTO[]>([]);
  pets = signal<PetResponseDTO[]>([]);

  searchTerm = signal('');
  isLoading = signal(false);

  listMessage = signal<string | null>(null);
  listMessageType = signal<'success' | 'error' | null>(null);

  createMessage = signal<string | null>(null);
  createMessageType = signal<'success' | 'error' | null>(null);

  editMessage = signal<string | null>(null);
  editMessageType = signal<'success' | 'error' | null>(null);

  showCreateModal = signal(false);
  showEditModal = signal(false);
  editingAppointmentId = signal<string | null>(null);

  get AppointmentTypes() {
    return AppointmentTypes;
  }

  get AppointmentStatus() {
    return AppointmentStatus;
  }

  get PaymentStatus() {
    return PaymentStatus;
  }

  createForm = new FormGroup({
    pet_id: new FormControl('', [Validators.required]),
    doctor_id: new FormControl('', [Validators.required]),
    scheduled_at: new FormControl('', [Validators.required]),
    type: new FormControl<AppointmentTypes | null>(null, [Validators.required]),
    status: new FormControl<AppointmentStatus>(AppointmentStatus.SCHEDULED, [Validators.required]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    paymentStatus: new FormControl<PaymentStatus>(PaymentStatus.PENDING, [Validators.required]),
    note: new FormControl('', [Validators.maxLength(300)]),
  });

  editForm = new FormGroup({
    pet_id: new FormControl('', [Validators.required]),
    doctor_id: new FormControl('', [Validators.required]),
    scheduled_at: new FormControl('', [Validators.required]),
    type: new FormControl<AppointmentTypes | null>(null, [Validators.required]),
    status: new FormControl<AppointmentStatus>(AppointmentStatus.SCHEDULED, [Validators.required]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    paymentStatus: new FormControl<PaymentStatus>(PaymentStatus.PENDING, [Validators.required]),
    note: new FormControl('', [Validators.maxLength(300)]),
  });

  filteredAppointments = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) {
      return this.appointments();
    }

    return this.appointments().filter(
      (appointment) =>
        appointment.pet_name.toLowerCase().includes(term) ||
        appointment.doctor_name.toLowerCase().includes(term) ||
        this.formatType(appointment.type).toLowerCase().includes(term) ||
        this.formatStatus(appointment.status).toLowerCase().includes(term) ||
        this.formatPaymentStatus(appointment.paymentStatus).toLowerCase().includes(term),
    );
  });

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.isLoading.set(true);
    this.listMessage.set(null);

    this.appointmentsService.getAppointmentsResponseDTO().subscribe({
      next: (appointments) => {
        this.appointments.set(appointments);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar agendamentos', err);
        this.listMessage.set('Erro ao carregar os agendamentos cadastrados.');
        this.listMessageType.set('error');
        this.isLoading.set(false);
      },
    });

    this.doctorsService.getDoctors().subscribe({
      next: (doctors) => {
        this.doctors.set(doctors);
      },
      error: (err) => {
        console.error('Erro ao carregar médicos', err);
      },
    });

    this.petsService.getPetsResponseDTO().subscribe({
      next: (pets) => {
        this.pets.set(pets);
      },
      error: (err) => {
        console.error('Erro ao carregar pets', err);
      },
    });
  }

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  getCreateFieldFeedback(
    fieldName:
      | 'pet_id'
      | 'doctor_id'
      | 'scheduled_at'
      | 'type'
      | 'status'
      | 'price'
      | 'paymentStatus'
      | 'note',
  ) {
    const messages: Record<string, string> = {
      pet_id: 'Selecione o pet paciente.',
      doctor_id: 'Selecione o médico veterinário responsável.',
      scheduled_at: 'Determine a data e hora do atendimento.',
      type: 'Defina o tipo de procedimento.',
      status: 'Selecione o status do agendamento.',
      price: 'Informe um valor válido.',
      paymentStatus: 'Selecione o status de pagamento.',
      note: 'A observação deve ter no máximo 300 caracteres.',
    };

    return this.getFieldFeedback(
      this.createForm.get(fieldName),
      messages[fieldName] || 'Campo inválido.',
    );
  }

  getEditFieldFeedback(
    fieldName:
      | 'pet_id'
      | 'doctor_id'
      | 'scheduled_at'
      | 'type'
      | 'status'
      | 'price'
      | 'paymentStatus'
      | 'note',
  ) {
    const messages: Record<string, string> = {
      pet_id: 'Selecione o pet paciente.',
      doctor_id: 'Selecione o médico veterinário responsável.',
      scheduled_at: 'Determine a data e hora do atendimento.',
      type: 'Defina o tipo de procedimento.',
      status: 'Selecione o status do agendamento.',
      price: 'Informe um valor válido.',
      paymentStatus: 'Selecione o status de pagamento.',
      note: 'A observação deve ter no máximo 300 caracteres.',
    };

    return this.getFieldFeedback(
      this.editForm.get(fieldName),
      messages[fieldName] || 'Campo inválido.',
    );
  }

  private getFieldFeedback(control: AbstractControl | null, defaultMessage: string) {
    if (!control || (!control.touched && !control.dirty)) {
      return null;
    }

    if (control.invalid) {
      return {
        kind: 'error' as const,
        message: defaultMessage,
      };
    }

    return {
      kind: 'success' as const,
      message: '',
    };
  }

  openCreateModal() {
    this.resetCreateForm();
    this.createMessage.set(null);
    this.createMessageType.set(null);
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
    this.resetCreateForm();
  }

  createAppointment() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.createMessage.set('Preencha os campos obrigatórios sinalizados.');
      this.createMessageType.set('error');
      return;
    }

    const formValues = this.createForm.value;

    this.appointmentsService
      .createAppointment({
        pet_id: formValues.pet_id!,
        doctor_id: formValues.doctor_id!,
        scheduled_at: formValues.scheduled_at!,
        type: formValues.type!,
        status: formValues.status!,
        price: Number(formValues.price!),
        paymentStatus: formValues.paymentStatus!,
        note: formValues.note || undefined,
      })
      .subscribe({
        next: () => {
          this.createMessage.set('Atendimento agendado com sucesso.');
          this.createMessageType.set('success');
          this.loadData();

          setTimeout(() => {
            this.closeCreateModal();
          }, 1200);
        },
        error: (err) => {
          console.error('Erro ao criar agendamento', err);
          this.createMessage.set(
            'Erro ao criar agendamento. Verifique conflito de horário, médico, pet ou dados inválidos.',
          );
          this.createMessageType.set('error');
        },
      });
  }

  openEditModal(appointment: AppointmentResponseDTO) {
    this.editingAppointmentId.set(appointment.id);

    this.editForm.patchValue({
      pet_id: appointment.pet_id,
      doctor_id: appointment.doctor_id,
      scheduled_at: this.toDatetimeLocal(appointment.scheduled_at),
      type: appointment.type,
      status: appointment.status,
      price: appointment.price ?? 0,
      paymentStatus: appointment.paymentStatus ?? PaymentStatus.PENDING,
      note: appointment.note || '',
    });

    this.editMessage.set(null);
    this.editMessageType.set(null);
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editingAppointmentId.set(null);
    this.resetEditForm();
  }

  saveEditedAppointment() {
    const appointmentId = this.editingAppointmentId();

    if (!appointmentId) {
      return;
    }

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.editMessage.set('Preencha os campos obrigatórios corretamente.');
      this.editMessageType.set('error');
      return;
    }

    const formValues = this.editForm.value;

    this.appointmentsService
      .updateAppointment(appointmentId, {
        pet_id: formValues.pet_id!,
        doctor_id: formValues.doctor_id!,
        scheduled_at: formValues.scheduled_at!,
        type: formValues.type!,
        status: formValues.status!,
        price: Number(formValues.price!),
        paymentStatus: formValues.paymentStatus!,
        note: formValues.note || undefined,
      })
      .subscribe({
        next: () => {
          this.editMessage.set('Agendamento atualizado com sucesso.');
          this.editMessageType.set('success');
          this.loadData();

          setTimeout(() => {
            this.closeEditModal();
          }, 1000);
        },
        error: (err) => {
          console.error('Erro ao atualizar agendamento', err);
          this.editMessage.set(
            'Erro ao atualizar agendamento. Verifique conflito de horário ou dados inválidos.',
          );
          this.editMessageType.set('error');
        },
      });
  }

  deleteAppointment(id: string) {
    if (!confirm('Pretende realmente remover este agendamento do sistema?')) {
      return;
    }

    this.appointmentsService.deleteAppointment(id).subscribe({
      next: () => {
        this.listMessage.set('Agendamento removido com sucesso.');
        this.listMessageType.set('success');
        this.loadData();
      },
      error: (err) => {
        console.error('Erro ao remover agendamento', err);
        this.listMessage.set('Erro ao remover agendamento.');
        this.listMessageType.set('error');
      },
    });
  }

  formatType(type: AppointmentTypes): string {
    const labels: Record<AppointmentTypes, string> = {
      [AppointmentTypes.CONSULTATION]: 'Consulta',
      [AppointmentTypes.VACCINATION]: 'Vacinação',
      [AppointmentTypes.SURGERY]: 'Cirurgia',
    };

    return labels[type] || type;
  }

  formatStatus(status: AppointmentStatus): string {
    const labels: Record<AppointmentStatus, string> = {
      [AppointmentStatus.SCHEDULED]: 'Agendado',
      [AppointmentStatus.COMPLETED]: 'Concluído',
      [AppointmentStatus.CANCELED]: 'Cancelado',
      [AppointmentStatus.NO_SHOW]: 'Falta',
    };

    return labels[status] || status;
  }

  getStatusClass(status: AppointmentStatus): string {
    switch (status) {
      case AppointmentStatus.COMPLETED:
        return 'bg-green-100 text-green-700';
      case AppointmentStatus.SCHEDULED:
        return 'bg-blue-100 text-blue-700';
      case AppointmentStatus.CANCELED:
        return 'bg-red-100 text-red-700';
      case AppointmentStatus.NO_SHOW:
        return 'bg-zinc-200 text-zinc-700';
      default:
        return 'bg-surface-container text-on-surface';
    }
  }

  formatPaymentStatus(status: PaymentStatus): string {
    const labels: Record<PaymentStatus, string> = {
      [PaymentStatus.PENDING]: 'Pendente',
      [PaymentStatus.PAID]: 'Pago',
      [PaymentStatus.REFUNDED]: 'Reembolsado',
    };

    return labels[status] || status;
  }

  private toDatetimeLocal(value: string): string {
    if (!value) {
      return '';
    }

    return value.slice(0, 16);
  }

  private resetCreateForm() {
    this.createForm.reset({
      pet_id: '',
      doctor_id: '',
      scheduled_at: '',
      type: null,
      status: AppointmentStatus.SCHEDULED,
      price: null,
      paymentStatus: PaymentStatus.PENDING,
      note: '',
    });
  }

  private resetEditForm() {
    this.editForm.reset({
      pet_id: '',
      doctor_id: '',
      scheduled_at: '',
      type: null,
      status: AppointmentStatus.SCHEDULED,
      price: null,
      paymentStatus: PaymentStatus.PENDING,
      note: '',
    });
  }
}
