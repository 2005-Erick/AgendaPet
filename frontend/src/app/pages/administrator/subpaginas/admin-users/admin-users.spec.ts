import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsers } from './admin-users';

describe('AdminUsers', () => {
  let component: AdminUsers;
  let fixture: ComponentFixture<AdminUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUsers],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUsers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create, edit and delete a user', () => {
    component.newUser.set({
      id: 0,
      name: 'Carlos',
      email: 'carlos@email.com',
      cpf: '111.222.333-44',
      phone: '(83) 97777-4444',
      role: 'Tutor',
      status: 'Ativo',
    });

    component.createUser();

    expect(component.users().length).toBe(3);

    const user = component.users()[2];
    component.openEditModal(user);
    component.editUser.set({ ...component.editUser(), role: 'Administrador' });
    component.saveEditedUser();

    expect(component.users()[2].role).toBe('Administrador');

    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteUser(user.id);

    expect(component.users().length).toBe(2);
  });
});
