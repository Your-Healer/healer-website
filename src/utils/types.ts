import {
	Account,
	Appointment,
	BookingTime,
	Department,
	LoggedInAccount,
	LoggedInStaff,
	LoggedInUser,
	MedicalRoom,
	MedicalRoomTime,
	Patient,
	Service,
	User,
	UserWithDetails,
} from "@/models/models";
import { IndentDecrease } from "lucide-react";
import { APPOINTMENTSTATUS, EDUCATIONLEVEL } from "./enum";

export interface LoginUsernameRequest {
	username: string;
	password: string;
}

export interface LoginEmailRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	message: string;
	token: string;
	staff?: LoggedInStaff;
	user?: LoggedInUser;
	account: LoggedInAccount;
	expiresIn: string;
}

export interface Pagination {
	page: number;
	limit: number;
}

export interface PaginationResponse<T> {
	data: T[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

export interface AccountFilter {
	roleId?: string;
	emailIsVerified?: boolean;
	searchTerm?: string;
}

export interface GetAllAccountsRequest extends Pagination, AccountFilter {}

export interface GetAccountStatistics {
	totalAccounts: number;
	verifiedAccounts: number;
	unverifiedAccounts: number;
	userAccounts: number;
	staffAccounts: number;
	adminAccounts: number;
	verificationRate: number;
}

export interface GetMyWallet {
	walletAddress: string;
	walletMnemonic: string;
}

export interface AppointmentOrderBy {
	orderByFromTime?: "asc" | "desc";
	orderByToTime?: "asc" | "desc";
}

export interface AppointmentFilter {
	userId?: string;
	staffId?: string;
	departmentId?: string;
	status?: APPOINTMENTSTATUS;
	date?: Date;
	fromDate?: Date;
	toDate?: Date;
}

export interface GetAppointmentsRequest
	extends Pagination,
		AppointmentFilter,
		AppointmentOrderBy {}

export interface GetPatientAppointmentHistoryRequest extends Pagination {
	status?: APPOINTMENTSTATUS;
}

export interface CreateAppointmentRequest {
	userId: string;
	patientId: string;
	medicalRoomTimeId: string;
	notes?: string;
}

export interface UpdateStatusAppointmentRequest {
	status: APPOINTMENTSTATUS;
}

export interface GetAllStaffs extends Pagination {
	departmentId?: string;
	positionId?: string;
	educationLevel?: EDUCATIONLEVEL;
	query?: string;
}

export interface PatientsFilter {
	userId?: string;
	searchTerm?: string;
	hasAppointments?: boolean;
	ageRange?: {
		min: number;
		max: number;
	};
	gender?: string;
	bloodType?: string;
}

export interface GetPatientsRequest extends Pagination, PatientsFilter {}

export interface DepartmentFilter {
	locationId?: string;
	floor?: number;
	searchTerm?: string;
}

export interface GetDepartmentsRequest extends Pagination, DepartmentFilter {}

export interface MedicalRoomFilter {
	departmentId?: string;
	serviceId?: string;
	floor?: number;
	available?: boolean;
	searchTerm?: string;
}

export interface GetMedicalRoomRequest extends Pagination, MedicalRoomFilter {}

export interface CreateMedicalRoomRequest {
	name: string;
	departmentId: string;
	serviceId: string;
	floor: number;
}

export interface UpdateMedicalRoomRequest
	extends Partial<CreateMedicalRoomRequest> {}

export interface GetShiftWorkingRequest extends Pagination {
	staffId?: string;
	roomId?: string;
	departmentId?: string;
	date?: Date;
	fromDate?: Date;
	toDate?: Date;
	status?: "upcoming" | "active" | "completed";
}

export interface CreateShiftWorkingRequest {
	staffId: string;
	roomId: string;
	fromTime: Date;
	toTime: Date;
}

export interface GetShiftWorkingStatisticsRequest {
	fromDate?: Date;
	toDate?: Date;
	departmentId?: string;
}

export interface GetShiftWorkingByDateRangRequest extends Pagination {
	fromDate?: Date;
	toDate?: Date;
}

export interface UpdateShiftWorkingRequest {
	staffId?: string;
	roomId?: string;
	fromTime?: Date;
	toTime?: Date;
}

export interface DeleteShiftWorkingRequest {
	id: string;
}

export interface TimeSlotFilter {
	roomId?: string;
	departmentId?: string;
	date?: Date;
	fromTime?: Date;
	toTime?: Date;
	available?: boolean;
}

export interface GetTimeSlotsRequest extends Pagination {
	filter: TimeSlotFilter;
}

export interface CreateMedicalRoomTimeRequest {
	roomId: string;
	fromTime: Date;
	toTime: Date;
}

export interface CreateAppointmentRequest {
	userId: string;
	patientId: string;
	medicalRoomTimeId: string;
	notes?: string;
}

export interface AdminDashboardStats {
	totalPatients: number;
	totalStaff: number;
	totalAppointments: number;
	todayAppointments: number;
	totalDepartments: number;
	totalMedicalRooms: number;
	monthlyRevenue: number;
	completedAppointments: number;
	pendingAppointments: number;
	cancelledAppointments: number;
	averageWaitTime: number;
	patientSatisfactionRate: number;
}

export interface DoctorDashboardStats {
	todayAppointments: number;
	upcomingAppointments: number;
	completedToday: number;
	totalPatients: number;
	averageConsultationTime: number;
	currentShifts: number;
	weeklyHours: number;
}

export interface RecentActivity {
	id: string;
	action: string;
	user: string;
	time: string;
	type: "appointment" | "patient" | "staff" | "system";
}
