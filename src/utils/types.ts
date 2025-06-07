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
import { APPOINTMENTSTATUS } from "./enum";

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

export interface AppointmentFilter {
	userId?: string;
	staffId?: string;
	departmentId?: string;
	status?: APPOINTMENTSTATUS;
	date?: Date;
	fromDate?: Date;
	toDate?: Date;
}

export interface GetAppointmentsRequest extends Pagination, AppointmentFilter {}

export interface GetAppointmentsResponse extends Appointment {
	user: User & Account;
	patient: Patient;
	medicalRoom: MedicalRoom & Service & Department;
	bookingTime: BookingTime & MedicalRoomTime;
}
