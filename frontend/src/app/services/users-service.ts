import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, switchMap } from 'rxjs';
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

  currentUser = signal<UserResponseDTO | null>(null);

  // -------------------------------------------------------
  // Auth público — Fluxo de Login com 2FA
  // -------------------------------------------------------

  /** Passo 1: Envia email + senha. O backend dispara o código MFA por e-mail. */
  userlogin(login: string, password: string): Observable<any> {
    return this.http.post(
      `${this.backendUrl}/auth/login`,
      {
        login,
        password,
      },
      { withCredentials: true },
    );
  }

  /** Passo 2: Confirma o código MFA. O backend seta o cookie HttpOnly e retorna o token. */
  confirmLogin(email: string, code: string): Observable<UserResponseDTO> {
    return this.http
      .post(`${this.backendUrl}/auth/login/confirm`, { email, code }, { withCredentials: true })
      .pipe(
        switchMap(() => this.getCurrentUser()),
        tap((user) => this.currentUser.set(user)),
      );
  }

  // -------------------------------------------------------
  // Auth público — Fluxo de Cadastro com confirmação por e-mail
  // -------------------------------------------------------

  registerUser(user: iUser) {
    return this.http.post(`${this.backendUrl}/auth/register`, user);
  }

  confirmRegister(email: string, code: string): Observable<UserResponseDTO> {
    return this.http
      .post(`${this.backendUrl}/auth/register/confirm`, { email, code }, { withCredentials: true })
      .pipe(
        switchMap(() => this.getCurrentUser()),
        tap((user) => this.currentUser.set(user)),
      );
  }

  // -------------------------------------------------------
  // Logout — limpa cookie HttpOnly via backend
  // -------------------------------------------------------

  logout(): Observable<any> {
    return this.http.post(`${this.backendUrl}/auth/logout`, {}, { withCredentials: true });
  }

  clearSession() {
    this.currentUser.set(null);
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
    return this.getCurrentUser().pipe(tap((user) => this.currentUser.set(user)));
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
}
