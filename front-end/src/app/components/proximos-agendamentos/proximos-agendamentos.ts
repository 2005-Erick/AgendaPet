import { Component, input } from '@angular/core';

@Component({
  selector: 'app-proximos-agendamentos',
  imports: [],
  templateUrl: './proximos-agendamentos.html',
  styleUrl: './proximos-agendamentos.css',
})
export class ProximosAgendamentos {
  titulo = input.required<string>();
  data = input.required<string>();
  cidade = input.required<string>();
  horario = input.required<string>();
}
