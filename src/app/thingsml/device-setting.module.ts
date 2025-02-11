import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DeviceSettingRoutingModule } from './device-setting-routing.module';

import { DeviceSettingsComponent } from './device-setting.component';
import { DeviceSettingsFormModule } from '../sub-components/device-settings-form/device-settings.module';
import { NetworkConfigurationModule } from '../sub-components/network-configuration/network-configuration.module';
import { DeviceConfigurationModalModule } from '../sub-components/device-configuration-modal/device-configuration-modal.module';
import { ConnectStateAlertComponent } from '../sub-components/connect-state-alert/connect-state-alert.component';

@NgModule({
  declarations: [
    DeviceSettingsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DeviceSettingRoutingModule,
    DeviceSettingsFormModule,
    NetworkConfigurationModule,
    DeviceConfigurationModalModule,
    ConnectStateAlertComponent
  ],
  providers: [],
  bootstrap: [DeviceSettingsComponent]


})
export class DeviceSettingModule {}
