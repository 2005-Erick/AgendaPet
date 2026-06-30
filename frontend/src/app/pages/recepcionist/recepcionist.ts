import { Component, signal, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  type AbstractControl,
} from '@angular/forms';
import { iUser } from '../../models/users-model';
import { UsersService } from '../../services/users-service';
import { PetsService, PetCreateDTO } from '../../services/pets-service';
import { AppointmentsService } from '../../services/appointments-service';
import { DoctorsServices } from '../../services/doctors-service';
import { DoctorResponseDTO } from '../../models/DTO/doctor-response-DTO';
import { UserResponseDTO, RoleEnum } from '../../models/DTO/user-response-DTO';
import {
  AppointmentResponseDTO,
  AppointmentTypes,
  PaymentStatus,
} from '../../models/DTO/appointment-response-DTO';
import { PetGenderEnum, PetResponseDTO, PetSpecies } from '../../models/DTO/pet-response-DTO';

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
  private doctorsService = inject(DoctorsServices);

  doctors: DoctorResponseDTO[] = [];
  users: UserResponseDTO[] = [];
  tutors: UserResponseDTO[] = [];
  pets: PetResponseDTO[] = [];
  appointments: AppointmentResponseDTO[] = [];

  appointmentTypes = AppointmentTypes;
  paymentStatus = PaymentStatus;

  petsSpecies = PetSpecies;
  petGenderEnum = PetGenderEnum;

  appointmentForm = new FormGroup({
    pet_id: new FormControl('', [Validators.required]),
    doctor_id: new FormControl('', [Validators.required]),
    type: new FormControl<AppointmentTypes | null>(null, [Validators.required]),
    scheduled_at: new FormControl('', [Validators.required]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    note: new FormControl('', [Validators.maxLength(300)]),
  });

  petForm = new FormGroup({
    tutor_id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    species: new FormControl<PetSpecies | null>(null, [Validators.required]),
    breed: new FormControl('', [Validators.required]),
    weight: new FormControl<number | null>(null, [Validators.required, Validators.min(0.1)]),
    birthday: new FormControl('', [Validators.required]),
    photoUrl: new FormControl(''),
    description: new FormControl('', [Validators.required]),
    gender: new FormControl<PetGenderEnum | null>(null, [Validators.required]),
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

  petMessage = signal<string | null>(null);
  petMessageType = signal<'success' | 'error' | null>(null);

  personMessage = signal<string | null>(null);
  personMessageType = signal<'success' | 'error' | null>(null);

  showConfirmationModal = signal(false);
  confirmationCode = signal('');

  ngOnInit() {
    this.initDoctors();
    this.initAppointment();
    this.initTutors();
    this.initPets();
  }

  private initDoctors() {
    this.doctorsService.getDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
      },
      error: (err) => {
        console.error('Erro ao carregar médicos', err);
      },
    });
  }

  private initAppointment() {
    this.appointmentsService.getAppointmentsResponseDTO().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
      },
      error: (err) => {
        console.error('Erro ao carregar agendamentos', err);
      },
    });
  }

  private initTutors() {
    this.userService.getUsersResponseDTO().subscribe({
      next: (users) => {
        this.users = users;
        this.tutors = users.filter((user) => user.roles.includes(RoleEnum.TUTOR));
      },
      error: (err) => {
        console.error('Erro ao carregar tutores', err);
      },
    });
  }

  private initPets() {
    this.petsService.getPetsResponseDTO().subscribe({
      next: (pets) => {
        this.pets = pets;
      },
      error: (err) => {
        console.error('Erro ao carregar pets', err);
      },
    });
  }

  getAppointmentFieldFeedback(
    fieldName: 'pet_id' | 'doctor_id' | 'type' | 'scheduled_at' | 'price' | 'note',
  ) {
    const messages = {
      pet_id: 'Selecione o pet.',
      doctor_id: 'Selecione um veterinário.',
      type: 'Selecione o tipo de atendimento.',
      scheduled_at: 'Escolha a data e hora.',
      price: 'Informe o preço do serviço.',
      note: 'A observação deve ter no máximo 300 caracteres.',
    };

    return this.getFieldFeedback(this.appointmentForm.get(fieldName), messages[fieldName]);
  }

  getPetFieldFeedback(
    fieldName:
      | 'tutor_id'
      | 'name'
      | 'species'
      | 'breed'
      | 'weight'
      | 'birthday'
      | 'photoUrl'
      | 'description'
      | 'gender',
  ) {
    const messages = {
      tutor_id: 'Selecione o tutor responsável.',
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

  getPersonFieldFeedback(
    fieldName: 'fullName' | 'cpf' | 'phone' | 'birthday' | 'email' | 'password' | 'gender',
  ) {
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

    const formValues = this.appointmentForm.value;

    this.appointmentsService
      .registerAppointment({
        pet_id: formValues.pet_id!,
        doctor_id: formValues.doctor_id!,
        scheduled_at: formValues.scheduled_at!,
        type: formValues.type!,
        price: Number(formValues.price!),
        paymentStatus: PaymentStatus.PENDING,
        note: formValues.note || undefined,
      })
      .subscribe({
        next: () => {
          this.appointmentMessage.set('Agendamento salvo com sucesso!');
          this.appointmentMessageType.set('success');

          this.appointmentForm.reset({
            pet_id: '',
            doctor_id: '',
            type: null,
            scheduled_at: '',
            price: null,
            note: '',
          });

          this.initAppointment();
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

    const formValues = this.petForm.value;

    const dto: PetCreateDTO = {
      tutor_id: formValues.tutor_id!,
      name: formValues.name!,
      weight: Number(formValues.weight!),
      breed: formValues.breed!,
      species: formValues.species!,
      birthday: formValues.birthday!,
      avatarUrl: formValues.photoUrl || undefined,
      description: formValues.description || undefined,
      gender: formValues.gender!,
    };

    this.petsService.registerPet(dto).subscribe({
      next: () => {
        this.petMessage.set('Animal cadastrado com sucesso!');
        this.petMessageType.set('success');
        this.petForm.reset();
        this.initPets();
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
        this.personMessage.set(
          'Cadastro realizado. Verifique o código de confirmação enviado ao e-mail.',
        );
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
        this.initTutors();
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
