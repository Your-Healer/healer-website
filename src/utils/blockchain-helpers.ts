/**
 * Helper functions for formatting and working with blockchain data
 */

/**
 * Formats a timestamp from blockchain (unix timestamp in seconds) to a readable date string
 */
export const formatBlockchainTimestamp = (
	timestamp?: string | number
): string => {
	if (!timestamp) return "Không có";

	try {
		// Convert to number if it's a string
		const ts = typeof timestamp === "string" ? parseInt(timestamp) : timestamp;
		const date = new Date(ts * 1000);

		return date.toLocaleDateString("vi-VN", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch (err) {
		console.error("Error formatting timestamp:", err);
		return String(timestamp);
	}
};

/**
 * Format wallet address to a shortened version
 */
export const formatWalletAddress = (address: string): string => {
	if (!address) return "Không có";
	if (address.length <= 10) return address;
	return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Format block hash to a shortened version
 */
export const formatBlockHash = (hash: string): string => {
	if (!hash) return "Không có";
	if (hash.length <= 16) return hash;
	return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
};

/**
 * Get full name from account object
 */
export const getFullNameFromAccount = (account: any): string => {
	if (!account) return "Không có tên";

	const firstName = account.staff?.firstname || account.user?.firstname || "";
	const lastName = account.staff?.lastname || account.user?.lastname || "";

	const fullName = `${firstName} ${lastName}`.trim();
	return fullName || "Không có tên";
};

/**
 * Check if a string is a valid UNIX timestamp (seconds since epoch)
 */
export const isValidTimestamp = (value: string | number): boolean => {
	const timestamp = typeof value === "string" ? parseInt(value) : value;

	// Reasonable timestamp range (2000-01-01 to 2100-01-01)
	const minTimestamp = 946684800; // 2000-01-01
	const maxTimestamp = 4102444800; // 2100-01-01

	return (
		!isNaN(timestamp) && timestamp >= minTimestamp && timestamp <= maxTimestamp
	);
};

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export const formatDateForInput = (timestamp?: string | number): string => {
	if (!timestamp || !isValidTimestamp(timestamp)) return "";

	try {
		const ts = typeof timestamp === "string" ? parseInt(timestamp) : timestamp;
		const date = new Date(ts * 1000);
		return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
	} catch (err) {
		console.error("Error formatting date for input:", err);
		return "";
	}
};

/**
 * Convert JS Date to blockchain timestamp (seconds since epoch)
 */
export const dateToBlockchainTimestamp = (date: Date | string): string => {
	try {
		const dateObj = typeof date === "string" ? new Date(date) : date;
		return Math.floor(dateObj.getTime() / 1000).toString();
	} catch (err) {
		console.error("Error converting date to blockchain timestamp:", err);
		return Math.floor(Date.now() / 1000).toString(); // Fallback to current time
	}
};
