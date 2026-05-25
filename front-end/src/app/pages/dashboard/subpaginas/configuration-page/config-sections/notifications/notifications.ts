import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-notifications',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {}
