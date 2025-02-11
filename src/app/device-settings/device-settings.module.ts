import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeviceSettingsComponent } from './device-settings.component';
import { NetworkConfigurationComponent } from '../sub-components/network-configuration/network-configuration.component';
import { DeviceSettingsFormModule } from '../sub-components/device-settings-form/device-settings.module';

@NgModule({
  declarations: [
    DeviceSettingsComponent,
    NetworkConfigurationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DeviceSettingsFormModule
  ],
  exports: [
    DeviceSettingsComponent
  ]
})
export class DeviceSettingsModule { }
