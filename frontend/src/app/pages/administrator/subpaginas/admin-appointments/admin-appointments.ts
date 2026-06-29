import { Component, computed, signal } from '@angular/core';

type AppointmentItem = {
  id: number;
  petName: string;
  ownerName: string;
  date: string;
  time: string;
  type: string;
  status: string;
};

@Component({
  selector: 'app-admin-appointments',
  imports: [],
  templateUrl: './admin-appointments.html',
  styleUrl: './admin-appointments.css',
})
export class AdminAppointments {
  searchTerm = signal('');
  showCreateModal = signal(false);
  showEditModal = signal(false);
  editingAppointmentId = signal<number | null>(null);

  newAppointment = signal<AppointmentItem>({
    id: 0,
    petName: '',
    ownerName: '',
    date: '',
    time: '',
    type: 'Consulta',
    status: 'Confirmado',
  });

  editAppointment = signal<AppointmentItem>({
    id: 0,
    petName: '',
    ownerName: '',
    date: '',
    time: '',
    type: 'Consulta',
    status: 'Confirmado',
  });

  appointments = signal<AppointmentItem[]>([
    {
      id: 1,
      petName: 'Luna',
      ownerName: 'Ana Paula',
      date: '2026-07-05',
      time: '09:00',
      type: 'Consulta',
      status: 'Confirmado',
    },
    {
      id: 2,
      petName: 'Thor',
      ownerName: 'Bruno Costa',
      date: '2026-07-12',
      time: '11:30',
      type: 'Vacinação',
      status: 'Pendente',
    },
  ]);

  filteredAppointments = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) {
      return this.appointments();
    }

    return this.appointments().filter(
      (appointment) =>
        appointment.petName.toLowerCase().includes(term) ||
        appointment.ownerName.toLowerCase().includes(term)
    );
  });

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  openCreateModal() {
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
    this.resetNewAppointment();
  }

  updateNewAppointmentField(field: keyof Omit<AppointmentItem, 'id'>, event: Event) {
    const input = event.target as HTMLInputElement | HTMLSelectElement;

    this.newAppointment.update((appointment) => ({
      ...appointment,
      [field]: input.value,
    }));
  }

  createAppointment() {
    const appointment = this.newAppointment();

    if (!appointment.petName || !appointment.ownerName || !appointment.date || !appointment.time) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const nextId =
      this.appointments().length > 0
        ? Math.max(...this.appointments().map((appointment) => appointment.id)) + 1
        : 1;

    this.appointments.update((items) => [
      ...items,
      {
        ...appointment,
        id: nextId,
      },
    ]);

    this.closeCreateModal();
  }

  openEditModal(appointment: AppointmentItem) {
    this.editingAppointmentId.set(appointment.id);
    this.editAppointment.set({ ...appointment });
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editingAppointmentId.set(null);
    this.resetEditAppointment();
  }

  updateEditAppointmentField(field: keyof Omit<AppointmentItem, 'id'>, event: Event) {
    const input = event.target as HTMLInputElement | HTMLSelectElement;

    this.editAppointment.update((appointment) => ({
      ...appointment,
      [field]: input.value,
    }));
  }

  saveEditedAppointment() {
    const appointmentId = this.editingAppointmentId();
    const appointment = this.editAppointment();

    if (appointmentId === null) {
      return;
    }

    if (!appointment.petName || !appointment.ownerName || !appointment.date || !appointment.time) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    this.appointments.update((items) =>
      items.map((item) =>
        item.id === appointmentId
          ? {
              ...item,
              ...appointment,
            }
          : item
      )
    );

    this.closeEditModal();
  }

  deleteAppointment(id: number) {
    const confirmar = confirm('Tem certeza que deseja excluir este agendamento?');

    if (!confirmar) {
      return;
    }

    this.appointments.update((items) => items.filter((appointment) => appointment.id !== id));
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Confirmado':
        return 'bg-green-100 text-green-700';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-700';
      case 'Cancelado':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  }

  private resetNewAppointment() {
    this.newAppointment.set({
      id: 0,
      petName: '',
      ownerName: '',
      date: '',
      time: '',
      type: 'Consulta',
      status: 'Confirmado',
    });
  }

  private resetEditAppointment() {
    this.editAppointment.set({
      id: 0,
      petName: '',
      ownerName: '',
      date: '',
      time: '',
      type: 'Consulta',
      status: 'Confirmado',
    });
  }
}
