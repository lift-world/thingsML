import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeviceSettingModule } from './thingsml/device-setting.module';
import { ConnectStateAlertComponent } from './sub-components/connect-state-alert/connect-state-alert.component';
import { TableEditComponent } from './sub-components/table-edit/table-edit.component';
import { JsonEditorComponent } from './json-editor/json-editor.component';

@NgModule({
  declarations: [
    JsonEditorComponent,
    ConnectStateAlertComponent,
    TableEditComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    DeviceSettingModule
  ],
  exports: [JsonEditorComponent],
})
export class AppModule {}
