import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connect-state-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './connect-state-alert.component.html',
  styleUrl: './connect-state-alert.component.scss'
})
export class ConnectStateAlertComponent {
  @Input() status: 'Disconnected' | 'Connecting' | 'Connected' | 'Error' = 'Disconnected';
  @Output() retry = new EventEmitter<void>();

  retryConnection() {
    this.retry.emit();
  }

  getAlertClass() {
    switch (this.status) {
      case 'Connected':
        return 'mt-8 bg-green-50 border border-green-200 rounded-xl p-6';
      case 'Connecting':
        return 'mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6';
      case 'Error':
        return 'mt-8 bg-red-50 border border-red-200 rounded-xl p-6';
      case 'Disconnected':
      default:
        return 'mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6';
    }
  }

  getIconClass() {
    switch (this.status) {
      case 'Connected':
        return 'text-green-600';
      case 'Connecting':
        return 'text-blue-600 animate-spin';
      case 'Error':
        return 'text-red-600';
      case 'Disconnected':
      default:
        return 'text-yellow-600 animate-pulse';
    }
  }

  getIcon() {
    switch (this.status) {
      case 'Connected':
        return 'check_circle';
      case 'Connecting':
        return 'sync';
      case 'Error':
        return 'error';
      case 'Disconnected':
      default:
        return 'warning';
    }
  }
}
