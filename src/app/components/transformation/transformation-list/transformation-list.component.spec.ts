import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformationListComponent } from './transformation-list.component';

describe('TransformationListComponent', () => {
  let component: TransformationListComponent;
  let fixture: ComponentFixture<TransformationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransformationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransformationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
