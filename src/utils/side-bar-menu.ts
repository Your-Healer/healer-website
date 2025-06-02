import {
	Users,
	UserCheck,
	Calendar,
	Building2,
	Stethoscope,
	Clock,
	Settings,
	Home,
	Hospital,
	BarChart3,
} from "lucide-react";

export interface MenuItem {
	href: string;
	label: string;
	icon: any;
	permission: string | null;
}

export const adminMenuItems: MenuItem[] = [
	{
		href: "/admin",
		label: "Dashboard",
		icon: Home,
		permission: null,
	},
	{
		href: "/admin/accounts",
		label: "Account Management",
		icon: Settings,
		permission: "user.read",
	},
	{
		href: "/admin/staff",
		label: "Staff Management",
		icon: Users,
		permission: "staff.read",
	},
	{
		href: "/admin/patients",
		label: "Patient Management",
		icon: UserCheck,
		permission: "patient.read",
	},
	{
		href: "/admin/departments",
		label: "Medical Departments",
		icon: Building2,
		permission: "system.settings",
	},
	{
		href: "/admin/rooms",
		label: "Medical Rooms",
		icon: Hospital,
		permission: "system.settings",
	},
	{
		href: "/admin/services",
		label: "Medical Services",
		icon: Stethoscope,
		permission: "system.settings",
	},
	{
		href: "/admin/shifts",
		label: "Staff Shifts",
		icon: Clock,
		permission: "staff.read",
	},
	{
		href: "/admin/appointments",
		label: "Appointments",
		icon: Calendar,
		permission: "appointment.read",
	},
	{
		href: "/admin/analytics",
		label: "Analytics & Reports",
		icon: BarChart3,
		permission: "analytics.read",
	},
];

export const receptionistMenuItems: MenuItem[] = [
	{
		href: "/receptionist/dashboard",
		label: "Dashboard",
		icon: Home,
		permission: null,
	},
	{
		href: "/receptionist/patients",
		label: "Patient Management",
		icon: UserCheck,
		permission: "patient.read",
	},
	{
		href: "/receptionist/shifts",
		label: "Staff Shifts",
		icon: Clock,
		permission: null,
	},
];
