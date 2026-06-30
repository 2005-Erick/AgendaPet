export interface PetCreateDTO {
  name: string;
  weight: number;
  breed: string;
  species: PetSpecies;
  birthday: string;
  description: string;
  gender: PetGenderEnum;
}

export enum PetGenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum PetSpecies {
  CAT = 'CAT',
  DOG = 'DOG',
  BIRD = 'BIRD',
  RODENT = 'RODENT',
  REPTILE = 'REPTILE',
  OTHER = 'OTHER',
}
