export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  gender: GenderEnum;
  birthday: string;
  roles: RoleEnum[];
  created_at: string;
}

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum RoleEnum {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  TUTOR = 'TUTOR',
  RECEPTIONIST = 'RECEPTIONIST',
}
