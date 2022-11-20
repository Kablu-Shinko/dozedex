import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DozedexDriveComponent } from './dozedex-drive.component';

describe('DozedexDriveComponent', () => {
  let component: DozedexDriveComponent;
  let fixture: ComponentFixture<DozedexDriveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DozedexDriveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DozedexDriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
