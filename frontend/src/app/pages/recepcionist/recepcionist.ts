import { Component, signal, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule, type AbstractControl } from '@angular/forms';
import { iUser } from '../../models/users-model';
import { UsersService } from '../../services/users-service';
import { iPets, pets_species } from '../../models/pets-model';
import { PetsService } from '../../services/pets-service';
import { AppointmentsService } from '../../services/appointments-service';

@Component({
  selector: 'app-recepcionist',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './recepcionist.html',
  styleUrl: './recepcionist.css',
})
export class Recepcionist {
  private userService = inject(UsersService);
  private petsService = inject(PetsService);
  private appointmentsService = inject(AppointmentsService);

  appointmentForm = new FormGroup({
    personName: new FormControl('', [Validators.required]),
    petName: new FormControl('', [Validators.required]),
    service: new FormControl('Consulta', [Validators.required]),
    dateTime: new FormControl('', [Validators.required]),
    doctor: new FormControl('Dra. Ana Paula', [Validators.required]),
    note: new FormControl(''),
  });

  petForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    species: new FormControl<pets_species | null>(null, [Validators.required]),
    breed: new FormControl('', [Validators.required]),
    weight: new FormControl<number | null>(null, [Validators.required, Validators.min(0.1)]),
    birthday: new FormControl('', [Validators.required]),
    photoUrl: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    gender: new FormControl<'MALE' | 'FEMALE' | null>(null, [Validators.required]),
  });

  personForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    cpf: new FormControl('', [Validators.required, Validators.pattern(/^\d{11}$/)]),
    phone: new FormControl('', [Validators.required]),
    birthday: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    gender: new FormControl<'MALE' | 'FEMALE' | null>(null, [Validators.required]),
  });

  appointmentMessage = signal<string | null>(null);
  appointmentMessageType = signal<'success' | 'error' | null>(null);

  petsSpecies = pets_species;

  petMessage = signal<string | null>(null);
  petMessageType = signal<'success' | 'error' | null>(null);

  personMessage = signal<string | null>(null);
  personMessageType = signal<'success' | 'error' | null>(null);

  showConfirmationModal = signal(false);
  confirmationCode = signal('');

  getAppointmentFieldFeedback(fieldName: 'personName' | 'petName' | 'service' | 'dateTime' | 'doctor' | 'note') {
    const messages = {
      personName: 'Informe o nome do cliente.',
      petName: 'Informe o nome do animal.',
      service: 'Selecione um serviço.',
      dateTime: 'Escolha a data e hora.',
      doctor: 'Selecione um veterinário.',
      note: ''
    };

    return this.getFieldFeedback(this.appointmentForm.get(fieldName), messages[fieldName]);
  }

  getPetFieldFeedback(fieldName: 'name' | 'species' | 'breed' | 'weight' | 'birthday' | 'photoUrl' | 'description' | 'gender') {
    const messages = {
      name: 'Informe o nome do pet.',
      species: 'Informe a espécie.',
      breed: 'Informe a raça.',
      weight: 'Informe o peso.',
      birthday: 'Informe a data de nascimento.',
      photoUrl: 'Informe a URL da foto.',
      description: 'Informe a descrição do pet.',
      gender: 'Selecione o gênero do pet.',
    };

    return this.getFieldFeedback(this.petForm.get(fieldName), messages[fieldName]);
  }

  getPersonFieldFeedback(fieldName: 'fullName' | 'cpf' | 'phone' | 'birthday' | 'email' | 'password' | 'gender') {
    const messages = {
      fullName: 'Informe o nome completo.',
      cpf: 'Informe um CPF válido com 11 números.',
      phone: 'Informe o telefone.',
      birthday: 'Informe a data de nascimento.',
      email: 'Informe um e-mail válido.',
      password: 'A senha precisa ter pelo menos 6 caracteres.',
      gender: 'Selecione o gênero.',
    };

    return this.getFieldFeedback(this.personForm.get(fieldName), messages[fieldName]);
  }

  onAppointmentSubmit() {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      this.appointmentMessage.set('Preencha os campos obrigatórios para salvar o agendamento.');
      this.appointmentMessageType.set('error');
      return;
    }

    const iAppointment = {
      personName: this.appointmentForm.value.personName,
      petName: this.appointmentForm.value.petName,
      service: this.appointmentForm.value.service,
      dateTime: this.appointmentForm.value.dateTime,
      doctor: this.appointmentForm.value.doctor,
      note: this.appointmentForm.value.note,
    };

    this.appointmentsService.registerAppointment(iAppointment).subscribe({
      next: () => {
        this.appointmentMessage.set('Agendamento salvo com sucesso!');
        this.appointmentMessageType.set('success');
        this.appointmentForm.reset();
      },
      error: (err) => {
        this.appointmentMessage.set('Erro ao salvar o agendamento.');
        this.appointmentMessageType.set('error');
        console.error(err);
      },
    });
  }

  onPetSubmit() {
    if (this.petForm.invalid) {
      this.petForm.markAllAsTouched();
      this.petMessage.set('Preencha todos os campos para cadastrar o animal.');
      this.petMessageType.set('error');
      return;
    }

    const dto: iPets = {
      name: this.petForm.value.name!,
      weight: Number(this.petForm.value.weight!!),
      breed: this.petForm.value.breed!,
      species: this.petForm.value.species ?? pets_species.OTHER,
      birthday: new Date(this.petForm.value.birthday!),
      description: this.petForm.value.description!,
      gender: this.petForm.value.gender!,
    };

    this.petsService.registerPet(dto).subscribe({
      next: () => {
        this.petMessage.set('Animal cadastrado com sucesso!');
        this.petMessageType.set('success');
        this.petForm.reset();
      },
      error: (err) => {
        this.petMessage.set('Erro ao criar pet.');
        this.petMessageType.set('error');
        console.error(err);
      },
    });
  }

  onPersonSubmit() {
    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched();
      this.personMessage.set('Preencha todos os campos para cadastrar a pessoa.');
      this.personMessageType.set('error');
      return;
    }

    this.confirmationCode.set('');

    const dto: iUser = {
      name: this.personForm.value.fullName!,
      email: this.personForm.value.email!,
      password: this.personForm.value.password!,
      cpf: this.personForm.value.cpf!,
      birthday: this.personForm.value.birthday!,
      phone: this.personForm.value.phone!,
      gender: this.personForm.value.gender!,
    };

    this.userService.registerUser(dto).subscribe({
      next: () => {
        this.personMessage.set('Cadastro realizado. Verifique o código de confirmação enviado ao e-mail.');
        this.personMessageType.set('success');
        this.showConfirmationModal.set(true);
      },
      error: (err) => {
        this.personMessage.set('Erro ao criar usuário.');
        this.personMessageType.set('error');
        console.error(err);
      },
    });
  }

  closeConfirmationModal() {
    this.showConfirmationModal.set(false);
  }

  confirmCode() {
    const code = this.confirmationCode().trim();
    const email = this.personForm.value.email;

    if (!email || !code) {
      return;
    }

    this.userService.confirmRegister(email, code).subscribe({
      next: () => {
        this.showConfirmationModal.set(false);
        this.confirmationCode.set('');
        this.personForm.reset();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  private getFieldFeedback(control: AbstractControl | null, defaultMessage: string) {
    if (!control || (!control.touched && !control.dirty)) {
      return null;
    }

    if (control.hasError('required')) {
      return { kind: 'error' as const, message: defaultMessage };
    }

    if (control.hasError('email')) {
      return { kind: 'error' as const, message: 'E-mail inválido.' };
    }

    if (control.hasError('pattern')) {
      return { kind: 'error' as const, message: 'CPF inválido. Digite 11 números.' };
    }

    if (control.hasError('min')) {
      return { kind: 'error' as const, message: 'O valor não pode ser menor que o mínimo.' };
    }

    if (control.hasError('max')) {
      return { kind: 'error' as const, message: 'O valor acima do limite permitido.' };
    }

    if (control.hasError('minlength')) {
      return { kind: 'error' as const, message: 'A senha precisa ter pelo menos 6 caracteres.' };
    }

    return { kind: 'success' as const, message: '' };
  }
}

