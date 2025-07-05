import { RagParsedDiseaseData } from "@/utils/types";

export interface ChatMessage {
	id: string;
	text: string;
	isBot: boolean;
	timestamp: string;
	isLoading?: boolean;
	sources?: RagParsedDiseaseData[];
}

export interface QueryRequest {
	question: string;
	language: "english" | "vietnamese";
	enhance_retrieval: boolean;
}

export interface QueryResponse {
	answer: string;
	question: string;
	sources?: RagParsedDiseaseData[];
}
