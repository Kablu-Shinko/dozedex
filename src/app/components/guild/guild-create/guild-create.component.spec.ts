import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildCreateComponent } from './guild-create.component';

describe('GuildCreateComponent', () => {
  let component: GuildCreateComponent;
  let fixture: ComponentFixture<GuildCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuildCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuildCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
