import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recepcionist } from './recepcionist';

describe('Recepcionist', () => {
  let component: Recepcionist;
  let fixture: ComponentFixture<Recepcionist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recepcionist],
    }).compileComponents();

    fixture = TestBed.createComponent(Recepcionist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
