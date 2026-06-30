import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../../services/users-service';
import { MatIconModule } from '@angular/material/icon';
import { iUser } from '../../../models/users-model';

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
    cpf: new FormControl('', [Validators.required, Validators.pattern(/^\d{11}$/)]),
    phone: new FormControl('', [Validators.required]),
    birthday: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    gender: new FormControl<'MALE' | 'FEMALE' | null>(null, [Validators.required]),
  });

  errorMessage = signal<string | null>(null);
  errorMessageType = signal<'success' | 'error' | null>(null);

  showConfirmationModal = signal(false);
  confirmationCode = signal('');

  isLoading = signal(false);

  private router = inject(Router);

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

    if (fieldName === 'password' && control.hasError('minlength')) {
      return {
        kind: 'error' as const,
        message: 'A senha precisa ter pelo menos 6 caracteres.',
      };
    }

    if (fieldName === 'cpf' && control.hasError('pattern')) {
      return {
        kind: 'error' as const,
        message: 'CPF inválido. Digite apenas 11 números.',
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
      cpf: this.registrationForm.value.cpf!,
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
