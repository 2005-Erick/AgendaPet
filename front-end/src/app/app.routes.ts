import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { dashboardRoutes } from './pages/dashboard/dashboard.routes';

export const routes: Routes = [
  { path: '', component: Home, title: 'Home' },
  { path: 'login', component: Login, title: 'Login' },
  {
    path: 'dashboard',
    component: Dashboard,
    children: dashboardRoutes,
  },
];
