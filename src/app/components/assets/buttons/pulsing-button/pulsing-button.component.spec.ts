import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PulsingButtonComponent } from './pulsing-button.component';

describe('PulsingButtonComponent', () => {
  let component: PulsingButtonComponent;
  let fixture: ComponentFixture<PulsingButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PulsingButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PulsingButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
