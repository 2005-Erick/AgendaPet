import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPets } from './admin-pets';

describe('AdminPets', () => {
  let component: AdminPets;
  let fixture: ComponentFixture<AdminPets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPets],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create, edit and delete a pet', () => {
    component.newPet.set({
      id: 0,
      nome: 'Malu',
      imagem: '',
      raca: 'Poodle',
      idade: 2,
      status: 'Ativo',
      proximo: '20/07',
    });

    component.createPet();

    expect(component.pets().length).toBe(3);

    const pet = component.pets()[2];
    component.openEditModal(pet);
    component.editPet.set({ ...component.editPet(), nome: 'Malu Editada' });
    component.saveEditedPet();

    expect(component.pets()[2].nome).toBe('Malu Editada');

    spyOn(window, 'confirm').and.returnValue(true);
    component.deletePet(pet.id);

    expect(component.pets().length).toBe(2);
  });
});
