import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

interface NetworkConfig {
  ipAddress: string;
  port: number;
}

@Component({
  selector: 'app-network-configuration',
  templateUrl: './network-configuration.component.html',
  styleUrls: ['./network-configuration.component.scss'],
})
export class NetworkConfigurationComponent implements OnInit {
  @Input() config: NetworkConfig = { ipAddress: '', port: 0 };

  ngOnInit() {
    console.log(this.config);
  }

  private initialConfig: NetworkConfig = {
    ipAddress: '192.168.1.100',
    port: 8080
  };

  isModified(field: keyof NetworkConfig): boolean {
    return this.config[field] !== this.initialConfig[field];
  }

  get isAnyFieldModified(): boolean {
    return Object.keys(this.config).some(key =>
      this.isModified(key as keyof NetworkConfig)
    );
  }
}
