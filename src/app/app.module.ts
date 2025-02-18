import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeviceSettingModule } from './thingsml/device-setting.module';
import { DeviceSettingsModule } from './device-settings/device-settings.module';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    DeviceSettingModule,
    DeviceSettingsModule
  ],
  providers: []
})
export class AppModule {}
