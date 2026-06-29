import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment-db';
import { iUser } from '../models/users-model';
import { map, Observable, tap } from 'rxjs';
import { iPets } from '../models/pets-model';
import { UserResponseDTO } from '../models/DTO/user-response-DTO';

export type UserUpdatePayload = {
  name?: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE';
  avatarUrl?: string;
};

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://agendapet.onrender.com';

  currentUser = signal<iUser | null>(this.loadUser());

  // -------------------------------------------------------
  // Auth
  // -------------------------------------------------------

  userlogin(email: string, password: string): Observable<{ message: string }> {
    // Back espera { login, password } — não { email, password }
    return this.http.post<{ message: string }>(`${this.baseUrl}/auth/login`, {
      login: email,
      password,
    });
  }

  confirmLogin(email: string, code: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${this.baseUrl}/auth/login/confirm`, { email, code })
      .pipe(
        tap((response) => {
          // Salva o token — usado pelo interceptor em todas as requisições protegidas
          localStorage.setItem('token', response.token);
        }),
      );
  }

  registerUser(user: iUser): Observable<{ message: string }> {
    // POST /auth/register — retorna StatusResponseDTO { message }, não UserResponseDTO
    return this.http.post<{ message: string }>(`${this.baseUrl}/auth/register`, user);
  }

  confirmRegister(email: string, code: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${this.baseUrl}/auth/register/confirm`, { email, code })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
        }),
      );
  }

  // -------------------------------------------------------
  // CRUD de usuários (requer autenticação)
  // -------------------------------------------------------

  getUsersResponseDTO(): Observable<UserResponseDTO[]> {
    // GET /users — autenticado, qualquer role
    return this.http.get<UserResponseDTO[]>(`${this.baseUrl}/users`);
  }

  getUserById(id: string): Observable<UserResponseDTO> {
    // GET /users/{id}
    return this.http.get<UserResponseDTO>(`${this.baseUrl}/users/${id}`);
  }

  updateUser(id: string, payload: UserUpdatePayload): Observable<UserResponseDTO> {
    // PATCH /users/{id} — atualiza nome, telefone, gênero, avatarUrl
    return this.http.patch<UserResponseDTO>(`${this.baseUrl}/users/${id}`, payload);
  }

  deleteUser(id: string): Observable<void> {
    // DELETE /users/{id}
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  // -------------------------------------------------------
  // Sessão local
  // -------------------------------------------------------

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('agendaPetUser');
  }

  private saveUser(user: iUser) {
    this.currentUser.set(user);
    localStorage.setItem('agendaPetUser', JSON.stringify(user));
  }

  private loadUser() {
    const user = localStorage.getItem('agendaPetUser');
    if (!user) return null;
    return JSON.parse(user) as iUser;
  }
}
