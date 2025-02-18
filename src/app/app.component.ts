import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConnectStateAlertComponent } from './sub-components/connect-state-alert/connect-state-alert.component';
import { TableEditComponent } from './sub-components/table-edit/table-edit.component';
import { JsonEditorComponent } from './json-editor/json-editor.component';
import * as Papa from 'papaparse';

interface StatusState {
  status: string;
  description: string;
}

// Update the status type
type StatusType = 'Changed' | 'Applied' | 'Confirmed' | 'No Changes' | 'Up to Date' | 'Saved' | 'Save Failed';

type ConnectionStatus = 'Connected' | 'Disconnected' | 'Connecting' | 'Error';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ConnectStateAlertComponent,
    TableEditComponent,
    JsonEditorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'ThingsML-FE';
  connectionStatus: ConnectionStatus = 'Disconnected';
  editMode: boolean = true; // Default to true if you want edit mode enabled by default

  jsonData = {
    "email": "user@gmail.com",
    "audience": "http://someaudience.com",
    "jti": "MYJTI12342",
    "name": "John Smith1",
    "details": {
      "address": "123 Main St",
      "city": "Metropolis",
      "zip": "123456"
    }
  }


  originalJsonData = { ...this.jsonData };

  csvData: string[][] = [];
  csvHeaders: string[] = [];

  // Update status properties to use the new type
  serverStatus: StatusType = 'Confirmed';
  serverStatusDescription = 'System is running normally';

  changeStatus: StatusType = 'No Changes';
  changeStatusDescription = 'No pending modifications';

  savedStatus: StatusType = 'Up to Date';
  savedStatusDescription = 'All changes are saved';

  // Add new property to track modified fields
  modifiedFields: Set<string> = new Set();
  file!: File;

  constructor() {}

  ngOnInit(): void {
    // Initialize component
    this.loadInitialData();
  }

  private loadInitialData(): void {
    // Load initial JSON data
    // TODO: Implement your data loading logic here
  }

  updateJson(newData: any) {
    this.jsonData = newData;
    this.updateModifiedFields(this.originalJsonData, this.jsonData);
    this.updateChangeStatus('Unsaved Changes', 'Modifications pending');
  }

  private updateModifiedFields(original: any, current: any, path: string = ''): void {
    for (const key in { ...original, ...current }) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof original[key] === 'object' && typeof current[key] === 'object') {
        this.updateModifiedFields(original[key], current[key], currentPath);
      } else if (JSON.stringify(original[key]) !== JSON.stringify(current[key])) {
        this.modifiedFields.add(currentPath);
      }
    }
    console.log(this.modifiedFields);
  }

  handleSearchChange(event: Event): void {
    const searchInput = event.target as HTMLInputElement;
    const searchValue = searchInput.value.toLowerCase();
    console.log('Search value:', searchValue);

    if (!searchValue) {
      this.jsonData = { ...this.originalJsonData };
      return;
    }

    // Create a filtered copy of the data structure
    const searchInObject = (obj: any): any => {
      const result: any = {};

      for (const [key, value] of Object.entries(obj)) {
        // Check if the key matches the search
        const keyMatches = key.toLowerCase().includes(searchValue);

        if (typeof value === 'object' && value !== null) {
          const nestedResult = searchInObject(value);
          if (Object.keys(nestedResult).length > 0 || keyMatches) {
            result[key] = keyMatches ? value : nestedResult;
          }
        } else if (
          keyMatches ||
          String(value).toLowerCase().includes(searchValue)
        ) {
          result[key] = value;
        }
      }

      return result;
    };

    const filtered = searchInObject(this.originalJsonData);
    this.jsonData = Object.keys(filtered).length > 0 ? filtered : this.jsonData;
  }

  importSettings(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.file = file;
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const content = e.target?.result as string;
        this.jsonData = JSON.parse(content);
        this.updateModifiedFields(this.originalJsonData, this.jsonData);
        this.updateChangeStatus('Changes Imported', 'New configuration loaded');
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        this.updateChangeStatus('Import Failed', 'Invalid JSON format');
      }
    };

    reader.onerror = () => {
      this.updateChangeStatus('Import Failed', 'Error reading file');
    };

    reader.readAsText(file);
  }

  saveChanges(): void {
    try {
      // TODO: Implement your save logic here
      this.originalJsonData = { ...this.jsonData };
      this.modifiedFields.clear(); // Clear modified fields after saving
      this.savedStatus = 'Saved';
      this.savedStatusDescription = `Last saved at ${new Date().toLocaleTimeString()}`;
      this.updateChangeStatus('No Changes', 'All changes are saved');
    } catch (error) {
      console.error('Error saving changes:', error);
      this.savedStatus = 'Save Failed';
      this.savedStatusDescription = 'Error occurred while saving';
    }
  }

  retryConnection(): void {
    this.connectionStatus = 'Connecting';
    // Implement your connection retry logic here
  }

  onCsvFileSelect(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const csv = reader.result as string;
      Papa.parse(csv, {
        complete: (result: Papa.ParseResult<string[]>) => {
          this.csvHeaders = result.data[0];
          this.csvData = result.data.slice(1);
          console.log('CSV imported:', {
            headers: this.csvHeaders,
            data: this.csvData,
          });
        },
      });
    };
  }

  deleteRow(index: number): void {
    this.csvData.splice(index, 1);
  }

  downloadCSV(): void {
    const csvContent = Papa.unparse([this.csvHeaders, ...this.csvData]);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'modified-data.csv';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  toggleEditMode(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.editMode = checkbox.checked;
    this.updateChangeStatus(
      this.editMode ? 'Edit Mode' : 'View Mode',
      this.editMode ? 'Changes can be made' : 'Read-only mode'
    );
  }

  private updateChangeStatus(status: string, description: string): void {
    this.changeStatus = status as StatusType;
    this.changeStatusDescription = description;
  }

  downloadJSON(): void {
    const jsonString = JSON.stringify(this.jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'settings.json';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  getChangeStatusColor(): string {
    switch (this.changeStatus) {
      case 'Changed':
        return 'text-yellow-500';
      case 'Applied':
        return 'text-orange-500';
      case 'Confirmed':
        return 'text-green-500';
      case 'No Changes':
        return 'text-gray-500';
      case 'Up to Date':
        return 'text-blue-500';
      case 'Saved':
        return 'text-green-500';
      case 'Save Failed':
        return 'text-red-500';
      default:
        return 'text-gray-500'; // default color
    }
  }

  getServerStatusColor(): string {
    switch (this.connectionStatus) {
      case 'Connected':
        return 'text-green-500';
      case 'Connecting':
        return 'text-yellow-500';
      case 'Disconnected':
        return 'text-gray-500';
      case 'Error':
        return 'text-red-500';
      default:
        return ''; // default color
    }
  }

  getSavedStatusColor(): string {
    switch (this.savedStatus) {
      case 'Saved':
        return 'text-green-500';
      case 'Save Failed':
        return 'text-red-500';
      case 'Up to Date':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  }
}
