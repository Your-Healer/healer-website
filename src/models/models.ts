import {
	APPOINTMENTSTATUS,
	BLOCKCHAIN_OPERATION_TYPE,
	BLOCKCHAIN_RECORD_TYPE,
	EDUCATIONLEVEL,
} from "@/utils/enum";

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
	medicalRoom: MedicalRoomWithDetails;
	user: UserWithDetails;
	patient: PatientWithDetails;
	bookingTime: BookingTimeWithDetails;

	suggestions: DiagnosisSuggestionWithDetails[];
	statusLogs: AppointmentStatusLogWithDetails[];
}

export interface PositionStaffWithDetail extends PositionStaff {
	position: Position;
}

export interface StaffOnDepartmentWithDetail extends StaffOnDepartment {
	staff: StaffWithDetails;
	department: DepartmentWithDetails;
}

export interface StaffWithDetails extends Staff {
	account: AccountWithDetails;
	positions: PositionStaffWithDetail[];
	departments: StaffOnDepartmentWithDetail[];
	shifts: ShiftWorkingDetails[];
}

export interface PatientWithDetails extends Patient {
	user: UserWithDetails;
	BookingTime: BookingTimeWithDetails[];
	Appointment: AppointmentWithDetails[];
}

export interface DepartmentWithDetails extends Department {
	location?: LocationWithDetails;
	staffAssignments?: StaffOnDepartmentWithDetail[];
}

export interface LocationWithDetails extends Location {
	departments?: DepartmentWithDetails[];
}

export interface ShiftWorkingDetails extends ShiftWorking {
	staff?: StaffWithDetails;
	room?: MedicalRoomWithDetails;
}
export interface MedicalRoomWithDetails extends MedicalRoom {
	department: DepartmentWithDetails;
	service: ServiceWithDetails;
	times: MedicalRoomTimeWithDetails[];
	appointments: AppointmentWithDetails[];
	shifts: ShiftWorkingDetails[];
}

export interface MedicalRoomTimeWithDetails extends MedicalRoomTime {
	room: MedicalRoomWithDetails;
	bookings: BookingTimeWithDetails[];
}

export interface ServiceWithDetails extends Service {
	medicalRooms: MedicalRoomWithDetails[];
}

export interface BookingTimeWithDetails extends BookingTime {
	medicalRoomTime: MedicalRoomTimeWithDetails;
	user: UserWithDetails;
	patient: PatientWithDetails;
	appointment: AppointmentWithDetails[];
	Account?: AccountWithDetails;
}

export interface DiagnosisSuggestionWithDetails extends DiagnosisSuggestion {
	appointment: AppointmentWithDetails;
}

export interface AppointmentStatusLogWithDetails extends AppointmentStatusLog {
	appointment: AppointmentWithDetails;
}

export interface BlockchainPatientWithDetails {
	patientId: string;
	patientName: string;
	dateOfBirth: string; // timestamp
	gender: string;
	address: string;
	phoneNumber: string;
	emergencyContact: string; // "EMPTY" if not provided
	createdAt: string; // block number
	createdBy: string; // creator's wallet address
	createByAccount: AccountWithDetails;
	lastModifiedAt: string; // block number
	lastModifiedBy: string; // modifier's wallet address
	lastModifiedByAccount: AccountWithDetails;
}

export interface BlockchainClinicalTestWithDetails {
	testId: string;
	patientId: string;
	doctorId: string;
	doctorAccount: AccountWithDetails;
	testType: string;
	testDate: string; // timestamp
	result: string;
	notes: string;
	createdAt: string;
	createdBy: string;
	createByAccount: AccountWithDetails;
	lastModifiedAt: string; // block number
	lastModifiedBy: string; // modifier's wallet address
	lastModifiedByAccount: AccountWithDetails;
}

export interface BlockchainPatientClinicalTestWithDetails
	extends BlockchainPatientWithDetails {
	tests: BlockchainClinicalTestWithDetails[];
}

export interface BlockchainDiseaseProgressionWithDetails {
	progressionId: string;
	patientId: string;
	doctorId: string;
	doctorAccount: AccountWithDetails;
	visitDate: string;
	symptoms: string;
	diagnosis: string;
	treatment: string;
	prescription: string;
	nextAppointment: string; // timestamp
	createdAt: string;
	createdBy: string;
	createByAccount: AccountWithDetails;
	lastModifiedAt: string; // block number
	lastModifiedBy: string; // modifier's wallet address
	lastModifiedByAccount: AccountWithDetails;
}

export interface BlockchainPatientDiseaseProgressionWithDetails
	extends BlockchainPatientWithDetails {
	progressions: BlockchainDiseaseProgressionWithDetails[];
}

export interface BlockchainMedicalRecordWithDetails {
	recordId: string;
	patientId: string;
	doctorId: string;
	doctorAccount: AccountWithDetails;
	recordHash: string;
	dataPointer: string | null;
	diagnosis: string;
	treatment: string;
	createdAt: string;
	createdBy: string;
	createByAccount: AccountWithDetails;
	lastModifiedAt: string; // block number
	lastModifiedBy: string; // modifier's wallet address
	lastModifiedByAccount: AccountWithDetails;
}

export interface BlockchainPatientMedicalRecordWithDetails
	extends BlockchainPatientWithDetails {
	records: BlockchainMedicalRecordWithDetails[];
}

export interface BlockchainChangeHistoryWithDetails {
	changeId: string;
	recordType: BLOCKCHAIN_RECORD_TYPE;
	recordId: string;
	fieldName: string;
	oldValue: string;
	newValue: string;
	changedBy: string;
	changeByAccount: AccountWithDetails;
	changedAt: string;
	operation: BLOCKCHAIN_OPERATION_TYPE;
}
