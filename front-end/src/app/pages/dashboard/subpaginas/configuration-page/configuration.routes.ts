import { Routes } from '@angular/router';
import { Accessibility } from './config-sections/accessibility/accessibility';
import { Profile } from './config-sections/profile/profile';
import { Security } from './config-sections/security/security';
import { Notifications } from './config-sections/notifications/notifications';
import { Generic } from './config-sections/generic/generic';

export const configurationRoutes: Routes = [
  { path: '', redirectTo: 'configuration-page', pathMatch: 'full' },
  { path: 'Profile', component: Profile, children: [{ path: 'Generic', component: Generic }] },
  { path: 'Security', component: Security, children: [{ path: 'Generic', component: Generic }] },
  {
    path: 'Notifications',
    component: Notifications,
    children: [{ path: 'Generic', component: Generic }],
  },
  {
    path: 'Accessibility',
    component: Accessibility,
    children: [{ path: 'Generic', component: Generic }],
  },
];
