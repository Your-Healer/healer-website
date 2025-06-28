import PatientDetailsPage from '@/pages/medical-records/PatientDetails'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/medical-records/patients/$patientId')({
  component: PatientDetailsPage,
})