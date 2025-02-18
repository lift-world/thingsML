import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'thingsml',
    loadChildren: () => import('./thingsml/device-setting.module').then(m => m.DeviceSettingModule)
  },
  {
    path: 'json-editor',
    loadComponent: () => import('./json-editor/json-editor.component').then(m => m.JsonEditorComponent)
  },
  {
    path: 'device-settings',
    loadComponent: () => import('./device-settings/device-settings.module').then(m => m.DeviceSettingsModule)
  }
];
