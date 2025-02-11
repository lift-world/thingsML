import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-device-configuration-modal',
  templateUrl: './device-configuration-modal.component.html',
  styleUrl: './device-configuration-modal.component.scss',
})
export class DeviceConfigurationModalComponent implements OnInit {
  @Input() fileData: any;
  @Output() closeModal = new EventEmitter<{
    deviceName: string;
    temperatureThreshold: string;
    updateInterval: string;
    ipAddress: string;
    port: string;
  } | null>();

  selectedFields = {
    deviceName: '',
    temperatureThreshold: '',
    updateInterval: '',
    ipAddress: '',
    port: '',
  };
  fieldList: string[] = [];

  ngOnInit() {
    this.fieldList = this.flattenObjectKeys(this.fileData);
    this.selectedFields.deviceName =
      this.fieldList.find((field) => field.includes('device-name')) || '';
    this.selectedFields.temperatureThreshold =
      this.fieldList.find((field) => field.includes('temperature-threshold')) ||
      '';
    this.selectedFields.updateInterval =
      this.fieldList.find((field) => field.includes('update-interval')) || '';
    this.selectedFields.ipAddress =
      this.fieldList.find((field) => field.includes('ip-address')) || '';
    this.selectedFields.port =
      this.fieldList.find((field) => field.includes('port')) || '';
  }

  private flattenObjectKeys(obj: Record<string, any>): string[] {
    return Object.entries(obj).reduce((acc: string[], [key, value]) => {
      const newKey = key;

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return [...acc, ...this.flattenObjectKeys(value)];
      }

      return [...acc, newKey];
    }, []);
  }

  onClose(type: string): void {
    if (type == 'save') {
      this.closeModal.emit(this.selectedFields);
    } else this.closeModal.emit(null);
  }
}
