import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NetworkConfigurationComponent } from './network-configuration.component';

@NgModule({
  declarations: [
    NetworkConfigurationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    NetworkConfigurationComponent
  ]
})
export class NetworkConfigurationModule { }
