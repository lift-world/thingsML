import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private statusSource = new Subject<'changed' | 'applied' | 'confirmed'>();
  status$ = this.statusSource.asObservable();

  async confirmChanges(fileBuffer: Uint8Array, currentData: any): Promise<boolean> {
    try {
      const savedData = await this.decodeInput(fileBuffer);
      console.log(savedData, currentData);
      const matches = this.deepCompare(savedData, currentData);
      this.statusSource.next(matches ? 'confirmed' : 'changed');
      return matches;
    } catch (error) {
      console.error('[EditorService] Error confirming changes:', error);
      this.statusSource.next('changed');
      return false;
    }
  }

  private async decodeInput(buffer: Uint8Array): Promise<any> {
    const textDecoder = new TextDecoder();
    return JSON.parse(textDecoder.decode(buffer));
  }

  private deepCompare(obj1: any, obj2: any): boolean {
    // Handle null/undefined cases
    if (obj1 === obj2) return true;
    if (obj1 === null || obj2 === null) return false;
    if (obj1 === undefined || obj2 === undefined) return false;

    // Handle different types
    if (typeof obj1 !== typeof obj2) return false;

    // Handle arrays
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) return false;
      return obj1.every((item, index) => this.deepCompare(item, obj2[index]));
    }

    // Handle objects
    if (typeof obj1 === 'object') {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      if (keys1.length !== keys2.length) return false;
      return keys1.every(key =>
        Object.prototype.hasOwnProperty.call(obj2, key) &&
        this.deepCompare(obj1[key], obj2[key])
      );
    }
    console.log(obj1, obj2);
    // Handle primitive values
    return obj1 === obj2;
  }
}
