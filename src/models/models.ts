import { APPOINTMENTSTATUS, EDUCATIONLEVEL } from "@/utils/enum";

export interface Attachment {
	id: string;
	fileName: string;
	directory: string;
	length: bigint;
	mediaType: string;
	createdAt: Date;
}

export interface Location {
	id: string;
	name: string;
	detail: string;
	street: string;
	city: string;
	country: string;
	lat: number;
	lng: number;
}

export interface Role {
	id: string;
	name: string;
	description?: string;
}

export interface Position {
	id: string;
	name: string;
}

export interface Service {
	id: string;
	name: string;
	description?: string;
	durationTime: number;
	price: number;
}

export interface PositionStaff {
	positionId: string;
	staffId: string;
}

export interface StaffOnDepartment {
	staffId: string;
	departmentId: string;
}

export interface MedicalRoom {
	id: string;
	departmentId: string;
	serviceId: string;
	floor: number;
	name: string;
}

export interface MedicalRoomTime {
	id: string;
	roomId: string;
	fromTime: Date;
	toTime: Date;
}

export interface BookingTime {
	id: string;
	medicalRoomTimeId: string;
	userId: string;
	patientId: string;
	accountId?: string;
}

export interface ShiftWorking {
	id: string;
	staffId: string;
	roomId: string;
	fromTime: Date;
	toTime: Date;
}

export interface AppointmentStatusLog {
	id: string;
	appointmentId: string;
	status: APPOINTMENTSTATUS;
	updatedAt: Date;
}

export interface DiagnosisSuggestion {
	id: string;
	appointmentId: string;
	suggestedByAI?: string;
	disease?: string;
	confidence: number;
	description?: string;
	createdAt: Date;
}

export interface Account {
	id: string;
	roleId: string;
	avatarId?: string;
	username: string;
	password: string;
	email?: string;
	phoneNumber?: string;
	walletAddress: string;
	walletMnemonic: string;
	emailIsVerified: boolean;
}

export interface LoggedInAccount {
	id: string;
	role?: {
		id: string;
		name: string;
	};
	avatar?: string;
	emailVerified: boolean;
}

export interface User {
	id: string;
	accountId: string;
	firstname: string;
	lastname: string;
	phoneNumber?: string;
	address?: string;
}

export interface LoggedInUser {
	id: string;
	firstname: string;
	lastname: string;
}

export interface Patient {
	id: string;
	userId: string;
	firstname: string;
	lastname: string;
	phoneNumber?: string;
	address?: string;
}

export interface Staff {
	id: string;
	accountId: string;
	firstname: string;
	lastname: string;
	introduction?: string;
	educationLevel?: EDUCATIONLEVEL;
}

export interface LoggedInStaff {
	id: string;
	firstname: string;
	lastname: string;
	positions?: { positionId: string }[];
}

export interface Appointment {
	id: string;
	medicalRoomId: string;
	userId: string;
	bookingTimeId: string;
	patientId: string;
	status: APPOINTMENTSTATUS;
}

export interface Department {
	id: string;
	locationId: string;
	name: string;
	symbol: string;
	floor: number;
}

// Extended interfaces for UI/business logic
export interface UserWithDetails extends User {
	email?: string;
	role?: string;
	department?: string;
	employeeId?: string;
	avatar?: string;
	permissions?: string[];
	dateOfBirth?: string;
	joinDate?: string;
	bio?: string;
}

export interface AccountWithRole extends Account {
	role: {
		id: string;
		name: string;
		description?: string;
	};
	avatar?: {
		id: string;
		fileName: string;
		directory: string;
	};
	status?: string;
	createdAt?: string;
}

export interface AccountWithDetails extends Account {
	role?: Role;
	avatar?: Attachment;
	user?: User;
	staff?: Staff & {
		positions?: Position[];
	};
}

export interface AppointmentWithDetails extends Appointment {
	patientName?: string;
	doctorName?: string;
	department?: string;
	service?: string;
	date?: string;
	time?: string;
	notes?: string;
}

export interface StaffWithDetails extends Staff {
	name?: string;
	email?: string;
	role?: string;
	department?: string;
	phone?: string;
	status?: string;
}

export interface PatientWithDetails extends Patient {
	name?: string;
	email?: string;
	phone?: string;
	dateOfBirth?: string;
	gender?: string;
	emergencyContact?: string;
	medicalHistory?: string;
	status?: string;
}
