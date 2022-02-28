import React, { useEffect } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider, createTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/lab";
import { SnackbarProvider } from "notistack";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
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
import { Store, StorePersistor, RootState, popMessage } from "@app/redux";
import { AuthRequired } from "@app/components";
import { useSnackbar } from "notistack";
import _ from "lodash";

const Theme = createTheme();
let displayedSnackbars: string[] = [];

function AppNotifications() {
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const { stack: messagesStack } = useSelector((state: RootState) => state.messages);

	useEffect(() => {
		messagesStack.forEach((payload) => {
			if (displayedSnackbars.includes(payload.id)) {
				return;
			}
			displayedSnackbars.push(payload.id);

			enqueueSnackbar(payload.message, {
				key: payload.id,
				variant: payload.severity,
				autoHideDuration: 2000,
				onExited: (e, key) => {
					dispatch(popMessage({ id: key as string }));
					displayedSnackbars = [...displayedSnackbars.filter((k) => k !== key)];
				}
			});
		});
	}, [messagesStack]);
	return <></>;
}

export function App() {
	return (
		<ThemeProvider theme={Theme}>
			<Provider store={Store}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<SnackbarProvider maxSnack={3}>
						<PersistGate persistor={StorePersistor}>
							<AppNotifications />
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
					</SnackbarProvider>
				</LocalizationProvider>
			</Provider>
		</ThemeProvider>
	);
}
