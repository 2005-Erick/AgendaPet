import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../../services/users-service';
import { MatIconModule } from '@angular/material/icon';
import { iUser } from '../../../models/users-model';

function ageValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  let dateStr = control.value;
  let year, month, day;

  if (typeof dateStr === 'string') {
    const ymd = dateStr.match(/^(\d{4})[\/\-](\d{2})[\/\-](\d{2})$/);
    if (ymd) {
      year = parseInt(ymd[1], 10);
      month = parseInt(ymd[2], 10) - 1;
      day = parseInt(ymd[3], 10);
    } else {
      const dmy = dateStr.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
      if (dmy) {
        year = parseInt(dmy[3], 10);
        month = parseInt(dmy[2], 10) - 1;
        day = parseInt(dmy[1], 10);
      }
    }
  }

  let birthDate;
  if (year !== undefined && month !== undefined && day !== undefined) {
    birthDate = new Date(year, month, day, 12, 0, 0);
  } else {
    if (typeof dateStr === 'string' && dateStr.length === 10) {
      dateStr += 'T12:00:00';
    }
    birthDate = new Date(dateStr);
  }

  if (isNaN(birthDate.getTime())) return { invalidDate: true };

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age < 18 ? { underage: true } : null;
}

function normalizeCpf(value: string): string {
  return value.replace(/\D/g, '');
}

function cpfValidator(control: AbstractControl): ValidationErrors | null {
  const rawValue = control.value;

  if (!rawValue) {
    return null;
  }

  const cpf = normalizeCpf(String(rawValue));

  if (cpf.length !== 11) {
    return { cpfInvalid: true };
  }

  if (/^(\d)\1{10}$/.test(cpf)) {
    return { cpfInvalid: true };
  }

  const digits = cpf.split('').map((digit) => Number(digit));

  const firstCheckDigit = digits
    .slice(0, 9)
    .reduce((sum, digit, index) => sum + digit * (10 - index), 0);
  const firstVerifier = 11 - (firstCheckDigit % 11);
  const firstDigit = firstVerifier >= 10 ? 0 : firstVerifier;

  if (firstDigit !== digits[9]) {
    return { cpfInvalid: true };
  }

  const secondCheckDigit = digits
    .slice(0, 10)
    .reduce((sum, digit, index) => sum + digit * (11 - index), 0);
  const secondVerifier = 11 - (secondCheckDigit % 11);
  const secondDigit = secondVerifier >= 10 ? 0 : secondVerifier;

  return secondDigit !== digits[10] ? { cpfInvalid: true } : null;
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  private userService = inject(UsersService);

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    cpf: new FormControl('', [Validators.required, cpfValidator]),
    phone: new FormControl('', [Validators.required]),
    birthday: new FormControl('', [Validators.required, ageValidator]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(72),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).*$/),
    ]),
    gender: new FormControl<'MALE' | 'FEMALE' | null>(null, [Validators.required]),
  });

  errorMessage = signal<string | null>(null);
  errorMessageType = signal<'success' | 'error' | null>(null);

  showConfirmationModal = signal(false);
  confirmationCode = signal('');

  isLoading = signal(false);

  private router = inject(Router);

  constructor() {
    const user = this.userService.currentUser();
    if (user) {
      this.redirectByRole(user);
    }
  }

  private redirectByRole(user: any) {
    const roles = user.roles || [];
    if (roles.includes('ADMIN')) {
      this.router.navigate(['/admin-dashboard']);
    } else if (roles.includes('RECEPTIONIST')) {
      this.router.navigate(['/dashboard-recepcionist']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  getFieldFeedback(
    fieldName: 'name' | 'cpf' | 'phone' | 'birthday' | 'email' | 'password' | 'gender',
  ) {
    const control = this.registrationForm.get(fieldName);

    if (!control || (!control.touched && !control.dirty)) {
      return null;
    }

    if (control.hasError('required')) {
      const messages = {
        name: 'O nome é obrigatório.',
        cpf: 'O CPF é obrigatório.',
        phone: 'O telefone é obrigatório.',
        birthday: 'A data de nascimento é obrigatória.',
        email: 'O email é obrigatório.',
        password: 'A senha é obrigatória.',
        gender: 'O gênero é obrigatório.',
      };

      return {
        kind: 'error' as const,
        message: messages[fieldName],
      };
    }

    if (fieldName === 'email' && control.hasError('email')) {
      return {
        kind: 'error' as const,
        message: 'O email não está na forma correta.',
      };
    }

    if (fieldName === 'password') {
      if (control.hasError('minlength') || control.hasError('maxlength')) {
        return {
          kind: 'error' as const,
          message: 'A senha precisa ter entre 8 e 72 caracteres.',
        };
      }
      if (control.hasError('pattern')) {
        return {
          kind: 'error' as const,
          message: 'A senha deve conter maiúscula, minúscula, número e caractere especial.',
        };
      }
    }

    if (fieldName === 'birthday') {
      if (control.hasError('invalidDate')) {
        return {
          kind: 'error' as const,
          message: 'Data de nascimento inválida.',
        };
      }
      if (control.hasError('underage')) {
        return {
          kind: 'error' as const,
          message: 'Você deve ter pelo menos 18 anos para se cadastrar.',
        };
      }
    }

    if (fieldName === 'cpf' && control.hasError('cpfInvalid')) {
      return {
        kind: 'error' as const,
        message: 'CPF inválido.',
      };
    }

    return {
      kind: 'success' as const,
      message: 'OK.',
    };
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const dto: iUser = {
      name: this.registrationForm.value.name!,
      email: this.registrationForm.value.email!,
      password: this.registrationForm.value.password!,
      cpf: normalizeCpf(this.registrationForm.value.cpf!),
      birthday: this.registrationForm.value.birthday!,
      phone: this.registrationForm.value.phone!,
      gender: this.registrationForm.value.gender!,
    };

    this.userService.registerUser(dto).subscribe({
      next: () => {
        this.errorMessage.set(
          'Cadastro realizado. Verifique o código de confirmação enviado ao e-mail.',
        );
        this.errorMessageType.set('success');
        this.showConfirmationModal.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Não foi possível realizar o cadastro, tente novamente.');
        this.errorMessageType.set('error');
        this.isLoading.set(false);
        console.error(err);
      },
    });
  }

  confirmCode() {
    const code = this.confirmationCode().trim();
    const email = this.registrationForm.value.email;

    if (!email || !code) {
      return;
    }
    this.userService.confirmRegister(email, code).subscribe({
      next: () => {
        this.showConfirmationModal.set(false);
        this.confirmationCode.set('');
        this.registrationForm.reset();
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  closeConfirmationModal() {
    this.showConfirmationModal.set(false);
  }
}
