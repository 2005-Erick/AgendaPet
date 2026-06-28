import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment-db';
import { iUser } from '../models/users-model';
import { map, Observable, tap } from 'rxjs';
import { iPets } from '../models/pets-model';
import { UserResponseDTO } from '../models/DTO/user-response-DTO';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.supabaseUrl}/rest/v1/users`;
  private readonly apiKey = environment.supabasePublishableKey;
  private readonly storageKey = 'agendaPetUser';

    currentUser = signal<iUser | null>(this.loadUser());

    private get headers() {
      return {
      apikey: this.apiKey,
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    };
  }

  getUsers(): Observable<iUser[]> {
    const url = `${this.apiUrl}?select=*`;
    return this.http.get<iUser[]>(url, { headers: this.headers });
  }

  login(email: string, password: string): Observable<iUser> {
    const url = `${this.apiUrl}?email=eq.${email}&password=eq.${password}&select=*`;
    return this.http.get<iUser[]>(url, { headers: this.headers }).pipe(
      map((users) => {
        if (users.length === 0) {
          throw new Error('Usuário ou senha inválidos');
        }
        return users[0];
      }),
      tap((user) => this.saveUser(user)),
    );
  }

  register(user: iUser): Observable<iUser> {
    return this.http.post<iUser[]>(this.apiUrl, user, { headers: this.headers }).pipe(
      map((users) => users[0]),
      tap((user) => this.saveUser(user)),
    );
  }

  registerUser(user: iUser): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>('https://agendapet.onrender.com/auth/register', user);
  }

  confirmRegister(email: string, code: string) {
    return this.http.post<{token: string}>('https://agendapet.onrender.com/auth/register/confirm',{email, code}
    );
  }

  getUsersResponseDTO(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>('https://agendapet.onrender.com/users');
  }
    
  deleteUser(id: string): Observable<void> {
    const url = `${this.apiUrl}?id=eq.${id}`;
    return this.http.delete<void>(url, { headers: this.headers });
  }

  deleteCurrentUser(): Observable<void> {
    const user = this.currentUser();

    if (!user?.id) {
      throw new Error('Usuário não encontrado');
    }

    return this.deleteUser(user.id);
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem(this.storageKey);
  }

  private saveUser(user: iUser) {
    this.currentUser.set(user);
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  private loadUser() {
    const user = localStorage.getItem(this.storageKey);

    if (!user) {
      return null;
    }

    return JSON.parse(user) as iUser;
  }
}
