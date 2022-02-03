import React from "react";
import { Provider } from "react-redux";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { LoginPage } from "@app/pages";
import { Store, StorePersistor } from "@app/redux";

export function App() {
	return (
		<Provider store={Store}>
			<PersistGate persistor={StorePersistor}>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<LoginPage />} />
					</Routes>
				</BrowserRouter>
			</PersistGate>
		</Provider>
	);
}
