import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';

type ConnectionStatus = 'Disconnected' | 'Connecting' | 'Connected' | 'Error';

@Component({
  selector: 'app-device-settings',
  templateUrl: './device-setting.component.html',
  styleUrls: ['./device-setting.component.scss'],
})
export class DeviceSettingsComponent implements OnInit {
  deviceSettings = {
    deviceName: '',
    temperatureThreshold: 0,
    updateInterval: 0,
  };

  networkConfig = {
    ipAddress: '',
    port: 0,
  };

  connectionStatus: ConnectionStatus = 'Disconnected';
  isModified = false;
  isSaving = false;
  isConfirmed = false;
  showConfigModal = false;
  importedFileData: any = null;
  selectedFields = {};

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.loadSettings();
  }

  async loadSettings() {
    const settings = await this.settingsService.getSettings();
    const { networkConfig, ...deviceSettings } = settings;
    this.deviceSettings = { ...this.deviceSettings, ...deviceSettings };
    this.networkConfig = { ...this.networkConfig, ...networkConfig };
  }

  async saveAndApply() {
    this.isSaving = true;
    try {
      const combinedSettings = {
        ...this.deviceSettings,
        ...this.networkConfig,
      };
      await this.settingsService.updateSettings(combinedSettings);
      this.isSaving = false;
      this.isModified = false;
      this.isConfirmed = true;
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  importSettings(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          this.importedFileData = JSON.parse(e.target.result);
          this.showConfigModal = true;
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          // Handle error - maybe show a notification to user
        }
      };
      reader.readAsText(file);
    }
  }

  r(fieldName: string, field: string) {
    const field1 = Object.entries(this.selectedFields).find(
      ([key]) => key === fieldName
    )?.[1];
    if (!field1) return '';
    return (
      this.importedFileData && this.importedFileData[field]?.[field1 as string]
    );
  }

  makeData() {
    this.deviceSettings = {
      ...this.deviceSettings,
      deviceName:
        this.r('deviceName', 'device-settings') ||
        this.deviceSettings.deviceName,
      temperatureThreshold:
        Number(this.r('temperatureThreshold', 'device-settings')) ||
        this.deviceSettings.temperatureThreshold,
      updateInterval:
        Number(this.r('updateInterval', 'device-settings')) ||
        this.deviceSettings.updateInterval,
    };

    this.networkConfig = {
      ...this.networkConfig,
      ipAddress:
        this.r('ipAddress', 'network-configuration') ||
        this.networkConfig.ipAddress,
      port:
        Number(this.r('port', 'network-configuration')) ||
        this.networkConfig.port,
    };
    console.log(this.networkConfig);
  }

  closeConfigModal(selectedFields: any): void {
    if (selectedFields != null) {
      this.selectedFields = selectedFields;
      this.makeData();
    }
    this.showConfigModal = false;
    this.importedFileData = null;
  }

  retryConnection() {
    this.connectionStatus = 'Connecting';
    setTimeout(() => {
      this.connectionStatus = 'Connected';
    }, 2000);
  }
}
