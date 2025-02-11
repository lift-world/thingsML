import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectStateAlertComponent } from './connect-state-alert.component';

describe('ConnectStateAlertComponent', () => {
  let component: ConnectStateAlertComponent;
  let fixture: ComponentFixture<ConnectStateAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectStateAlertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectStateAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
