import { RagParsedDiseaseData } from "./types";

/**
 * Parse LLM response to structured disease data
 */
export function parseLLMResponse(sources: unknown[]): RagParsedDiseaseData[] {
	if (!sources || !Array.isArray(sources)) {
		console.error("Invalid sources format:", sources);
		return [];
	}

	try {
		return sources
			.map((source): RagParsedDiseaseData | null => {
				// If the source is already parsed and has the correct format
				if (
					source &&
					typeof source === "object" &&
					source !== null &&
					"disease_name" in source
				) {
					return source as RagParsedDiseaseData;
				}

				// If the source is a string (JSON)
				if (typeof source === "string") {
					try {
						return JSON.parse(source) as RagParsedDiseaseData;
					} catch (parseError) {
						console.error("Error parsing source string:", parseError);
						return null;
					}
				}

				return null;
			})
			.filter((item): item is RagParsedDiseaseData => item !== null);
	} catch (error) {
		console.error("Error parsing LLM response:", error);
		return [];
	}
}
