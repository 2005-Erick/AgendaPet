import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsPet } from './cards-pet';

describe('Cards', () => {
  let component: CardsPet;
  let fixture: ComponentFixture<CardsPet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsPet],
    }).compileComponents();

    fixture = TestBed.createComponent(CardsPet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
