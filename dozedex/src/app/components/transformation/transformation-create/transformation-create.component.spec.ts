import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformationCreateComponent } from './transformation-create.component';

describe('TransformationCreateComponent', () => {
  let component: TransformationCreateComponent;
  let fixture: ComponentFixture<TransformationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransformationCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransformationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
