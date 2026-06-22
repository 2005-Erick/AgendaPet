import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private usersService = inject(UsersService);
  private router = inject(Router);

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

    this.usersService.login(email!, password!).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'Erro ao realizar login');
      },
    });
  }
}
