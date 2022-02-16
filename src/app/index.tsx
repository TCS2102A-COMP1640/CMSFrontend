import React from "react";
import { Provider } from "react-redux";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider, createTheme } from "@mui/material";
import {
	LoginPage,
	HomePage,
	ProfilePage,
	IdeaPage,
	CategoryPage,
	YearPage,
	DepartmentPage,
	UserPage
} from "@app/pages";
import { Store, StorePersistor } from "@app/redux";
import { AuthRequired } from "@app/components";
import _ from "lodash";

const Theme = createTheme();

export function App() {
	return (
		<ThemeProvider theme={Theme}>
			<Provider store={Store}>
				<PersistGate persistor={StorePersistor}>
					<BrowserRouter>
						<Routes>
							<Route path="/login" element={<LoginPage />} />
							<Route path="/" element={<AuthRequired />}>
								<Route path="/" element={<HomePage />}>
									<Route path="/profile" element={<ProfilePage />} />
									<Route path="/idea" element={<IdeaPage />} />
									<Route path="/category" element={<CategoryPage />} />
									<Route path="/year" element={<YearPage />} />
									<Route path="/department" element={<DepartmentPage />} />
									<Route path="/user" element={<UserPage />} />
								</Route>
							</Route>
						</Routes>
					</BrowserRouter>
				</PersistGate>
			</Provider>
		</ThemeProvider>
	);
}
