import React from "react";
import { Provider } from "react-redux";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { LoginPage } from "@app/pages";
import { Store } from "@app/redux";

export function App() {
	return (
		<Provider store={Store}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<LoginPage />} />
				</Routes>
			</BrowserRouter>
		</Provider>
	);
}
