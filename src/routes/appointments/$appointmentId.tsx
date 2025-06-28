import AppointmentDetailsPage from '@/pages/appointments/AppointmentDetails'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/appointments/$appointmentId')({
  component: AppointmentDetailsPage,
})