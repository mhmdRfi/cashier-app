import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import { store } from "./redux/store";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
	<Provider store={store}>
	<BrowserRouter>
		<ChakraProvider>
			<Provider store={store}>
				<App />
				<Toaster position="top-right"/>
			</Provider>
		</ChakraProvider>
	</BrowserRouter>
	</Provider>
);
