import { Component, computed, signal } from '@angular/core';

type Doctor = {
  id: number;
  name: string;
  crmv: string;
  avatarUrl: string;
  specialty: string;
  appointmentsThisWeek: number;
  availability: string;
  status: string;
};

@Component({
  selector: 'app-admin-doctors',
  imports: [],
  templateUrl: './admin-doctors.html',
  styleUrl: './admin-doctors.css',
})
export class AdminDoctors {
  searchTerm = signal('');
  showCreateModal = signal(false);
  showEditModal = signal(false);
  editingDoctorId = signal<number | null>(null);
  showProfileModal = signal(false);
  selectedDoctor = signal<Doctor | null>(null);

  newDoctor = signal({
    name: '',
    crmv: '',
    avatarUrl: '',
    specialty: '',
    appointmentsThisWeek: 0,
    availability: '',
    status: 'Ativo',
  });

  editDoctor = signal({
    name: '',
    crmv: '',
    avatarUrl: '',
    specialty: '',
    appointmentsThisWeek: 0,
    availability: '',
    status: 'Ativo',
  });

  doctors = signal<Doctor[]>([
    {
      id: 1,
      name: 'Dra. Mariana Silva',
      crmv: '1234-PB',
      avatarUrl:
        'https://plus.unsplash.com/premium_photo-1661580574627-9211124e5c3f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      specialty: 'Clínica Geral',
      appointmentsThisWeek: 8,
      availability: 'Hoje',
      status: 'Ativo',
    },
    {
      id: 2,
      name: 'Dr. Rafael Costa',
      crmv: '5678-PB',
      avatarUrl:
        'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      specialty: 'Cirurgia',
      appointmentsThisWeek: 5,
      availability: 'Amanhã',
      status: 'Ativo',
    },
    {
      id: 3,
      name: 'Dra. Fernanda Oliveira',
      crmv: '9012-PB',
      avatarUrl:
        'https://plus.unsplash.com/premium_photo-1661766718556-13c2efac1388?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      specialty: 'Dermatologia Veterinária',
      appointmentsThisWeek: 11,
      availability: 'Disponível',
      status: 'Ativo',
    },
  ]);

  filteredDoctors = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) {
      return this.doctors();
    }

    return this.doctors().filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(term) || doctor.crmv.toLowerCase().includes(term),
    );
  });

  availableDoctors = computed(
    () => this.doctors().filter((doctor) => doctor.status === 'Ativo').length,
  );

  busyDoctors = computed(
    () => this.doctors().filter((doctor) => doctor.availability === 'Agenda cheia').length,
  );

  weeklyAppointments = computed(() =>
    this.doctors().reduce((total, doctor) => total + doctor.appointmentsThisWeek, 0),
  );

  availabilityStatus = computed(() => {
    const hasAvailable = this.doctors().some(
      (doctor) => doctor.availability === 'Hoje' || doctor.availability === 'Disponível',
    );

    return hasAvailable ? 'Ativa' : 'Limitada';
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
    this.resetNewDoctor();
  }

  updateNewDoctorField(field: keyof Omit<Doctor, 'id'>, event: Event) {
    const input = event.target as HTMLInputElement | HTMLSelectElement;

    this.newDoctor.update((doctor) => ({
      ...doctor,
      [field]: field === 'appointmentsThisWeek' ? Number(input.value) : input.value,
    }));
  }

  createDoctor() {
    const doctor = this.newDoctor();

    if (!doctor.name || !doctor.crmv || !doctor.specialty || !doctor.availability) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const nextId =
      this.doctors().length > 0 ? Math.max(...this.doctors().map((doctor) => doctor.id)) + 1 : 1;

    this.doctors.update((doctors) => [
      ...doctors,
      {
        id: nextId,
        name: doctor.name,
        crmv: doctor.crmv,
        avatarUrl: doctor.avatarUrl || 'https://placehold.co/600x400?text=Médico',
        specialty: doctor.specialty,
        appointmentsThisWeek: doctor.appointmentsThisWeek,
        availability: doctor.availability,
        status: doctor.status || 'Ativo',
      },
    ]);

    this.closeCreateModal();
  }

  openEditModal(doctor: Doctor) {
    this.editingDoctorId.set(doctor.id);

    this.editDoctor.set({
      name: doctor.name,
      crmv: doctor.crmv,
      avatarUrl: doctor.avatarUrl,
      specialty: doctor.specialty,
      appointmentsThisWeek: doctor.appointmentsThisWeek,
      availability: doctor.availability,
      status: doctor.status,
    });

    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editingDoctorId.set(null);
    this.resetEditDoctor();
  }

  updateEditDoctorField(field: keyof Omit<Doctor, 'id'>, event: Event) {
    const input = event.target as HTMLInputElement | HTMLSelectElement;

    this.editDoctor.update((doctor) => ({
      ...doctor,
      [field]: field === 'appointmentsThisWeek' ? Number(input.value) : input.value,
    }));
  }

  saveEditedDoctor() {
    const doctorId = this.editingDoctorId();
    const editedDoctor = this.editDoctor();

    if (doctorId === null) {
      return;
    }

    if (
      !editedDoctor.name ||
      !editedDoctor.crmv ||
      !editedDoctor.specialty ||
      !editedDoctor.availability
    ) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    this.doctors.update((doctors) =>
      doctors.map((doctor) =>
        doctor.id === doctorId
          ? {
              ...doctor,
              name: editedDoctor.name,
              crmv: editedDoctor.crmv,
              avatarUrl: editedDoctor.avatarUrl || 'https://placehold.co/600x400?text=Médico',
              specialty: editedDoctor.specialty,
              appointmentsThisWeek: editedDoctor.appointmentsThisWeek,
              availability: editedDoctor.availability,
              status: editedDoctor.status,
            }
          : doctor,
      ),
    );

    this.closeEditModal();
  }

  deleteDoctor(id: number) {
    const confirmar = confirm('Tem certeza que deseja excluir este médico?');

    if (!confirmar) {
      return;
    }

    this.doctors.update((doctors) => doctors.filter((doctor) => doctor.id !== id));
  }
  openProfile(doctor: Doctor) {
    this.selectedDoctor.set(doctor);
    this.showProfileModal.set(true);
  }

  closeProfile() {
    this.selectedDoctor.set(null);
    this.showProfileModal.set(false);
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-700';
      case 'Inativo':
        return 'bg-gray-200 text-gray-700';
      case 'Férias':
        return 'bg-yellow-100 text-yellow-700';
      case 'Afastado':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  }

  private resetNewDoctor() {
    this.newDoctor.set({
      name: '',
      crmv: '',
      avatarUrl: '',
      specialty: '',
      appointmentsThisWeek: 0,
      availability: '',
      status: 'Ativo',
    });
  }

  private resetEditDoctor() {
    this.editDoctor.set({
      name: '',
      crmv: '',
      avatarUrl: '',
      specialty: '',
      appointmentsThisWeek: 0,
      availability: '',
      status: 'Ativo',
    });
  }
}
