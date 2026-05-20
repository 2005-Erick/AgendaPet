export interface iUser {
  id: string;
  name: string;
  email: string;
  crmv?: string;
  cpf?: string;
  birthday: string;
  phone: string;
  role: user_role;
  created_at: string;
  updated_at: string;
}

export enum user_role {
  ADMIN = 'Admin',
  DOCTOR = 'Doctor',
  TUTOR = 'Tutor',
}
