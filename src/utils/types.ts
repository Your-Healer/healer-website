export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: "admin" | "receptionist";
	department: string;
	employeeId: string;
	avatar?: string;
	permissions: string[];
	phone?: string;
	address?: string;
	dateOfBirth?: string;
	joinDate?: string;
	bio?: string;
}

export interface Account {
	id: string;
	username: string;
	email: string;
	role: string;
	status: string;
	lastLogin: string;
	createdAt: string;
}

export interface MonthlyData {
	month: string;
	appointments: number;
	revenue: number;
	patients: number;
}

export interface YearlyData {
	year: string;
	appointments: number;
	revenue: number;
	patients: number;
}

export interface Appointment {
	id: string;
	patientName: string;
	doctorName: string;
	department: string;
	service: string;
	date: string;
	time: string;
	status: string;
	notes: string;
}

export interface Department {
	id: string;
	name: string;
	description: string;
	headOfDepartment: string;
	location: string;
	phone: string;
	status: string;
}

export interface Patient {
	id: string;
	name: string;
	email: string;
	phone: string;
	dateOfBirth: string;
	gender: string;
	address: string;
	emergencyContact: string;
	medicalHistory: string;
	status: string;
}

export interface Staff {
	id: string;
	name: string;
	email: string;
	role: string;
	department: string;
	phone: string;
	status: string;
}

export interface UserProfile {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
	dateOfBirth: string;
	role: string;
	department: string;
	employeeId: string;
	joinDate: string;
	bio: string;
	avatar: string;
}
