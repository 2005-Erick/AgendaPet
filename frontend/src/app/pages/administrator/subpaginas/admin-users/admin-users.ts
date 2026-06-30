import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { UsersService } from '../../../../services/users-service';
import { UserResponseDTO, RoleEnum } from '../../../../models/DTO/user-response-DTO';
import { DatePipe, CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DatePipe],
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.css'],
})
export class AdminUsers implements OnInit {
  private usersService = inject(UsersService);

  // --- Estado da lista ---
  users = signal<UserResponseDTO[]>([]);
  searchTerm = signal('');
  isLoading = signal(false);

  // --- Mensagens de feedback ---
  listMessage = signal<string | null>(null);
  listMessageType = signal<'success' | 'error' | null>(null);
  createMessage = signal<string | null>(null);
  createMessageType = signal<'success' | 'error' | null>(null);
  editMessage = signal<string | null>(null);
  editMessageType = signal<'success' | 'error' | null>(null);

  // --- Modais ---
  showCreateModal = signal(false);
  showEditModal = signal(false);

  editingUserId = signal<string | null>(null);

  // --- Formulários reativos ---
  createForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/),
    ]),
    cpf: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/),
    ]),
    birthday: new FormControl('', [Validators.required]),
    gender: new FormControl<'MALE' | 'FEMALE' | null>(null, [Validators.required]),
    role: new FormControl<RoleEnum | null>(null, [Validators.required]),
    crmv: new FormControl('', []),
    avatarUrl: new FormControl(''),
  });

  editForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/),
    ]),
    gender: new FormControl<'MALE' | 'FEMALE' | null>(null, [Validators.required]),
    avatarUrl: new FormControl(''),
  });

  get RoleEnum() {
    return RoleEnum;
  }

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) {
      return this.users();
    }

    return this.users().filter(
      (user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term),
    );
  });

  ngOnInit() {
    this.loadUsers();
    this.watchRoleChanges();
  }

  private loadUsers() {
    this.isLoading.set(true);

    this.usersService.getUsersResponseDTO().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar usuários', err);
        this.listMessage.set('Erro ao carregar usuários. Tente novamente.');
        this.listMessageType.set('error');
        this.isLoading.set(false);
      },
    });
  }

  private watchRoleChanges() {
    this.createForm.get('role')?.valueChanges.subscribe((selectedRole) => {
      const crmvControl = this.createForm.get('crmv');

      if (selectedRole === RoleEnum.DOCTOR) {
        crmvControl?.setValidators([Validators.required, Validators.pattern(/^\d{4,6}-[A-Z]{2}$/)]);
      } else {
        crmvControl?.clearValidators();
        crmvControl?.setValue('');
      }

      crmvControl?.updateValueAndValidity();
    });
  }

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  private onlyDigits(value: string | null | undefined): string {
    return (value ?? '').replace(/\D/g, '');
  }

  private formatCpf(value: string): string {
    const digits = this.onlyDigits(value).slice(0, 11);

    if (digits.length <= 3) {
      return digits;
    }

    if (digits.length <= 6) {
      return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }

    if (digits.length <= 9) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    }

    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  }

  private formatPhone(value: string): string {
    const digits = this.onlyDigits(value).slice(0, 11);

    if (digits.length <= 2) {
      return digits;
    }

    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }

  onCreateCpfInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const formattedValue = this.formatCpf(input.value);

    this.createForm.get('cpf')?.setValue(formattedValue, {
      emitEvent: false,
    });
  }

  onCreatePhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const formattedValue = this.formatPhone(input.value);

    this.createForm.get('phone')?.setValue(formattedValue, {
      emitEvent: false,
    });
  }

  onEditPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const formattedValue = this.formatPhone(input.value);

    this.editForm.get('phone')?.setValue(formattedValue, {
      emitEvent: false,
    });
  }

  // -------------------------------------------------------
  // Validações visuais
  // -------------------------------------------------------

  getCreateFieldFeedback(
    fieldName:
      | 'name'
      | 'email'
      | 'password'
      | 'cpf'
      | 'phone'
      | 'birthday'
      | 'gender'
      | 'role'
      | 'crmv'
      | 'avatarUrl',
  ) {
    const defaultMessages = {
      name: 'Informe o nome completo.',
      email: 'Informe um e-mail válido.',
      password: 'A senha é obrigatória.',
      cpf: 'Informe o CPF.',
      phone: 'Informe o telefone.',
      birthday: 'Informe a data de nascimento.',
      gender: 'Selecione o gênero.',
      role: 'Selecione o cargo do usuário.',
      crmv: 'O CRMV é obrigatório para médicos.',
      avatarUrl: 'URL inválida.',
    };

    const patternMessages: Record<string, string> = {
      password: 'Deve ter maiúscula, minúscula, número e símbolo.',
      cpf: 'CPF inválido. Use o formato 000.000.000-00.',
      phone: 'Telefone inválido. Use o formato (00) 00000-0000.',
      crmv: 'Formato inválido. Exemplo correto: 1234-PB',
    };

    return this.getFieldFeedback(
      this.createForm.get(fieldName),
      defaultMessages[fieldName],
      patternMessages[fieldName],
    );
  }

  getEditFieldFeedback(fieldName: 'name' | 'phone' | 'gender' | 'avatarUrl') {
    const messages = {
      name: 'Informe o nome completo.',
      phone: 'Informe o telefone.',
      gender: 'Selecione o gênero.',
      avatarUrl: 'URL inválida.',
    };

    return this.getFieldFeedback(this.editForm.get(fieldName), messages[fieldName]);
  }

  private getFieldFeedback(
    control: AbstractControl | null,
    defaultMessage: string,
    patternMessage?: string,
  ) {
    if (!control || (!control.touched && !control.dirty)) {
      return null;
    }

    if (control.hasError('required')) {
      return {
        kind: 'error' as const,
        message: defaultMessage,
      };
    }

    if (control.hasError('email')) {
      return {
        kind: 'error' as const,
        message: 'E-mail inválido.',
      };
    }

    if (control.hasError('pattern')) {
      return {
        kind: 'error' as const,
        message: patternMessage || 'Formato inválido.',
      };
    }

    if (control.hasError('minlength')) {
      const min = control.getError('minlength').requiredLength;

      return {
        kind: 'error' as const,
        message: `Mínimo de ${min} caracteres.`,
      };
    }

    return {
      kind: 'success' as const,
      message: '',
    };
  }

  // -------------------------------------------------------
  // Modal de criação
  // -------------------------------------------------------

  openCreateModal() {
    this.resetCreateForm();
    this.createMessage.set(null);
    this.createMessageType.set(null);
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
    this.resetCreateForm();
  }

  createUser() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.createMessage.set('Preencha todos os campos obrigatórios.');
      this.createMessageType.set('error');
      return;
    }

    const formValues = this.createForm.value;

    this.usersService
      .adminCreateUser({
        name: formValues.name!,
        email: formValues.email!,
        password: formValues.password!,
        cpf: this.onlyDigits(formValues.cpf!),
        phone: this.onlyDigits(formValues.phone!),
        birthday: formValues.birthday!,
        gender: formValues.gender!,
        role: formValues.role!,
        crmv: formValues.role === RoleEnum.DOCTOR ? formValues.crmv! : undefined,
        avatarUrl: formValues.avatarUrl || undefined,
      })
      .subscribe({
        next: () => {
          this.createMessage.set('Usuário cadastrado com sucesso.');
          this.createMessageType.set('success');
          this.loadUsers();

          setTimeout(() => {
            this.closeCreateModal();
          }, 1200);
        },
        error: (err) => {
          console.error('Erro ao criar usuário', err);
          this.createMessage.set('Erro ao cadastrar usuário. Verifique os dados.');
          this.createMessageType.set('error');
        },
      });
  }

  // -------------------------------------------------------
  // Modal de edição
  // -------------------------------------------------------

  openEditModal(user: UserResponseDTO) {
    this.editingUserId.set(user.id);

    this.editForm.patchValue({
      name: user.name,
      phone: '',
      gender: user.gender as 'MALE' | 'FEMALE' | null,
      avatarUrl: user.avatarUrl ?? '',
    });

    this.editMessage.set(null);
    this.editMessageType.set(null);
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editingUserId.set(null);
    this.resetEditForm();
  }

  saveEditedUser() {
    const id = this.editingUserId();

    if (!id) {
      return;
    }

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.editMessage.set('Preencha todos os campos obrigatórios.');
      this.editMessageType.set('error');
      return;
    }

    const formValues = this.editForm.value;

    console.log('Salvar edição ainda não implementado:', id, formValues);

    this.editMessage.set('Edição ainda não implementada no service.');
    this.editMessageType.set('error');
  }

  deleteUser(id: string) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    this.usersService.deleteUser(id).subscribe({
      next: () => {
        this.listMessage.set('Usuário excluído com sucesso.');
        this.listMessageType.set('success');
        this.loadUsers();
      },
      error: (err) => {
        console.error('Erro ao excluir usuário', err);
        this.listMessage.set('Erro ao excluir usuário.');
        this.listMessageType.set('error');
      },
    });
  }

  formatRoles(roles: RoleEnum[]): string {
    const labels: Record<RoleEnum, string> = {
      [RoleEnum.ADMIN]: 'Admin',
      [RoleEnum.DOCTOR]: 'Veterinário',
      [RoleEnum.TUTOR]: 'Tutor',
      [RoleEnum.RECEPTIONIST]: 'Recepcionista',
    };

    return roles.map((role) => labels[role]).join(', ');
  }

  private resetCreateForm() {
    this.createForm.reset({
      name: '',
      email: '',
      password: '',
      cpf: '',
      phone: '',
      birthday: '',
      gender: null,
      role: null,
      crmv: '',
      avatarUrl: '',
    });
  }

  private resetEditForm() {
    this.editForm.reset({
      name: '',
      phone: '',
      gender: null,
      avatarUrl: '',
    });
  }
}
