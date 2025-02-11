import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceSettingsComponent } from './device-setting.component';

const routes: Routes = [
  {
    path: '',
    component: DeviceSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceSettingRoutingModule { }
