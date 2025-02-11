import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeviceConfigurationModalComponent } from './device-configuration-modal.component';

@NgModule({
  declarations: [
    DeviceConfigurationModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    DeviceConfigurationModalComponent
  ]
})
export class DeviceConfigurationModalModule { }
