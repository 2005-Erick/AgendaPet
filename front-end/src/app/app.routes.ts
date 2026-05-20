import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { Dashboard } from './pages/dashboard/dashboard';
import { dashboardRoutes } from './pages/dashboard/dashboard.routes';

export const routes: Routes = [
  { path: '', component: Home, title: 'Home' },
  { path: 'login', component: Login, title: 'Login' },
  { path: 'cadastro', component: Cadastro, title: 'Cadastro' },
  {
    path: 'dashboard',
    component: Dashboard,
    children: dashboardRoutes,
  },
];

