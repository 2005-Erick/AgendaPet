import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { dashboardRoutes } from './pages/dashboard/dashboard.routes';
import { PrecoComponent } from './pages/home/subpaginas/preco/preco';

export const routes: Routes = [
  { path: '', component: Home, title: 'Home' },
  { path: 'login', component: Login, title: 'Login' },
  { path: 'preco', component: PrecoComponent, title: 'Preços' },
  {
    path: 'dashboard',
    component: Dashboard,
    children: dashboardRoutes,
  },
];
