import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreedCreateComponent } from './breed-create.component';

describe('BreedCreateComponent', () => {
  let component: BreedCreateComponent;
  let fixture: ComponentFixture<BreedCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreedCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreedCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
