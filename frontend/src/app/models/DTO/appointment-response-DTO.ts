export interface AppointmentResponseDTO {
  id: string;
  doctor_id: string;
  doctor_name: string;
  pet_id: string;
  pet_name: string;
  scheduled_at: string;
  type: AppointmentTypes;
  status: AppointmentStatus;
  price: number;
  paymentStatus: PaymentStatus;
  note?: string;
  created_at: string;
}

export enum AppointmentTypes {
  CONSULTATION = 'CONSULTATION',
  VACCINATION = 'VACCINATION',
  SURGERY = 'SURGERY',
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  NO_SHOW = 'NO_SHOW',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}
