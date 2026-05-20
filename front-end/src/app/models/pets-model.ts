export interface iPets {
  id: string;
  tutor_id: string;
  name: string;
  breed: string;
  species: pets_species;
  bithday: string;
}

export enum pets_species {
  CAT = 'Cat',
  DOG = 'Dog',
  BIRD = 'Bird',
  RODENT = 'Rodent',
  REPTILE = 'Reptile',
  OTHER = 'Other',
}
