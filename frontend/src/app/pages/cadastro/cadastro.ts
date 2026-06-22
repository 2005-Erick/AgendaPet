import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users-service';
import { user_role } from '../../models/users-model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatIconModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  private usersService = inject(UsersService);
  private router = inject(Router);

  // Expor o enum para o template
  user_role = user_role;

  roles = [
    { label: 'Tutor', value: user_role.TUTOR },
    { label: 'Médico Veterinário', value: user_role.DOCTOR },
  ];

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    cpf: new FormControl('', [Validators.required, Validators.pattern(/^\d{11}$/)]),
    birthday: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    role: new FormControl(user_role.TUTOR, [Validators.required]),
    crmv: new FormControl<string | null>(null),
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.syncCrmvValidation(this.registrationForm.controls.role.value);

    this.registrationForm.controls.role.valueChanges.subscribe((role) => {
      this.syncCrmvValidation(role);
    });
  }

  getFieldFeedback(
    fieldName: 'name' | 'email' | 'password' | 'cpf' | 'birthday' | 'phone' | 'role' | 'crmv',
  ) {
    const control = this.registrationForm.get(fieldName);

    if (!control || (!control.touched && !control.dirty)) {
      return null;
    }

    if (fieldName === 'crmv' && this.registrationForm.controls.role.value !== user_role.DOCTOR) {
      return null;
    }

    if (control.hasError('required')) {
      const messages = {
        name: 'O nome é obrigatório.',
        email: 'O email é obrigatório.',
        password: 'A senha é obrigatória.',
        cpf: 'O CPF é obrigatório.',
        birthday: 'A data de nascimento é obrigatória.',
        phone: 'O telefone é obrigatório.',
        role: 'O tipo de perfil é obrigatório.',
        crmv: 'O CRMV é obrigatório para médico veterinário.',
      };

      return { kind: 'error' as const, message: messages[fieldName] };
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

    return { kind: 'success' as const, message: 'OK.' };
  }

  private syncCrmvValidation(role: user_role | null) {
    const crmvControl = this.registrationForm.controls.crmv;

    if (role === user_role.DOCTOR) {
      crmvControl.setValidators([Validators.required]);
    } else {
      crmvControl.clearValidators();
      crmvControl.setValue(null);
    }

    crmvControl.updateValueAndValidity({ emitEvent: false });
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const userData = {
      ...this.registrationForm.value,
      cpf: (this.registrationForm.value.cpf ?? '').replace(/\D/g, ''),
      crmv: (this.registrationForm.value.crmv ?? '').trim() || null,
    } as any;

    this.usersService.register(userData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Não foi possível realizar o cadastro, tente novamente');
      },
    });
  }
}
