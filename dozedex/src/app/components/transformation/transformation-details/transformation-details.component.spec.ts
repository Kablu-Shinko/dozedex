import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformationDetailsComponent } from './transformation-details.component';

describe('TransformationDetailsComponent', () => {
  let component: TransformationDetailsComponent;
  let fixture: ComponentFixture<TransformationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransformationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransformationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
