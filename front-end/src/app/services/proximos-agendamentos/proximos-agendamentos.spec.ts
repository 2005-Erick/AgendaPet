import { TestBed } from '@angular/core/testing';

import { ProximosAgendamentos } from './proximos-agendamentos';

describe('ProximosAgendamentos', () => {
  let service: ProximosAgendamentos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProximosAgendamentos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
