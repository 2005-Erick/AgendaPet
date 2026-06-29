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
  showConfirmationModal = signal(false);

  editingUserId = signal<string | null>(null);
  confirmationCode = signal('');

  // --- Formulários reativos ---
  createForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/),
    ]),
    cpf: new FormControl('', [Validators.required, Validators.pattern(/^\d{11}$/)]),
    phone: new FormControl('', [Validators.required]),
    birthday: new FormControl('', [Validators.required]),
    gender: new FormControl<'MALE' | 'FEMALE' | null>(null, [Validators.required]),
    avatarUrl: new FormControl(''),
  });

  editForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    gender: new FormControl<'MALE' | 'FEMALE' | null>(null, [Validators.required]),
    avatarUrl: new FormControl(''),
  });

  get RoleEnum() {
    return RoleEnum;
  }

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.users();
    return this.users().filter(
      (user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term),
    );
  });

  ngOnInit() {
    this.loadUsers();
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

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  // -------------------------------------------------------
  // Validações Visuais
  // ---------------------------------------------------

  getCreateFieldFeedback(
    fieldName:
      | 'name'
      | 'email'
      | 'password'
      | 'cpf'
      | 'phone'
      | 'birthday'
      | 'gender'
      | 'avatarUrl',
  ) {
    const messages = {
      name: 'Informe o nome completo.',
      email: 'Informe um e-mail válido.',
      password: 'A senha precisa ter pelo menos 6 caracteres.',
      cpf: 'Informe um CPF válido com 11 números.',
      phone: 'Informe o telefone.',
      birthday: 'Informe a data de nascimento.',
      gender: 'Selecione o gênero.',
      avatarUrl: 'URL inválida.',
    };
    return this.getFieldFeedback(this.createForm.get(fieldName), messages[fieldName]);
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

  private getFieldFeedback(control: AbstractControl | null, defaultMessage: string) {
    if (!control || (!control.touched && !control.dirty)) return null;
    if (control.hasError('required')) return { kind: 'error' as const, message: defaultMessage };
    if (control.hasError('email')) return { kind: 'error' as const, message: 'E-mail inválido.' };
    if (control.hasError('pattern'))
      return { kind: 'error' as const, message: 'CPF inválido. Digite 11 números.' };
    if (control.hasError('minlength'))
      return { kind: 'error' as const, message: 'Mínimo de 6 caracteres.' };
    return { kind: 'success' as const, message: '' };
  }

  // -------------------------------------------------------
  // Modal de Criação (Integrado ao fluxo MFA)
  // -------------------------------------------------------

  openCreateModal() {
    this.resetCreateForm();
    this.createMessage.set(null);
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

    this.confirmationCode.set('');
    const formValues = this.createForm.value;

    // Envia o payload no formato esperado pela API (iUser mapeado para RegisterRequestDTO no back)
    this.usersService
      .registerUser({
        name: formValues.name!,
        email: formValues.email!,
        password: formValues.password!,
        cpf: formValues.cpf!,
        phone: formValues.phone!,
        birthday: formValues.birthday!,
        gender: formValues.gender!,
        avatarUrl: formValues.avatarUrl || undefined,
      })
      .subscribe({
        next: () => {
          this.createMessage.set('Cadastro realizado. Verifique o código enviado ao e-mail.');
          this.createMessageType.set('success');
          this.showConfirmationModal.set(true); // Abre o modal de código (MFA)
        },
        error: (err) => {
          console.error('Erro ao criar usuário', err);
          this.createMessage.set('Erro ao cadastrar usuário. Verifique os dados.');
          this.createMessageType.set('error');
        },
      });
  }

  // -------------------------------------------------------
  // Fluxo de Confirmação MFA (Mesmo do Recepcionist)
  // -------------------------------------------------------

  closeConfirmationModal() {
    this.showConfirmationModal.set(false);
  }

  confirmCode() {
    const code = this.confirmationCode().trim();
    const email = this.createForm.value.email;

    if (!email || !code) return;

    this.usersService.confirmRegister(email, code).subscribe({
      next: () => {
        this.showConfirmationModal.set(false);
        this.confirmationCode.set('');
        this.createMessage.set('Usuário confirmado com sucesso!');
        this.createMessageType.set('success');

        this.loadUsers();
        setTimeout(() => this.closeCreateModal(), 1500);
      },
      error: (error) => {
        console.error('Erro ao confirmar código', error);
        this.createMessage.set('Erro ao confirmar código.');
        this.createMessageType.set('error');
      },
    });
  }

  // -------------------------------------------------------
  // Modal de Edição
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
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editingUserId.set(null);
    this.resetEditForm();
  }

  saveEditedUser() {
    const id = this.editingUserId();
    if (!id) return;

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.editMessage.set('Preencha todos os campos obrigatórios.');
      this.editMessageType.set('error');
      return;
    }

    const formValues = this.editForm.value;

    this.usersService
      .updateUser(id, {
        name: formValues.name!,
        phone: formValues.phone!,
        gender: formValues.gender!,
        avatarUrl: formValues.avatarUrl || undefined,
      })
      .subscribe({
        next: () => {
          this.editMessage.set('Usuário atualizado com sucesso!');
          this.editMessageType.set('success');
          this.loadUsers();
          setTimeout(() => this.closeEditModal(), 1500);
        },
        error: (err) => {
          console.error('Erro ao editar usuário', err);
          this.editMessage.set('Erro ao atualizar usuário.');
          this.editMessageType.set('error');
        },
      });
  }

  // -------------------------------------------------------
  // Exclusão e Utils
  // -------------------------------------------------------

  deleteUser(id: string) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

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
    return roles.map((r) => labels[r]).join(', ');
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
