import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBeauticianComponent } from './select-beautician.component';

describe('SelectBeauticianComponent', () => {
  let component: SelectBeauticianComponent;
  let fixture: ComponentFixture<SelectBeauticianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectBeauticianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBeauticianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
