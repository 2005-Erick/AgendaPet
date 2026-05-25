import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuportPage } from './suport-page';

describe('SuportPage', () => {
  let component: SuportPage;
  let fixture: ComponentFixture<SuportPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuportPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SuportPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
