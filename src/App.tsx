import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, type createRouter } from "@tanstack/react-router";
import type { FunctionComponent } from "./common/types";
import { SessionProvider } from "./contexts/SessionProvider";
// import { TanStackRouterDevelopmentTools } from "./components/utils/development-tools/TanStackRouterDevelopmentTools";
import { Toaster } from "@/components/ui/sonner"
import ChatbotComponent from "@/components/chatbot/Chatbot";

const queryClient = new QueryClient();

type AppProps = { router: ReturnType<typeof createRouter> };

const App = ({ router }: AppProps): FunctionComponent => {
	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider>
				{/* <TanStackRouterDevelopmentTools
				router={router}
				initialIsOpen={false}
				position="bottom-right"
				/>
				<ReactQueryDevtools initialIsOpen={false} /> */}
				<Toaster position="bottom-right" richColors />
				<RouterProvider router={router} />
				<ChatbotComponent />
			</SessionProvider>
		</QueryClientProvider>
	);
};

export default App;
