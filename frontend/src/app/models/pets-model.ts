export interface iPets {
  id?: string;
  tutor_id: string;
  weight: number;
  name: string;
  breed: string;
  species: pets_species;
  birthday: string;
  description?: string;
  gender: 'MALE' | 'FEMALE';
  avatarUrl?: string;
}

export enum pets_species {
  CAT = 'CAT',
  DOG = 'DOG',
  BIRD = 'BIRD',
  RODENT = 'RODENT',
  REPTILE = 'REPTILE',
  OTHER = 'OTHER',
}
