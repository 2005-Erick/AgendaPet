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

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  /** Controla se estamos no passo 1 (email+senha) ou passo 2 (código MFA) */
  showMfaStep = signal(false);

  /** Guarda o email do passo 1 para usar no passo 2 */
  private loginEmail = '';

  /** Código MFA digitado pelo usuário */
  mfaCode = signal('');

  constructor() {
    const user = this.usersService.currentUser();
    if (user) {
      this.redirectByRole(user);
    }
  }

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

  /** Passo 1: Envia email + senha → backend manda código MFA por e-mail */
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const { email, password } = this.loginForm.value;
    this.loginEmail = email!;

    this.usersService.userlogin(email!, password!).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.showMfaStep.set(true);
        this.successMessage.set('Código de verificação enviado para o seu e-mail.');
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'E-mail ou senha inválidos.');
      },
    });
  }

  /** Passo 2: Confirma o código MFA → backend seta cookie e autentica */
  confirmMfa() {
    const code = this.mfaCode().trim();
    if (!code || !this.loginEmail) {
      this.errorMessage.set('E-mail ou código ausente.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.usersService.confirmLogin(this.loginEmail, code).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        this.loginForm.reset();
        this.mfaCode.set('');
        this.showMfaStep.set(false);
        this.redirectByRole(user);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Código inválido ou expirado.');
      },
    });
  }

  /** Volta para o passo 1 */
  backToLogin() {
    this.showMfaStep.set(false);
    this.mfaCode.set('');
    this.errorMessage.set(null);
    this.successMessage.set(null);
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
