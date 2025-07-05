import { RagParsedDiseaseData, CommonQuestion } from "./types";

/**
 * Safely parse LLM response to structured disease data with robust error handling
 */
export function parseLLMResponse(sources: unknown[]): RagParsedDiseaseData[] {
	// Handle invalid input
	if (!sources || !Array.isArray(sources)) {
		console.error("Invalid sources format:", sources);
		return [];
	}

	try {
		const validSources: RagParsedDiseaseData[] = [];

		for (const source of sources) {
			try {
				// Handle object sources
				if (source && typeof source === "object" && source !== null) {
					const sourceObj = source as Record<string, unknown>;

					// Check if it has the required properties
					if ("disease_name" in sourceObj && "disease_id" in sourceObj) {
						const diseaseId = String(sourceObj.disease_id || "");
						const diseaseName = String(sourceObj.disease_name || "");

						// Skip items with missing required fields
						if (!diseaseId || !diseaseName) continue;

						// Create the disease object
						const disease: RagParsedDiseaseData = {
							disease_id: diseaseId,
							disease_name: diseaseName,
							section: sourceObj.section
								? String(sourceObj.section)
								: undefined,
							common_questions: [],
						};

						// Process common questions if available
						if (
							"common_questions" in sourceObj &&
							Array.isArray(sourceObj.common_questions)
						) {
							const questions = sourceObj.common_questions as unknown[];

							disease.common_questions = questions
								.filter((q) => q && typeof q === "object" && q !== null)
								.map((q) => {
									const qObj = q as Record<string, unknown>;
									if ("question" in qObj) {
										const question: CommonQuestion = {
											question: String(qObj.question || ""),
										};

										if ("answer" in qObj) {
											question.answer = String(qObj.answer || "");
										}

										return question;
									}
									return null;
								})
								.filter((q): q is CommonQuestion => q !== null);
						}

						validSources.push(disease);
					}
				}
				// Handle string sources (JSON)
				else if (typeof source === "string" && source.trim()) {
					try {
						const parsed = JSON.parse(source) as Record<string, unknown>;

						if (
							parsed &&
							typeof parsed === "object" &&
							"disease_name" in parsed &&
							"disease_id" in parsed
						) {
							const diseaseId = String(parsed.disease_id || "");
							const diseaseName = String(parsed.disease_name || "");

							// Skip items with missing required fields
							if (!diseaseId || !diseaseName) continue;

							// Create the disease object
							const disease: RagParsedDiseaseData = {
								disease_id: diseaseId,
								disease_name: diseaseName,
								section: parsed.section ? String(parsed.section) : undefined,
								common_questions: [],
							};

							// Process common questions if available
							if (
								"common_questions" in parsed &&
								Array.isArray(parsed.common_questions)
							) {
								const questions = parsed.common_questions as unknown[];

								disease.common_questions = questions
									.filter((q) => q && typeof q === "object" && q !== null)
									.map((q) => {
										const qObj = q as Record<string, unknown>;
										if ("question" in qObj) {
											const question: CommonQuestion = {
												question: String(qObj.question || ""),
											};

											if ("answer" in qObj) {
												question.answer = String(qObj.answer || "");
											}

											return question;
										}
										return null;
									})
									.filter((q): q is CommonQuestion => q !== null);
							}

							validSources.push(disease);
						}
					} catch (jsonError) {
						console.warn("Failed to parse source as JSON:", source);
					}
				}
			} catch (sourceError) {
				console.error("Error processing source:", sourceError);
			}
		}

		console.log("Successfully parsed sources:", validSources.length);
		return validSources;
	} catch (error) {
		console.error("Fatal error parsing LLM response:", error);
		return [];
	}
}
