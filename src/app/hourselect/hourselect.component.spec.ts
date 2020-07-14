import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HourselectComponent } from './hourselect.component';

describe('HourselectComponent', () => {
  let component: HourselectComponent;
  let fixture: ComponentFixture<HourselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HourselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HourselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
