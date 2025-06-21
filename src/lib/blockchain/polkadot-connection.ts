import { ApiPromise, WsProvider } from "@polkadot/api";

export interface BlockData {
	blockNumber: number;
	blockHash: string;
	timestamp: string;
	transactionCount: number;
	parentHash: string;
	extrinsicsRoot: string;
	stateRoot: string;
}

export interface TransactionData {
	txHash: string;
	blockNumber: number;
	method: string;
	section: string;
	timestamp: string;
	status: "success" | "failed";
	from?: string;
	to?: string;
	args?: any[];
	events?: any[];
}

export class PolkadotConnection {
	private api: ApiPromise | null = null;
	private provider: WsProvider | null = null;
	private isConnected = false;
	private subscriptions: (() => void)[] = [];

	constructor() {
		this.api = null;
		this.provider = null;
		this.isConnected = false;
	}

	async connect(): Promise<void> {
		try {
			const wsEndpoint = import.meta.env["VITE_API_HEALER_NETWORK_WS"];

			if (!wsEndpoint) {
				throw new Error(
					"VITE_API_HEALER_NETWORK_WS environment variable is not set"
				);
			}

			console.log("Connecting to Healer Network:", wsEndpoint);

			// Create WebSocket provider
			this.provider = new WsProvider(wsEndpoint);

			// Create API instance
			this.api = await ApiPromise.create({
				provider: this.provider,
				types: {
					// Add custom types for Healer Network if needed
					MedicalRecord: {
						id: "u64",
						patientId: "AccountId",
						doctorId: "AccountId",
						diagnosis: "Vec<u8>",
						treatment: "Vec<u8>",
						timestamp: "u64",
						isActive: "bool",
					},
				},
			});

			// Wait for API to be ready
			await this.api.isReady;

			this.isConnected = true;
			console.log("Successfully connected to Healer Network");

			// Get chain info
			const [chain, nodeName, nodeVersion] = await Promise.all([
				this.api.rpc.system.chain(),
				this.api.rpc.system.name(),
				this.api.rpc.system.version(),
			]);

			console.log(
				`Connected to chain: ${chain} using ${nodeName} v${nodeVersion}`
			);
		} catch (error) {
			console.error("Failed to connect to blockchain:", error);
			this.isConnected = false;
			throw error;
		}
	}

	async disconnect(): Promise<void> {
		try {
			// Unsubscribe from all subscriptions
			this.subscriptions.forEach((unsub) => unsub());
			this.subscriptions = [];

			// Disconnect API
			if (this.api) {
				await this.api.disconnect();
				this.api = null;
			}

			// Disconnect provider
			if (this.provider) {
				await this.provider.disconnect();
				this.provider = null;
			}

			this.isConnected = false;
			console.log("Disconnected from blockchain");
		} catch (error) {
			console.error("Error disconnecting from blockchain:", error);
			throw error;
		}
	}

	getApi(): ApiPromise {
		if (!this.api || !this.isConnected) {
			throw new Error("Not connected to blockchain. Call connect() first.");
		}
		return this.api;
	}

	isApiConnected(): boolean {
		return this.isConnected && this.api !== null;
	}

	addSubscription(unsubscribe: () => void): void {
		this.subscriptions.push(unsubscribe);
	}

	async getChainInfo() {
		const api = this.getApi();

		const [chain, nodeName, nodeVersion, properties] = await Promise.all([
			api.rpc.system.chain(),
			api.rpc.system.name(),
			api.rpc.system.version(),
			api.rpc.system.properties(),
		]);

		return {
			chain: chain.toString(),
			nodeName: nodeName.toString(),
			nodeVersion: nodeVersion.toString(),
			properties: properties.toJSON(),
		};
	}

	async getCurrentBlockNumber(): Promise<number> {
		const api = this.getApi();
		const header = await api.rpc.chain.getHeader();
		return header.number.toNumber();
	}

	async getBlockHash(blockNumber?: number): Promise<string> {
		const api = this.getApi();
		const hash = blockNumber
			? await api.rpc.chain.getBlockHash(blockNumber)
			: await api.rpc.chain.getFinalizedHead();
		return hash.toString();
	}
}

// Singleton instance
export const polkadotConnection = new PolkadotConnection();
