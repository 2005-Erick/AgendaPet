import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarConsultaModal } from './agendar-consulta-modal';

describe('AgendarConsultaModal', () => {
  let component: AgendarConsultaModal;
  let fixture: ComponentFixture<AgendarConsultaModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendarConsultaModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendarConsultaModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
