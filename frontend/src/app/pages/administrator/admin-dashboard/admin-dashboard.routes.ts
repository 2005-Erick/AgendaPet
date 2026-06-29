import { Routes } from '@angular/router';
import { AdminUsers } from '../subpaginas/admin-users/admin-users';
import { AdminPets } from '../subpaginas/admin-pets/admin-pets';
import { AdminAppointments } from '../subpaginas/admin-appointments/admin-appointments';
import { AdminDoctors } from '../subpaginas/admin-doctors/admin-doctors';

export const adminDashboardRoutes: Routes = [
  { path: '', redirectTo: 'admin-users', pathMatch: 'full' },
  { path: 'admin-users', component: AdminUsers },
  { path: 'admin-pets', component: AdminPets },
  { path: 'admin-appointments', component: AdminAppointments },
  { path: 'admin-doctors', component: AdminDoctors },
];
