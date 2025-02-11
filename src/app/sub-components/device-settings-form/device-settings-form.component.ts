import { Component, Input } from '@angular/core';

interface DeviceSettings {
  deviceName: string;
  temperatureThreshold: number;
  updateInterval: number;
}

@Component({
  selector: 'app-device-settings-form',
  templateUrl: './device-settings-form.component.html',
  styleUrls: ['./device-settings-form.component.scss'],
})
export class DeviceSettingsFormComponent {
  @Input() settings: DeviceSettings = {
    deviceName: '',
    temperatureThreshold: 0,
    updateInterval: 0,
  };

  private initialSettings: DeviceSettings = {
    deviceName: '',
    temperatureThreshold: 0,
    updateInterval: 0,
  };

  ngOnInit() {
    // Store initial values when component initializes
    this.initialSettings = { ...this.settings };
  }

  isModified(fieldName: keyof DeviceSettings): boolean {
    return this.settings[fieldName] !== this.initialSettings[fieldName];
  }

  get isAnyFieldModified(): boolean {
    return Object.keys(this.settings).some((key) =>
      this.isModified(key as keyof DeviceSettings)
    );
  }
}
