import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendamentosPage } from './agendamentos-page';

describe('AgendamentosPage', () => {
  let component: AgendamentosPage;
  let fixture: ComponentFixture<AgendamentosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendamentosPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendamentosPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
