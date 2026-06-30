import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../../services/users-service';
import { RoleEnum, UserResponseDTO } from '../../../models/DTO/user-response-DTO';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private usersService = inject(UsersService);
  private router = inject(Router);

  showConfirmationModal = signal(false);
  confirmationCode = signal('');

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  getFieldFeedback(fieldName: 'email' | 'password') {
    const control = this.loginForm.get(fieldName);

    if (!control || (!control.touched && !control.dirty)) {
      return null;
    }

    if (control.hasError('required')) {
      return {
        kind: 'error' as const,
        message: fieldName === 'email' ? 'O email é obrigatório.' : 'A senha é obrigatória.',
      };
    }

    if (fieldName === 'email' && control.hasError('email')) {
      return {
        kind: 'error' as const,
        message: 'O email não está na forma correta.',
      };
    }

    return {
      kind: 'success' as const,
      message: fieldName === 'email' ? 'Email válido.' : 'Senha válida.',
    };
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;

    this.usersService.userlogin(email!, password!).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.showConfirmationModal.set(true);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
        this.errorMessage.set('E-mail ou senha inválidos.');
      },
    });
  }

  confirmCode() {
    const code = this.confirmationCode().trim();
    const email = this.loginForm.value.email;

    if (!email || !code) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.usersService.confirmLogin(email, code).subscribe({
      next: () => {
        this.usersService.getCurrentUser().subscribe({
          next: (user) => {
            this.isLoading.set(false);
            this.showConfirmationModal.set(false);
            this.confirmationCode.set('');
            this.loginForm.reset();

            this.redirectByRole(user);
          },
          error: (err) => {
            console.error('Erro ao buscar usuário logado', err);
            this.isLoading.set(false);
            this.errorMessage.set('Login confirmado, mas não foi possível carregar o usuário.');
          },
        });
      },
      error: (error) => {
        console.error(error);
        this.isLoading.set(false);
        this.errorMessage.set('Código de confirmação inválido ou expirado.');
      },
    });
  }

  closeConfirmationModal() {
    this.showConfirmationModal.set(false);
  }

  private redirectByRole(user: UserResponseDTO) {
    const roles = user.roles || [];

    if (roles.includes(RoleEnum.ADMIN)) {
      this.router.navigate(['/admin-dashboard']);
      return;
    }

    if (roles.includes(RoleEnum.RECEPTIONIST)) {
      this.router.navigate(['/dashboard-recepcionist']);
      return;
    }

    if (roles.includes(RoleEnum.TUTOR)) {
      this.router.navigate(['/dashboard']);
      return;
    }

    if (roles.includes(RoleEnum.DOCTOR)) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.router.navigate(['/dashboard']);
  }
}
