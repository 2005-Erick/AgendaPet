import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersService } from './services/users-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('front-end');
  private usersService = inject(UsersService);

  constructor() {
    // Validate session on load
    this.usersService.loadCurrentUser().subscribe({
      error: () => {
        // If 401/403 occurs, auth interceptor will automatically clear it and redirect if needed
      }
    });
  }
}
