import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetsPage } from './pets-page';

describe('PetsPage', () => {
  let component: PetsPage;
  let fixture: ComponentFixture<PetsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PetsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
