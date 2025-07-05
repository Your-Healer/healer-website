import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env["VITE_API_HEALER_RAG_URL"],
	timeout: 30000,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(
	(config) => {
		console.log("RAG Request:", {
			url: config.url,
			method: config.method,
			data: config.data,
		});
		return config;
	},
	(error) => {
		console.error("RAG Request Error:", error);
		return Promise.reject(error);
	}
);

// Add a response interceptor
api.interceptors.response.use(
	(response) => {
		console.log("RAG Response:", {
			status: response.status,
			data: response.data?.answer ? "Response received" : response.data,
		});
		return response;
	},
	(error) => {
		console.error("RAG Response Error:", {
			status: error.response?.status,
			message: error.message,
			data: error.response?.data,
		});

		if (error.code === "ECONNABORTED") {
			error.message =
				"Request timeout. The AI service is taking too long to respond.";
		} else if (error.code === "NETWORK_ERROR") {
			error.message = "Network error. Please check your internet connection.";
		} else if (error.response?.status === 404) {
			error.message = "Chat service endpoint not found.";
		} else if (error.response?.status === 500) {
			error.message = "Internal server error in chat service.";
		}

		return Promise.reject(error);
	}
);

export default api;
