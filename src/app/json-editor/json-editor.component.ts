import {
  Component,
  Input,
  Output,
  EventEmitter,
  InjectionToken,
  Inject,
  Optional,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { decode } from 'cbor-x/decode'

export interface Logger {
  info(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
}

export const LOGGER = new InjectionToken<Logger>('Logger');

@Component({
  selector: 'app-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    JsonEditorComponent,
  ],
})
export class JsonEditorComponent {
  @Input() data: any;
  @Output() dataChange = new EventEmitter<Record<string, any>>();
  @Input() disabled: boolean = false;
  @Input() modifiedFields: Set<string> = new Set();
  @Input() parentPath: string = '';
  @Input() file!: File;

  private readonly logger: Logger;

  constructor(@Optional() @Inject(LOGGER) logger: Logger | null) {
    this.logger = logger || console;
  }

  // async ngOnChanges(changes: SimpleChanges) {
  //   if (changes['file'] && changes['file'].currentValue) {
  //     const file = changes['file'].currentValue;
  //     const buffer = await file.arrayBuffer();
  //     await this.processInputFile(new Uint8Array(buffer));
  //   }
  // }

  onValueChange(key: string, event: any) {
    const value = event?.target?.value ?? event;
    const newData = { ...this.data };
    newData[key] = value;
    this.dataChange.emit(newData);
  }

  addField() {
    const newKey = this.generateUniqueKey();
    const updatedData = { ...this.data };
    updatedData[newKey] = '';
    this.dataChange.emit(updatedData);
  }

  private generateUniqueKey(): string {
    const baseKey = 'newField';
    let counter = 1;
    let newKey = baseKey;

    while (newKey in this.data) {
      newKey = `${baseKey}${counter}`;
      counter++;
    }
    return newKey;
  }

  removeField(key: string) {
    const updatedData = { ...this.data };
    delete updatedData[key];
    this.dataChange.emit(updatedData);
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }

  onKeyChange(oldKey: string, event: Event) {
    const newKey = (event.target as HTMLInputElement).value.trim();
    if (!newKey || newKey === oldKey || newKey in this.data) return; // Prevent invalid or duplicate keys

    this.dataChange.emit(
      Object.fromEntries(
        Object.entries(this.data).map(([key, value]) =>
          key === oldKey ? [newKey, value] : [key, value]
        )
      )
    );
    console.log(this.data);
  }

  trackByKey(index: number, key: string): string {
    return key;
  }

  getFullPath(key: string): string {
    return this.parentPath ? `${this.parentPath}.${key}` : key;
  }

  private getParentPath(): string {
    return this.parentPath;
  }

  isFieldModified(key: string): boolean {
    if (!this.modifiedFields) return false;

    // Check if the current key is directly modified
    if (this.modifiedFields.has(key)) return true;

    // Check if any parent path is modified
    const currentPath = this.getParentPath();
    const fullPath = currentPath ? `${currentPath}.${key}` : key;
    if (this.modifiedFields.has(fullPath)) return true;

    // Check if any child paths are modified
    for (const modifiedField of this.modifiedFields) {
      if (modifiedField.startsWith(fullPath + '.')) return true;
    }

    return false;
  }

  private async decodeInput(
    buffer: Uint8Array,
    format: 'json' | 'thingsml' = 'json'
  ): Promise<any> {
    if (!buffer || buffer.length === 0) {
      throw new Error('Empty buffer provided');
    }

    try {
      switch (format) {
        case 'json':
          const textDecoder = new TextDecoder();
          const firstChar = textDecoder.decode(buffer.slice(0, 1)).trim();
          if (firstChar !== '{' && firstChar !== '[') {
            this.logger.info(
              '[JsonEditor] Data appears to be ThingsML, attempting ThingsML decode'
            );
            return this.decodeInput(buffer, 'thingsml');
          }
          return JSON.parse(textDecoder.decode(buffer));

        case 'thingsml':

            // this.logger.info(
            //   '[JsonEditor] Attempting ThingsML decode with CBOR, buffer length:',
            //   thingsMLString
            // );

          try {
            if (!(buffer instanceof Uint8Array)) {
              throw new Error('Invalid CBOR data: Expected Uint8Array');
            }
            return decode(buffer as Uint8Array);
          } catch (cborError) {
            this.logger.error('[JsonEditor] CBOR decode failed:', cborError);
            throw cborError;
          }

        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      this.logger.error(`[JsonEditor] Failed to decode ${format} data:`, error);
      throw new Error(`Failed to decode ${format} data: ${error}`);
    }
  }

  public async processInputFile(fileBuffer: Uint8Array) {
    try {
      const decodedData = await this.decodeInput(new Uint8Array(fileBuffer), 'json');
      this.data = decodedData;
      this.dataChange.emit(decodedData);
    } catch (error) {
      this.logger.error('[JsonEditor] Error processing file:', error);
    }
  }
}
