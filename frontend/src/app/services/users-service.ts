import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { iUser } from '../models/users-model';
import { UserResponseDTO, RoleEnum, GenderEnum } from '../models/DTO/user-response-DTO';

export interface AdminCreateUserDTO {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  birthday: string;
  gender: 'MALE' | 'FEMALE';
  role: RoleEnum;
  crmv?: string;
  avatarUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);

  private readonly backendUrl = 'http://localhost:8080';
  private readonly storageKey = 'agendaPetUser';

  currentUser = signal<UserResponseDTO | null>(this.loadUser());

  // -------------------------------------------------------
  // Auth público
  // -------------------------------------------------------

  userlogin(login: string, password: string) {
    return this.http.post(`${this.backendUrl}/auth/login`, {
      login,
      password,
    });
  }

  confirmLogin(email: string, code: string) {
    return this.http
      .post(`${this.backendUrl}/auth/login/confirm`, { email, code }, { withCredentials: true })
      .pipe(
        tap(() => {
          this.getCurrentUser().subscribe({
            next: (user) => this.saveUser(user),
            error: (err) => console.error('Erro ao carregar usuário logado', err),
          });
        }),
      );
  }

  registerUser(user: iUser) {
    return this.http.post(`${this.backendUrl}/auth/register`, user);
  }

  confirmRegister(email: string, code: string) {
    return this.http
      .post(`${this.backendUrl}/auth/register/confirm`, { email, code }, { withCredentials: true })
      .pipe(
        tap(() => {
          this.getCurrentUser().subscribe({
            next: (user) => this.saveUser(user),
            error: (err) => console.error('Erro ao carregar usuário logado', err),
          });
        }),
      );
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem(this.storageKey);

    // Se depois vocês criarem um endpoint /auth/logout no back,
    // aqui poderá chamar esse endpoint para zerar o cookie HttpOnly.
  }

  // -------------------------------------------------------
  // Usuário logado
  // -------------------------------------------------------

  getCurrentUser(): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.backendUrl}/users/me`, {
      withCredentials: true,
    });
  }

  loadCurrentUser(): Observable<UserResponseDTO> {
    return this.getCurrentUser().pipe(tap((user) => this.saveUser(user)));
  }

  // -------------------------------------------------------
  // Administração de usuários
  // -------------------------------------------------------

  getUsersResponseDTO(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.backendUrl}/users`, {
      withCredentials: true,
    });
  }

  adminCreateUser(user: AdminCreateUserDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${this.backendUrl}/users`, user, {
      withCredentials: true,
    });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.backendUrl}/users/${id}`, {
      withCredentials: true,
    });
  }

  deleteCurrentUser(): Observable<void> {
    const user = this.currentUser();

    if (!user?.id) {
      throw new Error('Usuário não encontrado');
    }

    return this.deleteUser(user.id);
  }

  // -------------------------------------------------------
  // Persistência local dos dados do usuário
  // -------------------------------------------------------

  private saveUser(user: UserResponseDTO) {
    this.currentUser.set(user);
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  private loadUser(): UserResponseDTO | null {
    const user = localStorage.getItem(this.storageKey);

    if (!user) {
      return null;
    }

    return JSON.parse(user) as UserResponseDTO;
  }
}
