import { Component, computed, signal } from '@angular/core';
import { Pet } from '../../../../models/pet.model';

@Component({
  selector: 'app-admin-pets',
  imports: [],
  templateUrl: './admin-pets.html',
  styleUrl: './admin-pets.css',
})
export class AdminPets {
  searchTerm = signal('');
  showCreateModal = signal(false);
  showEditModal = signal(false);
  editingPetId = signal<number | null>(null);

  newPet = signal<Pet>({
    id: 0,
    nome: '',
    imagem: '',
    raca: '',
    idade: 0,
    status: 'Ativo',
    proximo: '',
  });

  editPet = signal<Pet>({
    id: 0,
    nome: '',
    imagem: '',
    raca: '',
    idade: 0,
    status: 'Ativo',
    proximo: '',
  });

  pets = signal<Pet[]>([
    {
      id: 1,
      nome: 'Luna',
      imagem:
        'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80',
      raca: 'Labrador',
      idade: 5,
      status: 'Ativo',
      proximo: '05/07',
    },
    {
      id: 2,
      nome: 'Thor',
      imagem:
        'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=600&q=80',
      raca: 'Bulldog',
      idade: 3,
      status: 'Em tratamento',
      proximo: '12/07',
    },
  ]);

  filteredPets = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) {
      return this.pets();
    }

    return this.pets().filter(
      (pet) =>
        pet.nome.toLowerCase().includes(term) ||
        pet.raca.toLowerCase().includes(term)
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
    this.resetNewPet();
  }

  updateNewPetField(field: keyof Omit<Pet, 'id'>, event: Event) {
    const input = event.target as HTMLInputElement | HTMLSelectElement;

    this.newPet.update((pet) => ({
      ...pet,
      [field]: field === 'idade' ? Number(input.value) : input.value,
    }));
  }

  createPet() {
    const pet = this.newPet();

    if (!pet.nome || !pet.raca || !pet.proximo) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const nextId =
      this.pets().length > 0
        ? Math.max(...this.pets().map((pet) => pet.id)) + 1
        : 1;

    this.pets.update((pets) => [
      ...pets,
      {
        ...pet,
        id: nextId,
        imagem: pet.imagem || 'https://placehold.co/600x400?text=Pet',
        idade: pet.idade || 0,
        status: pet.status || 'Ativo',
      },
    ]);

    this.closeCreateModal();
  }

  openEditModal(pet: Pet) {
    this.editingPetId.set(pet.id);
    this.editPet.set({ ...pet });
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editingPetId.set(null);
    this.resetEditPet();
  }

  updateEditPetField(field: keyof Omit<Pet, 'id'>, event: Event) {
    const input = event.target as HTMLInputElement | HTMLSelectElement;

    this.editPet.update((pet) => ({
      ...pet,
      [field]: field === 'idade' ? Number(input.value) : input.value,
    }));
  }

  saveEditedPet() {
    const petId = this.editingPetId();
    const pet = this.editPet();

    if (petId === null) {
      return;
    }

    if (!pet.nome || !pet.raca || !pet.proximo) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    this.pets.update((pets) =>
      pets.map((item) =>
        item.id === petId
          ? {
              ...item,
              ...pet,
              imagem: pet.imagem || 'https://placehold.co/600x400?text=Pet',
              idade: pet.idade || 0,
              status: pet.status || 'Ativo',
            }
          : item
      )
    );

    this.closeEditModal();
  }

  deletePet(id: number) {
    const confirmar = confirm('Tem certeza que deseja excluir este pet?');

    if (!confirmar) {
      return;
    }

    this.pets.update((pets) => pets.filter((pet) => pet.id !== id));
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-700';
      case 'Em tratamento':
        return 'bg-yellow-100 text-yellow-700';
      case 'Inativo':
        return 'bg-gray-200 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  }

  private resetNewPet() {
    this.newPet.set({
      id: 0,
      nome: '',
      imagem: '',
      raca: '',
      idade: 0,
      status: 'Ativo',
      proximo: '',
    });
  }

  private resetEditPet() {
    this.editPet.set({
      id: 0,
      nome: '',
      imagem: '',
      raca: '',
      idade: 0,
      status: 'Ativo',
      proximo: '',
    });
  }
}
