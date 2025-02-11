import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private settings = {
    deviceName: '',
    temperatureThreshold: 10,
    updateInterval: 1000,
    networkConfig: { ipAddress: '', port: 0 },
  };

  async getSettings() {
    return Promise.resolve(this.settings);
  }

  async updateSettings(updatedSettings: any) {
    this.settings = updatedSettings;
    return Promise.resolve();
  }

  async importSettings(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          resolve(JSON.parse(reader.result as string));
        } catch (error) {
          reject('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    });
  }
}
