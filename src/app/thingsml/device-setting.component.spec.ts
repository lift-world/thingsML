import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSettingsComponent } from './device-setting.component';


describe('DeviceSettingComponent', () => {
  let component: DeviceSettingsComponent;
  let fixture: ComponentFixture<DeviceSettingsComponent>;


  beforeEach(async () => {
      await TestBed.configureTestingModule({
      imports: [DeviceSettingsComponent]
    })
    .compileComponents();


    fixture = TestBed.createComponent(DeviceSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
