export interface PetResponseDTO {
  id: string;
  name: string;
  avatarUrl?: string;
  weight: number;
  tutor_id: string;
  tutor_name: string;
  gender: PetGenderEnum;
  birthday: string;
  species: PetSpecies;
  breed: string;
  description: string;
  appointments?: AppointmentBasicDTO[];
  created_at: string;
  updated_at: string;
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

export interface AppointmentBasicDTO {
  id: string;
  scheduled_at: string;
  type: string;
  status: string;
}
