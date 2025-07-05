import api from "../api/axios-rag.ts"
import { QueryRequest, QueryResponse } from "@/models/rag-models";
import { useMutation } from "@tanstack/react-query";

export const useQueryChat = () => {
    return useMutation<QueryResponse, Error, QueryRequest>({
        mutationFn: async (params) => {
            try {
                const response = await api.post<QueryResponse>("/langchain/query", {
                    ...params,
                });

                if (!response.data || !response.data.answer) {
                    throw new Error("Invalid response from server");
                }

                const cleanedResponse = {
                    ...response.data,
                    answer: response.data.answer
                        .replace(/\r\n/g, "\n")
                        .replace(/\n{3,}/g, "\n\n")
                        .trim(),
                };

                return cleanedResponse;
            } catch (error: any) {
                console.error("Chat API Error:", error);
                if (error.response?.status === 404) {
                    throw new Error("Chat service is currently unavailable");
                } else if (error.response?.status === 500) {
                    throw new Error("Server error occurred. Please try again later");
                } else if (error.code === "NETWORK_ERROR" || error.code === "ERR_NETWORK" || !error.response) {
                    throw new Error("Network error. Please check your connection");
                }

                throw new Error(error.message || "An unexpected error occurred");
            }
        },
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    });
};
