import { TestBed } from '@angular/core/testing';

import { HistoricoAnimalService } from './historico-animal';

describe('HistoricoAnimal', () => {
  let service: HistoricoAnimalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoricoAnimalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
