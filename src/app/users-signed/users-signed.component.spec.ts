import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSignedComponent } from './users-signed.component';

describe('UsersSignedComponent', () => {
  let component: UsersSignedComponent;
  let fixture: ComponentFixture<UsersSignedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersSignedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersSignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
