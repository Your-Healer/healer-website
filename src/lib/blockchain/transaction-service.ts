import { polkadotConnection, TransactionData } from "./polkadot-connection";
import { blockService } from "./block-service";

export class TransactionService {
	async getLatestTransactions(count: number = 20): Promise<TransactionData[]> {
		const api = polkadotConnection.getApi();
		const transactions: TransactionData[] = [];

		try {
			// Get latest blocks to extract transactions
			const latestBlocks = await blockService.getLatestBlocks(
				Math.ceil(count / 5)
			); // Estimate blocks needed

			for (const block of latestBlocks) {
				const blockTransactions = await this.getTransactionsFromBlock(
					block.blockNumber
				);

				// Filter for medical record related transactions
				const medicalTransactions = blockTransactions.filter(
					(tx) =>
						tx.section === "medicalRecords" ||
						tx.method.includes("medical") ||
						tx.method.includes("record") ||
						tx.method.includes("patient")
				);

				transactions.push(...medicalTransactions);

				if (transactions.length >= count) {
					break;
				}
			}

			return transactions
				.sort((a, b) => b.blockNumber - a.blockNumber)
				.slice(0, count);
		} catch (error) {
			console.error("Error fetching latest transactions:", error);
			throw error;
		}
	}

	async getTransactionsFromBlock(
		blockNumber: number
	): Promise<TransactionData[]> {
		try {
			const api = polkadotConnection.getApi();

			// Get block hash and data
			const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
			const [signedBlock, events] = await Promise.all([
				api.rpc.chain.getBlock(blockHash),
				api.query.system.events.at(blockHash),
			]);

			// Get block timestamp
			const blockData = await blockService.getBlockData(blockNumber);
			const timestamp = blockData?.timestamp || new Date().toISOString();

			const transactions: TransactionData[] = [];

			// Process each extrinsic
			signedBlock.block.extrinsics.forEach((extrinsic, index) => {
				const txHash = extrinsic.hash.toString();
				const method = extrinsic.method.method;
				const section = extrinsic.method.section;

				// Skip system extrinsics like timestamp, unless they're relevant
				if (section === "timestamp" || section === "parachainSystem") {
					return;
				}

				// Get events for this extrinsic
				const extrinsicEvents = (events as any).filter(
					(event: any, eventIndex: any) => {
						return (
							event.phase.isApplyExtrinsic &&
							event.phase.asApplyExtrinsic.eq(index)
						);
					}
				);

				// Determine transaction status
				const status = this.getTransactionStatus(extrinsicEvents);

				// Extract sender
				const from = extrinsic.isSigned
					? extrinsic.signer.toString()
					: undefined;

				// Extract arguments
				const args = extrinsic.method.args.map((arg) => arg.toString());

				transactions.push({
					txHash,
					blockNumber,
					method,
					section,
					timestamp,
					status,
					from,
					args,
					events: extrinsicEvents,
				});
			});

			return transactions;
		} catch (error) {
			console.error(
				`Error fetching transactions from block ${blockNumber}:`,
				error
			);
			return [];
		}
	}

	private getTransactionStatus(events: any[]): "success" | "failed" {
		// Check for ExtrinsicFailed event
		const failed = events.some(
			(event) =>
				event.event.section === "system" &&
				event.event.method === "ExtrinsicFailed"
		);

		return failed ? "failed" : "success";
	}

	async getTransactionDetails(txHash: string): Promise<TransactionData | null> {
		try {
			const api = polkadotConnection.getApi();

			// Note: This is a simplified approach. In a real implementation,
			// you might need to maintain an index of transaction hashes to block numbers
			// or use a blockchain explorer API

			// For now, we'll search recent blocks
			const recentBlocks = await blockService.getLatestBlocks(100);

			for (const block of recentBlocks) {
				const transactions = await this.getTransactionsFromBlock(
					block.blockNumber
				);
				const transaction = transactions.find((tx) => tx.txHash === txHash);

				if (transaction) {
					return transaction;
				}
			}

			return null;
		} catch (error) {
			console.error(`Error fetching transaction details for ${txHash}:`, error);
			return null;
		}
	}

	subscribeToNewTransactions(
		callback: (transaction: TransactionData) => void
	): () => void {
		const api = polkadotConnection.getApi();

		let unsubscribe: () => void = () => {};

		// Subscribe to new blocks and extract transactions
		const blockUnsubscribe = blockService.subscribeToNewBlocks(
			async (block) => {
				try {
					const transactions = await this.getTransactionsFromBlock(
						block.blockNumber
					);

					// Filter for medical record related transactions
					const medicalTransactions = transactions.filter(
						(tx) =>
							tx.section === "medicalRecords" ||
							tx.method.includes("medical") ||
							tx.method.includes("record") ||
							tx.method.includes("patient")
					);

					medicalTransactions.forEach(callback);
				} catch (error) {
					console.error("Error in transaction subscription:", error);
				}
			}
		);

		unsubscribe = blockUnsubscribe;
		polkadotConnection.addSubscription(blockUnsubscribe);

		return () => unsubscribe();
	}

	// Medical record specific methods
	async getMedicalRecordTransactions(
		patientId?: string
	): Promise<TransactionData[]> {
		try {
			const allTransactions = await this.getLatestTransactions(100);

			return allTransactions.filter((tx) => {
				// Filter for medical record transactions
				const isMedicalRecord =
					tx.section === "medicalRecords" ||
					tx.method.includes("medical") ||
					tx.method.includes("record");

				if (!isMedicalRecord) return false;

				// If patientId is provided, filter by patient
				if (patientId && tx.args) {
					return tx.args.some((arg) => arg.includes(patientId));
				}

				return true;
			});
		} catch (error) {
			console.error("Error fetching medical record transactions:", error);
			return [];
		}
	}
}

export const transactionService = new TransactionService();
