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
}
