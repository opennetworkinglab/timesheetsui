import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupTextComponent } from './popup-text.component';

describe('PopupTextComponent', () => {
  let component: PopupTextComponent;
  let fixture: ComponentFixture<PopupTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
