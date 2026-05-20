export interface iAppointment {
  id: string;
  doctor_id: string;
  pet_id: string;
  schedule_at: string;
  type: appointment_type;
  status: appointment_status;
  created_at: string;
  updated_at: string;
}

export enum appointment_status {
  SCHEDULED = 'Scheduled',
  COMPLETED = 'Completed',
  CANCELED = 'Canceled',
  NO_SHOW = 'No Show',
}

export enum appointment_type {
  CONSULTATION = 'Consultation',
  VACCINATION = 'Vaccination',
  SURGERY = 'Surgery',
}
