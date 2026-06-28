import { TestBed } from '@angular/core/testing';

import { DoctorsServices } from './doctors-service';

describe('DoctorsServices', () => {
  let service: DoctorsServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorsServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
