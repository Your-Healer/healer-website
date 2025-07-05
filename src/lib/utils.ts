import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS
 * Uses clsx to combine class names and twMerge to handle Tailwind specific class merging
 */
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
