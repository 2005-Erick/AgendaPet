import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAppointments } from './admin-appointments';

describe('AdminAppointments', () => {
  let component: AdminAppointments;
  let fixture: ComponentFixture<AdminAppointments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAppointments],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAppointments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create, edit and delete an appointment', () => {
    component.newAppointment.set({
      id: 0,
      petName: 'Cacau',
      ownerName: 'Marta',
      date: '2026-07-20',
      time: '15:00',
      type: 'Consulta',
      status: 'Confirmado',
    });

    component.createAppointment();

    expect(component.appointments().length).toBe(3);

    const appointment = component.appointments()[2];
    component.openEditModal(appointment);
    component.editAppointment.set({ ...component.editAppointment(), status: 'Cancelado' });
    component.saveEditedAppointment();

    expect(component.appointments()[2].status).toBe('Cancelado');

    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteAppointment(appointment.id);

    expect(component.appointments().length).toBe(2);
  });
});
