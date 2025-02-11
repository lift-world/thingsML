import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceConfigurationModalComponent } from './device-configuration-modal.component';

describe('DeviceConfigurationModalComponent', () => {
  let component: DeviceConfigurationModalComponent;
  let fixture: ComponentFixture<DeviceConfigurationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceConfigurationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeviceConfigurationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
