import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DozedexSpacerComponent } from './dozedex-spacer.component';

describe('DozedexSpacerComponent', () => {
  let component: DozedexSpacerComponent;
  let fixture: ComponentFixture<DozedexSpacerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DozedexSpacerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DozedexSpacerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
