import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSettingsFormComponent } from './device-settings-form.component';

describe('DeviceSettingsFormComponent', () => {
  let component: DeviceSettingsFormComponent;
  let fixture: ComponentFixture<DeviceSettingsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceSettingsFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeviceSettingsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
