import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DeviceSettingsFormComponent } from './device-settings-form.component';

@NgModule({
  declarations: [DeviceSettingsFormComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [DeviceSettingsFormComponent],
})
export class DeviceSettingsFormModule {}
