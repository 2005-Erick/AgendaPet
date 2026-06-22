import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetsDetailModal } from './pets-detail-modal';

describe('PetsDetailModal', () => {
  let component: PetsDetailModal;
  let fixture: ComponentFixture<PetsDetailModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetsDetailModal],
    }).compileComponents();

    fixture = TestBed.createComponent(PetsDetailModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
