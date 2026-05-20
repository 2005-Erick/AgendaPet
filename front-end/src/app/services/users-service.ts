import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment-db';
import { iUser } from '../models/users-model';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.supabaseUrl}/rest/v1/users`;
  private readonly apiKey = environment.supabasePublishableKey;

  currentUser = signal<iUser | null>(null);

  private get headers() {
    return {
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  login(email: string, password: string): Observable<iUser> {
    const url = `${this.apiUrl}?email=eq.${email}&password=eq.${password}&select=*`;
    return this.http.get<iUser[]>(url, { headers: this.headers }).pipe(
      map(users => {
        if (users.length === 0) {
          throw new Error('Usuário ou senha inválidos');
        }
        return users[0];
      }),
      tap(user => this.currentUser.set(user))
    );
  }

  register(user: iUser): Observable<iUser> {
    return this.http.post<iUser[]>(this.apiUrl, user, { headers: this.headers }).pipe(
      map(users => users[0]),
      tap(user => this.currentUser.set(user))
    );
  }

  logout() {
    this.currentUser.set(null);
  }
}
