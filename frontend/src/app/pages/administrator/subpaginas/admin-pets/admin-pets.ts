import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
} from '@angular/forms';
import { PetsService } from '../../../../services/pets-service';
import { UsersService } from '../../../../services/users-service';
import { PetGenderEnum, PetResponseDTO, PetSpecies } from '../../../../models/DTO/pet-response-DTO';
import { RoleEnum, UserResponseDTO } from '../../../../models/DTO/user-response-DTO';

@Component({
  selector: 'app-admin-pets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-pets.html',
  styleUrls: ['./admin-pets.css'],
})
export class AdminPets implements OnInit {
  private petsService = inject(PetsService);
  private usersService = inject(UsersService);

  pets = signal<PetResponseDTO[]>([]);
  tutors = signal<UserResponseDTO[]>([]);
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
  editingPetId = signal<string | null>(null);

  get PetSpecies() {
    return PetSpecies;
  }

  get PetGenderEnum() {
    return PetGenderEnum;
  }

  createForm = new FormGroup({
    tutor_id: new FormControl('', [Validators.required]),

    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/),
    ]),

    species: new FormControl<PetSpecies | null>(null, [Validators.required]),

    breed: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),

    weight: new FormControl<number | null>(null, [Validators.required, Validators.min(0.1)]),

    birthday: new FormControl('', [Validators.required]),

    gender: new FormControl<PetGenderEnum | null>(null, [Validators.required]),

    avatarUrl: new FormControl(''),

    description: new FormControl('', [Validators.maxLength(300)]),
  });

  editForm = new FormGroup({
    tutor_id: new FormControl('', [Validators.required]),

    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/),
    ]),

    species: new FormControl<PetSpecies | null>(null, [Validators.required]),

    breed: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),

    weight: new FormControl<number | null>(null, [Validators.required, Validators.min(0.1)]),

    birthday: new FormControl('', [Validators.required]),

    gender: new FormControl<PetGenderEnum | null>(null, [Validators.required]),

    avatarUrl: new FormControl(''),

    description: new FormControl('', [Validators.maxLength(300)]),
  });

  filteredPets = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) {
      return this.pets();
    }

    return this.pets().filter(
      (pet) =>
        pet.name.toLowerCase().includes(term) ||
        pet.breed.toLowerCase().includes(term) ||
        pet.tutor_name.toLowerCase().includes(term) ||
        this.formatSpecies(pet.species).toLowerCase().includes(term),
    );
  });

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.isLoading.set(true);
    this.listMessage.set(null);

    this.petsService.getPetsResponseDTO().subscribe({
      next: (pets) => {
        this.pets.set(pets);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar pets', err);
        this.listMessage.set('Erro ao carregar os pets.');
        this.listMessageType.set('error');
        this.isLoading.set(false);
      },
    });

    this.usersService.getUsersResponseDTO().subscribe({
      next: (users) => {
        const onlyTutors = users.filter((user) => user.roles.includes(RoleEnum.TUTOR));
        this.tutors.set(onlyTutors);
      },
      error: (err) => {
        console.error('Erro ao carregar tutores', err);
      },
    });
  }

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  getCreateFieldFeedback(
    fieldName:
      | 'tutor_id'
      | 'name'
      | 'species'
      | 'breed'
      | 'weight'
      | 'birthday'
      | 'gender'
      | 'avatarUrl'
      | 'description',
  ) {
    const messages: Record<string, string> = {
      tutor_id: 'Selecione o tutor responsável.',
      name: 'Nome inválido. Use apenas letras e espaços.',
      species: 'Selecione a espécie.',
      breed: 'Informe a raça com pelo menos 3 caracteres.',
      weight: 'Informe um peso válido maior que 0.',
      birthday: 'Informe a data de nascimento.',
      gender: 'Selecione o gênero.',
      avatarUrl: 'URL inválida.',
      description: 'A descrição deve ter no máximo 300 caracteres.',
    };

    return this.getFieldFeedback(
      this.createForm.get(fieldName),
      messages[fieldName] || 'Campo inválido.',
    );
  }

  getEditFieldFeedback(
    fieldName:
      | 'tutor_id'
      | 'name'
      | 'species'
      | 'breed'
      | 'weight'
      | 'birthday'
      | 'gender'
      | 'avatarUrl'
      | 'description',
  ) {
    const messages: Record<string, string> = {
      tutor_id: 'Selecione o tutor responsável.',
      name: 'Nome inválido. Use apenas letras e espaços.',
      species: 'Selecione a espécie.',
      breed: 'Informe a raça com pelo menos 3 caracteres.',
      weight: 'Informe um peso válido maior que 0.',
      birthday: 'Informe a data de nascimento.',
      gender: 'Selecione o gênero.',
      avatarUrl: 'URL inválida.',
      description: 'A descrição deve ter no máximo 300 caracteres.',
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

  createPet() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.createMessage.set('Preencha todos os campos obrigatórios corretamente.');
      this.createMessageType.set('error');
      return;
    }

    const formValues = this.createForm.value;

    this.petsService
      .createPet({
        tutor_id: formValues.tutor_id!,
        name: formValues.name!,
        weight: Number(formValues.weight!),
        avatarUrl: formValues.avatarUrl || undefined,
        gender: formValues.gender!,
        birthday: formValues.birthday!,
        species: formValues.species!,
        breed: formValues.breed!,
        description: formValues.description || undefined,
      })
      .subscribe({
        next: () => {
          this.createMessage.set('Pet cadastrado com sucesso.');
          this.createMessageType.set('success');
          this.loadData();

          setTimeout(() => {
            this.closeCreateModal();
          }, 1200);
        },
        error: (err) => {
          console.error('Erro ao cadastrar pet', err);
          this.createMessage.set('Erro ao cadastrar pet. Verifique os dados.');
          this.createMessageType.set('error');
        },
      });
  }

  openEditModal(pet: PetResponseDTO) {
    this.editingPetId.set(pet.id);

    this.editForm.patchValue({
      tutor_id: pet.tutor_id,
      name: pet.name,
      weight: pet.weight,
      breed: pet.breed,
      species: pet.species,
      birthday: pet.birthday,
      gender: pet.gender,
      avatarUrl: pet.avatarUrl || '',
      description: pet.description || '',
    });

    this.editMessage.set(null);
    this.editMessageType.set(null);
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editingPetId.set(null);
    this.resetEditForm();
  }

  saveEditedPet() {
    const petId = this.editingPetId();

    if (!petId) {
      return;
    }

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.editMessage.set('Preencha todos os campos obrigatórios corretamente.');
      this.editMessageType.set('error');
      return;
    }

    const formValues = this.editForm.value;

    this.petsService
      .updatePet(petId, {
        tutor_id: formValues.tutor_id!,
        name: formValues.name!,
        weight: Number(formValues.weight!),
        avatarUrl: formValues.avatarUrl || undefined,
        gender: formValues.gender!,
        birthday: formValues.birthday!,
        species: formValues.species!,
        breed: formValues.breed!,
        description: formValues.description || undefined,
      })
      .subscribe({
        next: () => {
          this.editMessage.set('Pet atualizado com sucesso.');
          this.editMessageType.set('success');
          this.loadData();

          setTimeout(() => {
            this.closeEditModal();
          }, 1000);
        },
        error: (err) => {
          console.error('Erro ao atualizar pet', err);
          this.editMessage.set('Erro ao atualizar pet.');
          this.editMessageType.set('error');
        },
      });
  }

  deletePet(id: string) {
    if (!confirm('Tem certeza que deseja excluir este pet?')) {
      return;
    }

    this.petsService.deletePet(id).subscribe({
      next: () => {
        this.listMessage.set('Pet excluído com sucesso.');
        this.listMessageType.set('success');
        this.loadData();
      },
      error: (err) => {
        console.error('Erro ao excluir pet', err);
        this.listMessage.set('Erro ao excluir pet.');
        this.listMessageType.set('error');
      },
    });
  }

  formatSpecies(species: PetSpecies): string {
    const map: Record<PetSpecies, string> = {
      [PetSpecies.CAT]: 'Gato',
      [PetSpecies.DOG]: 'Cachorro',
      [PetSpecies.BIRD]: 'Pássaro',
      [PetSpecies.RODENT]: 'Roedor',
      [PetSpecies.REPTILE]: 'Réptil',
      [PetSpecies.OTHER]: 'Outro',
    };

    return map[species] || 'Desconhecido';
  }

  formatGender(gender: PetGenderEnum): string {
    return gender === PetGenderEnum.MALE ? 'Macho' : 'Fêmea';
  }

  private resetCreateForm() {
    this.createForm.reset({
      tutor_id: '',
      name: '',
      species: null,
      breed: '',
      weight: null,
      birthday: '',
      gender: null,
      avatarUrl: '',
      description: '',
    });
  }

  private resetEditForm() {
    this.editForm.reset({
      tutor_id: '',
      name: '',
      species: null,
      breed: '',
      weight: null,
      birthday: '',
      gender: null,
      avatarUrl: '',
      description: '',
    });
  }
}
