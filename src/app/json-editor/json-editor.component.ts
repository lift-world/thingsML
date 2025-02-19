import {
  Component,
  Input,
  Output,
  EventEmitter,
  InjectionToken,
  Inject,
  Optional,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { decode } from 'cbor-x/decode'
import { EditorService } from '../services/editor.service';

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
export class JsonEditorComponent implements OnInit {
  @Input() data: any;
  @Output() dataChange = new EventEmitter<Record<string, any>>();
  @Input() disabled: boolean = false;
  @Input() modifiedFields: Set<string> = new Set();
  @Input() parentPath: string = '';
  @Input() file!: File;
  @Input() status: 'changed' | 'applied' | 'confirmed' = 'confirmed';
  @Output() statusChange = new EventEmitter<'changed' | 'applied' | 'confirmed'>();

  private readonly logger: Logger;
  private originalData: any = {};

  constructor(
    @Optional() @Inject(LOGGER) logger: Logger | null,
    private editorService: EditorService
  ) {
    this.logger = logger || console;

    this.editorService.status$.subscribe(status => {
      this.status = status;
      this.statusChange.emit(status);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].firstChange) {
      this.originalData = JSON.parse(JSON.stringify(this.data));
    }
    if (changes['data'] && !changes['data'].firstChange) {
      this.updateStatus('changed');
    }
  }

  onValueChange(key: string, event: any) {
    const value = event?.target?.value ?? event;
    const newData = { ...this.data };
    newData[key] = value;

    if (this.originalData[key] === value) {
      this.modifiedFields.delete(key);
    } else {
      this.modifiedFields.add(key);
    }

    this.dataChange.emit(newData);
    this.updateStatus('changed');
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
    if (!newKey || newKey === oldKey || newKey in this.data) return;

    this.dataChange.emit(
      Object.fromEntries(
        Object.entries(this.data).map(([key, value]) =>
          key === oldKey ? [newKey, value] : [key, value]
        )
      )
    );
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
    if (this.modifiedFields.has(key)) {
      if (this.data[key] === this.originalData[key]) {
        this.modifiedFields.delete(key);
        return false;
      }
      return true;
    }

    const currentPath = this.getParentPath();
    const fullPath = currentPath ? `${currentPath}.${key}` : key;
    if (this.modifiedFields.has(fullPath)) return true;

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

  private updateStatus(newStatus: 'changed' | 'applied' | 'confirmed') {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.statusChange.emit(newStatus);
    }
  }

  async confirmChanges(fileBuffer: Uint8Array) {
    try {
      const savedData = await this.decodeInput(fileBuffer);
      if (JSON.stringify(savedData) === JSON.stringify(this.data)) {
        this.updateStatus('confirmed');
      } else {
        this.updateStatus('changed');
        this.logger.warn('[JsonEditor] Saved data does not match expected changes');
      }
    } catch (error) {
      this.logger.error('[JsonEditor] Error confirming changes:', error);
      this.updateStatus('changed');
      this.promptRetry('Error confirming changes. Would you like to retry?');
    }
  }

  private promptRetry(message: string): void {
    // Open the modal by setting the checkbox to checked
    const modalCheckbox = document.getElementById('retry-modal') as HTMLInputElement;
    if (modalCheckbox) {
      modalCheckbox.checked = true;
    }
  }

  public async processInputFile(fileBuffer: Uint8Array) {
    try {
      const decodedData = await this.decodeInput(new Uint8Array(fileBuffer), 'json');
      this.data = decodedData;
      this.dataChange.emit(decodedData);
      this.updateStatus('confirmed');
    } catch (error) {
      this.logger.error('[JsonEditor] Error processing file:', error);
    }
  }

  ngOnInit() {
    // Additional initialization logic if needed
  }
}
