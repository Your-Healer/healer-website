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
	ClipboardPlus,
} from "lucide-react";

export interface MenuItem {
	href: string;
	label: string;
	icon: any;
	role: string;
	positions: string[] | null;
	category?: string;
}

export const adminMenuItems: MenuItem[] = [
	{
		href: "/dashboard",
		label: "Tổng quan",
		icon: Home,
		role: "1",
		positions: null,
		category: "main",
	},
	{
		href: "/accounts",
		label: "Quản lý tài khoản",
		icon: Settings,
		role: "1",
		positions: null,
		category: "management",
	},
	{
		href: "/staffs",
		label: "Quản lý nhân sự",
		icon: Users,
		role: "1",
		positions: null,
		category: "management",
	},
	{
		href: "/patients",
		label: "Quản lý bệnh nhân",
		icon: UserCheck,
		role: "1",
		positions: null,
		category: "medical",
	},
	{
		href: "/medical-records",
		label: "Hồ sơ bệnh án",
		icon: ClipboardPlus,
		role: "1",
		positions: null,
		category: "medical",
	},
	{
		href: "/departments",
		label: "Khoa khám bệnh",
		icon: Building2,
		role: "1",
		positions: null,
		category: "facility",
	},
	{
		href: "/rooms",
		label: "Phòng khám bệnh",
		icon: Hospital,
		role: "1",
		positions: null,
		category: "facility",
	},
	{
		href: "/services",
		label: "Dịch vụ y tế",
		icon: Stethoscope,
		role: "1",
		positions: null,
		category: "medical",
	},
	{
		href: "/shiftWorkings",
		label: "Quản lý ca trực",
		icon: Clock,
		role: "1",
		positions: null,
		category: "operations",
	},
	{
		href: "/appointments",
		label: "Quản lý lịch hẹn",
		icon: Calendar,
		role: "1",
		positions: null,
		category: "operations",
	},
	// {
	// 	href: "/analytics",
	// 	label: "Phân tích & Báo cáo",
	// 	icon: BarChart3,
	// 	role: "1",
	// 	positions: null,
	// 	category: "reports",
	// },
];

export const staffMenuItems: MenuItem[] = [
	{
		href: "/dashboard",
		label: "Tổng quan",
		icon: Home,
		role: "2",
		positions: ["1", "3", "4"],
		category: "main",
	},
	{
		href: "/patients",
		label: "Quản lý bệnh nhân",
		icon: UserCheck,
		role: "2",
		positions: ["1", "3", "4"],
		category: "medical",
	},
	{
		href: "/medical-records",
		label: "Hồ sơ bệnh án",
		icon: ClipboardPlus,
		role: "2",
		positions: ["1"],
		category: "medical",
	},
	{
		href: "/shifts",
		label: "Quản lý ca trực",
		icon: Clock,
		role: "2",
		positions: ["3", "4"],
		category: "operations",
	},
	{
		href: "/appointments",
		label: "Quản lý lịch hẹn",
		icon: Calendar,
		role: "2",
		positions: ["1", "3", "4"],
		category: "operations",
	},
];
