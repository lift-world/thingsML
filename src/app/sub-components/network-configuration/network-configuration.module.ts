import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NetworkConfigurationComponent } from './network-configuration.component';

@NgModule({
  declarations: [NetworkConfigurationComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [NetworkConfigurationComponent]
})
export class NetworkConfigurationModule { }
