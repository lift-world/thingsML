import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'thingsml',
    loadChildren: () => import('./thingsml/device-setting.module').then(m => m.DeviceSettingModule)
  },
  // {
  //   path: 'device-settings',
  //   loadComponent: () => import('./device-settings/device-settings.component').then(m => m.DeviceSettingsComponent)
  // }
];
