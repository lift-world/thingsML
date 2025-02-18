import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConnectStateAlertComponent } from './sub-components/connect-state-alert/connect-state-alert.component';
import { TableEditComponent } from './sub-components/table-edit/table-edit.component';
import { JsonEditorComponent } from './json-editor/json-editor.component';
import * as Papa from 'papaparse';
import { EditorService } from './services/editor.service';

interface StatusState {
  status: string;
  description: string;
}

// Simplified status types
type StatusType = 'Changed' | 'Applied' | 'Confirmed' | 'No Changes' | 'Saved' | 'Save Failed' | 'Up to Date';
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
    email: 'user@gmail.com',
    audience: 'http://someaudience.com',
    jti: 'MYJTI12342',
    name: 'John Smith1',
    address: '123 Main St',
    city: 'Metropolis',
    zip: '123456',
  };

  originalJsonData = { ...this.jsonData };

  csvData: string[][] = [];
  csvHeaders: string[] = [];
  serverStatus: StatusType = 'Confirmed';
  changeStatus: StatusType = 'No Changes';
  savedStatus: StatusType = 'Up to Date';
  modifiedFields: Set<string> = new Set();
  file!: File;

  serverStatusDescription = 'System is running normally';
  changeStatusDescription = 'No pending modifications';
  savedStatusDescription = 'All changes are saved';

  constructor(private editorService: EditorService) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    // Load initial JSON data
    // TODO: Implement your data loading logic here
  }

  updateJson(newData: any) {
    this.jsonData = newData;
    this.updateModifiedFields(this.originalJsonData, this.jsonData);
    this.updateChangeStatus('Changed', 'Modifications pending');
  }

  private updateModifiedFields(original: any, current: any, path: string = ''): void {
    // Clear existing fields if at root level
    if (!path) {
      this.modifiedFields.clear();
    }

    // Handle cases where either value is null/undefined
    if (original === undefined || original === null || current === undefined || current === null) {
      if (original !== current) {
        this.modifiedFields.add(path);
      }
      return;
    }

    // Handle different types
    if (typeof original !== typeof current) {
      this.modifiedFields.add(path);
      return;
    }

    // Handle arrays
    if (Array.isArray(original) && Array.isArray(current)) {
      if (original.length !== current.length) {
        this.modifiedFields.add(path);
      } else {
        original.forEach((value, index) => {
          const currentPath = path ? `${path}[${index}]` : `[${index}]`;
          this.updateModifiedFields(value, current[index], currentPath);
        });
      }
      return;
    }

    // Handle objects
    if (typeof original === 'object' && typeof current === 'object') {
      const allKeys = new Set([...Object.keys(original), ...Object.keys(current)]);

      allKeys.forEach(key => {
        const currentPath = path ? `${path}.${key}` : key;

        if (!(key in original) || !(key in current)) {
          this.modifiedFields.add(currentPath);
        } else {
          this.updateModifiedFields(original[key], current[key], currentPath);
        }
      });
      return;
    }

    // Handle primitive values
    if (original !== current) {
      this.modifiedFields.add(path);
    }
  }

  handleSearchChange(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    if (!searchValue) {
      this.jsonData = { ...this.originalJsonData };
      return;
    }

    const filtered = this.searchInObject(this.originalJsonData, searchValue);
    this.jsonData = Object.keys(filtered).length > 0 ? filtered : this.jsonData;
  }

  private searchInObject(obj: any, searchValue: string): any {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const keyMatches = key.toLowerCase().includes(searchValue);
      if (typeof value === 'object' && value !== null) {
        const nestedResult = this.searchInObject(value, searchValue);
        if (Object.keys(nestedResult).length > 0 || keyMatches) {
          result[key] = keyMatches ? value : nestedResult;
        }
      } else if (keyMatches || String(value).toLowerCase().includes(searchValue)) {
        result[key] = value;
      }
    }
    return result;
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
        // Check if the imported data differs from original
        const hasChanges = this.modifiedFields.size > 0;
        this.updateChangeStatus(
          hasChanges ? 'Changed' : 'Confirmed',
          hasChanges ? 'New configuration loaded with changes' : 'New configuration matches original'
        );
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        this.updateChangeStatus('Save Failed', 'Invalid JSON format');
      }
    };

    reader.onerror = () => {
      this.updateChangeStatus('Save Failed', 'Error reading file');
    };

    reader.readAsText(file);
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

  saveChanges(): void {
    try {
      this.originalJsonData = { ...this.jsonData };
      this.modifiedFields.clear();
      this.savedStatus = 'Saved';
      this.updateChangeStatus('Applied', 'Changes have been applied');
    } catch (error) {
      console.error('Error saving changes:', error);
      this.savedStatus = 'Save Failed';
    }
  }

  retryConnection(): void {
    this.connectionStatus = 'Connecting';
    // Implement your connection retry logic here
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
      this.editMode ? 'Changed' : 'No Changes',
      this.editMode ? 'Changes can be made' : 'Read-only mode'
    );
  }

  private updateChangeStatus(status: StatusType, description: string): void {
    this.changeStatus = status;
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

  async confirmChanges() {
    if (!this.file) {
      console.error('No file available to confirm changes');
      return;
    }

    try {
      const buffer = await this.file.arrayBuffer();
      // Compare with originalJsonData instead of file content
      this.updateModifiedFields(this.originalJsonData, this.jsonData);
      const hasChanges = this.modifiedFields.size > 0;

      if (this.savedStatus === 'Saved') {
        this.updateChangeStatus('Applied', 'Changes have been applied');
      } else {
        this.updateChangeStatus(
          hasChanges ? 'Changed' : 'Confirmed',
          hasChanges ? 'Changes detected from original' : 'No changes from original'
        );
      }
    } catch (error) {
      console.error('Error confirming changes:', error);
      this.updateChangeStatus('Save Failed', 'Error confirming changes');
    }
  }

  getStatusColor(status: StatusType): string {
    const colorMap: Record<string, string> = {
      'Changed': 'text-yellow-500',
      'Applied': 'text-orange-500',
      'Confirmed': 'text-green-500',
      'No Changes': 'text-gray-500',
      'Up to Date': 'text-blue-500',
      'Saved': 'text-green-500',
      'Save Failed': 'text-red-500'
    };
    return colorMap[status] || 'text-gray-500';
  }
}
