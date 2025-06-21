import { APPOINTMENTSTATUS } from "./enum";
import {
	DepartmentWithDetails,
	MedicalRoomWithDetails,
	Position,
	PositionStaffWithDetail,
	ShiftWorkingDetails,
	StaffWithDetails,
} from "../models/models";

export function getAppointmentStatusName(status: APPOINTMENTSTATUS) {
	switch (status) {
		case APPOINTMENTSTATUS.PAID:
			return "Đã thanh toán";
		case APPOINTMENTSTATUS.BOOKED:
			return "Đã đặt lịch";
		case APPOINTMENTSTATUS.CANCEL:
			return "Đã hủy";
		case APPOINTMENTSTATUS.IDLE:
			return "Chưa thanh toán";
	}
}

// Helper functions
export const getDepartmentName = (
	departments: DepartmentWithDetails[],
	departmentId: string
) => {
	if (departmentId === "all") return "Tất cả khoa";
	const dept = departments?.find((d) => d.id === departmentId);
	return dept?.name || "Không xác định";
};

export const getStaffName = (staffs: StaffWithDetails[], staffId: string) => {
	if (staffId === "all") return "Tất cả nhân viên";
	const staff = staffs?.find((s) => s.id === staffId);
	return `${staff?.firstname} ${staff?.lastname}` || "Không xác định";
};

export const getPositionName = (positions: Position[], positionId: string) => {
	if (positionId === "all") return "Tất cả chức vụ";

	// Handle static positions
	switch (positionId) {
		case "1":
			return "Bác sĩ";
		case "2":
			return "Y tá";
		case "3":
			return "Lễ tân";
		case "4":
			return "Trưởng khoa";
		default: {
			const position = positions?.find((pos) => pos.id === positionId);
			return position ? position.name : "Không xác định";
		}
	}
};

export const getEducationDisplayName = (level: string) => {
	switch (level) {
		case "DIPLOMA":
			return "Cao đẳng";
		case "ASSOCIATE":
			return "Liên thông";
		case "BACHELOR":
			return "Cử nhân";
		case "MASTER":
			return "Thạc sĩ";
		case "PROFESSIONAL":
			return "Chuyên nghiệp";
		default:
			return "Không xác định";
	}
};

export const getShiftStatus = (shiftWorking: ShiftWorkingDetails) => {
	const now = new Date();
	const fromTime = new Date(shiftWorking.fromTime);
	const toTime = new Date(shiftWorking.toTime);

	if (now < fromTime) {
		return {
			label: "Sắp tới",
			variant: "secondary" as const,
			color: "bg-blue-100 text-blue-800",
		};
	} else if (now >= fromTime && now <= toTime) {
		return {
			label: "Đang diễn ra",
			variant: "default" as const,
			color: "bg-green-100 text-green-800",
		};
	} else {
		return {
			label: "Đã kết thúc",
			variant: "outline" as const,
			color: "bg-gray-100 text-gray-800",
		};
	}
};

export function getMedicalRoomName(
	roomId?: string,
	rooms?: MedicalRoomWithDetails[]
) {
	if (!roomId || roomId === "all") return "Tất cả phòng";

	const room = rooms?.find((r) => r.id === roomId);
	return room ? room.name : "Không xác định";
}
