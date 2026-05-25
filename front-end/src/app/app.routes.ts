import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { Dashboard } from './pages/dashboard/dashboard';
import { dashboardRoutes } from './pages/dashboard/dashboard.routes';
import { PrecoComponent } from './pages/home/subpaginas/preco/preco';
import { NotFoundPage } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', component: Home, title: 'AgendaPet - Gestão de Clínicas Veterinárias e Pet Shops' },
  { path: 'login', component: Login, title: 'AgendaPet - Login' },
  { path: 'cadastro', component: Cadastro, title: 'AgendaPet - Cadastro' },
  { path: 'preco', component: PrecoComponent, title: 'AgendaPet - Preços' },
  {
    path: 'dashboard',
    component: Dashboard,
    children: dashboardRoutes,
  },
  { path: '**', component: NotFoundPage, title: 'AgendaPet - 404' },
];
