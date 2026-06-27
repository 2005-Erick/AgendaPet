export interface IAppointment {
  id?: string; 
  doctor_id?: string; 
  pet_id?: string; 
  scheduled_at: Date; 
  type: appointment_type ; 
  status: appointments_status; 
  price: number; 
  payment_status: payment_status_enum ; 
  note?: string; 
  created_at?: Date; 
  updated_at?: Date; 
}

export enum appointments_status {
  CONSULTATION = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  NO_SHOW = 'NO_SHOW'
}
export enum appointment_type {
  CONSULTATION = 'Consultation',
  VACCINATION = 'Vaccination',
  SURGERY = 'Surgery',
}

export enum payment_status_enum {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED'
}