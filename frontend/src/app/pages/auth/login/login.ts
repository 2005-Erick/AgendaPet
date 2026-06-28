import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../../services/users-service';

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

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

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
        console.log(err);
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'Erro ao realizar login');
      },
    });
  }

  confirmCode() {
    const code = this.confirmationCode().trim();
    const email = this.loginForm.value.email;

    if (!email || !code) {
      return;
    }
    this.usersService.confirmRegister(email, code).subscribe({
      next: () => {
        this.showConfirmationModal.set(false);
        this.confirmationCode.set('');
        this.loginForm.reset();
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
