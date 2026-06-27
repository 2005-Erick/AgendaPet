import { Routes } from '@angular/router';
import { Home } from './pages/public/home/home';
import { Login } from './pages/auth/login/login';
import { Cadastro } from './pages/auth/cadastro/cadastro';
import { Dashboard } from './pages/tutor/dashboard/dashboard';
import { dashboardRoutes } from './pages/tutor/dashboard/dashboard.routes';
import { PrecoComponent } from './pages/public/home/subpaginas/preco/preco';
import { NotFoundPage } from './pages/not-found/not-found';
import { ConfigurationPage } from './pages/tutor/dashboard/subpaginas/configuration-page/configuration-page';
import { configurationRoutes } from './pages/tutor/dashboard/subpaginas/configuration-page/configuration.routes';
import { Recepcionist } from './pages/recepcionist/recepcionist';

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
  {path: 'dashboard-recepcionist', component: Recepcionist, title: 'AgendaPet - Dashboard Recepcionista'},
  { path: '**', component: NotFoundPage, title: 'AgendaPet - 404' },
];
