import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function convertToVietnameseDate(rawDate: Date | string): string {
	const date = new Date(rawDate).toLocaleDateString("vi-VN", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});
	const hour = new Date(rawDate).toLocaleTimeString("vi-VN");
	return `${date} ${hour}`;
}
