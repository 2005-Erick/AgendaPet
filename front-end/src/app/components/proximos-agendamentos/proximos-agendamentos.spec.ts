import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProximosAgendamentos } from './proximos-agendamentos';

describe('ProximosAgendamentos', () => {
  let component: ProximosAgendamentos;
  let fixture: ComponentFixture<ProximosAgendamentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProximosAgendamentos],
    }).compileComponents();

    fixture = TestBed.createComponent(ProximosAgendamentos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
