import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeviceSettingsComponent } from './device-settings.component';
import { DeviceSettingsFormModule } from '../sub-components/device-settings-form/device-settings.module';
import { NetworkConfigurationModule } from '../sub-components/network-configuration/network-configuration.module';

@NgModule({
  declarations: [
    DeviceSettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DeviceSettingsFormModule,
    NetworkConfigurationModule
  ],
  exports: [DeviceSettingsComponent]
})
export class DeviceSettingsModule { }
