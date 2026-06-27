export interface iPets {
  id?: string;
  tutor_id?: string;
  weight: number;
  name: string;
  breed: string;
  species: pets_species;
  birthday: Date;
  description: string;
  gender: 'MALE' | 'FEMALE';
}

export enum pets_species {
  CAT = 'Cat',
  DOG = 'Dog',
  BIRD = 'Bird',
  RODENT = 'Rodent',
  REPTILE = 'Reptile',
  OTHER = 'Other',
}
