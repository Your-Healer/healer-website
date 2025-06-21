export { PolkadotConnection, polkadotConnection } from "./polkadot-connection";
export { BlockService, blockService } from "./block-service";
export { TransactionService, transactionService } from "./transaction-service";
export type { BlockData, TransactionData } from "./polkadot-connection";

// Utility functions for blockchain operations
export async function initializeBlockchain(): Promise<void> {
	const { polkadotConnection } = await import("./polkadot-connection");
	await polkadotConnection.connect();
}

export async function disconnectBlockchain(): Promise<void> {
	const { polkadotConnection } = await import("./polkadot-connection");
	await polkadotConnection.disconnect();
}

export async function isBlockchainConnected(): Promise<boolean> {
	const { polkadotConnection } = await import("./polkadot-connection");
	return polkadotConnection.isApiConnected();
}
