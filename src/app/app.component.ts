import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ThingsML-FE';

  importSettings(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target?.result as string);
          console.log('Imported settings:', settings);
          // Handle the imported settings here
        } catch (error) {
          console.error('Error parsing settings file:', error);
        }
      };
      reader.readAsText(file);
    }
  }

  saveAndApplySettings(): void {
    // Implement save and apply logic here
    console.log('Saving and applying settings...');
  }
}
