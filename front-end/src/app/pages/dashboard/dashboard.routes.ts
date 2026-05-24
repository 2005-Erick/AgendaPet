import { Routes } from '@angular/router';
import { DashboardPage } from './subpaginas/dashboard-page/dashboard-page';
import { PetsPage } from './subpaginas/pets-page/pets-page';
import { AgendamentosPage } from './subpaginas/agendamentos-page/agendamentos-page';

export const dashboardRoutes: Routes = [
  { path: '', redirectTo: 'dashboard-page', pathMatch: 'full' },
  { path: 'dashboard-page', component: DashboardPage },
  { path: 'pets-page', component: PetsPage },
  { path: 'pets-page/pet/:id', component: PetsPage },
  { path: 'agendamentos-page', component: AgendamentosPage },
];
