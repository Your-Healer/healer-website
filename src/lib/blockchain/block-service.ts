import { polkadotConnection, BlockData } from "./polkadot-connection";

export class BlockService {
	async getLatestBlocks(count: number = 10): Promise<BlockData[]> {
		const api = polkadotConnection.getApi();
		const blocks: BlockData[] = [];

		try {
			// Get current block number
			const currentBlockNumber =
				await polkadotConnection.getCurrentBlockNumber();

			// Fetch the last 'count' blocks
			const blockPromises = [];
			for (let i = 0; i < count; i++) {
				const blockNumber = currentBlockNumber - i;
				if (blockNumber > 0) {
					blockPromises.push(this.getBlockData(blockNumber));
				}
			}

			const blockResults = await Promise.all(blockPromises);
			blocks.push(
				...(blockResults.filter((block) => block !== null) as BlockData[])
			);

			return blocks.sort((a, b) => b.blockNumber - a.blockNumber);
		} catch (error) {
			console.error("Error fetching latest blocks:", error);
			throw error;
		}
	}

	async getBlockData(blockNumber: number): Promise<BlockData | null> {
		try {
			const api = polkadotConnection.getApi();

			// Get block hash
			const blockHash = await api.rpc.chain.getBlockHash(blockNumber);

			// Get block data
			const [signedBlock, header] = await Promise.all([
				api.rpc.chain.getBlock(blockHash),
				api.rpc.chain.getHeader(blockHash),
			]);

			// Get block timestamp
			const timestamp = await this.getBlockTimestamp(signedBlock);

			return {
				blockNumber: header.number.toNumber(),
				blockHash: blockHash.toString(),
				timestamp: timestamp,
				transactionCount: signedBlock.block.extrinsics.length,
				parentHash: header.parentHash.toString(),
				extrinsicsRoot: header.extrinsicsRoot.toString(),
				stateRoot: header.stateRoot.toString(),
			};
		} catch (error) {
			console.error(`Error fetching block ${blockNumber}:`, error);
			return null;
		}
	}

	private async getBlockTimestamp(signedBlock: any): Promise<string> {
		try {
			// Look for timestamp extrinsic
			const timestampExtrinsic = signedBlock.block.extrinsics.find(
				(extrinsic: any) =>
					extrinsic.method.section === "timestamp" &&
					extrinsic.method.method === "set"
			);

			if (timestampExtrinsic) {
				const timestamp = timestampExtrinsic.method.args[0];
				return new Date(Number(timestamp)).toISOString();
			}

			// Fallback to current time if no timestamp found
			return new Date().toISOString();
		} catch (error) {
			console.error("Error extracting block timestamp:", error);
			return new Date().toISOString();
		}
	}

	subscribeToNewBlocks(callback: (block: BlockData) => void): () => void {
		const api = polkadotConnection.getApi();

		let unsubscribe: () => void = () => {};

		api.rpc.chain
			.subscribeNewHeads(async (header: any) => {
				try {
					const blockData = await this.getBlockData(header.number.toNumber());
					if (blockData) {
						callback(blockData);
					}
				} catch (error) {
					console.error("Error in block subscription:", error);
				}
			})
			.then((unsub) => {
				unsubscribe = unsub;
				polkadotConnection.addSubscription(unsub);
			})
			.catch((error) => {
				console.error("Error subscribing to new blocks:", error);
			});

		return () => unsubscribe();
	}

	async getBlockByHash(blockHash: string): Promise<BlockData | null> {
		try {
			const api = polkadotConnection.getApi();

			const [signedBlock, header] = await Promise.all([
				api.rpc.chain.getBlock(blockHash),
				api.rpc.chain.getHeader(blockHash),
			]);

			const timestamp = await this.getBlockTimestamp(signedBlock);

			return {
				blockNumber: header.number.toNumber(),
				blockHash: blockHash,
				timestamp: timestamp,
				transactionCount: signedBlock.block.extrinsics.length,
				parentHash: header.parentHash.toString(),
				extrinsicsRoot: header.extrinsicsRoot.toString(),
				stateRoot: header.stateRoot.toString(),
			};
		} catch (error) {
			console.error(`Error fetching block by hash ${blockHash}:`, error);
			return null;
		}
	}
}

export const blockService = new BlockService();
