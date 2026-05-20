import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users-service';
import { user_role } from '../../models/users-model';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  private usersService = inject(UsersService);
  private router = inject(Router);

  roles = [
    { label: 'Tutor', value: user_role.TUTOR },
    { label: 'Médico Veterinário', value: user_role.DOCTOR },
  ];

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    cpf: new FormControl('', [Validators.required]),
    birthday: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    role: new FormControl(user_role.TUTOR, [Validators.required]),
    crmv: new FormControl(''),
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit() {
    if (this.registrationForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      const userData = this.registrationForm.value as any;

      this.usersService.register(userData).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.message || 'Erro ao realizar cadastro');
        },
      });
    }
  }
}
