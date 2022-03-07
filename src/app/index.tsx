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
	UserPage,
	RolePage
} from "@app/pages";
import { Store, StorePersistor, RootState, popMessage } from "@app/redux";
import { AuthRequired } from "@app/components";
import { useSnackbar } from "notistack";
import _ from "lodash";

const Theme = createTheme({
	typography: {
		fontFamily: ["Roboto", "sans-serif"].join(","),
		allVariants: {
			color: "#212B36"
		},
		body1: {
			fontSize: "0.95rem"
		}
	},
	components: {
		MuiTableCell: {
			styleOverrides: {
				root: ({ ownerState, theme }) => ({
					...(ownerState.variant === "head" && {
						fontSize: "0.9em",
						letterSpacing: 0.75,
						fontWeight: 600,
						color: "rgb(55, 65, 81)"
					})
				})
			}
		},
		MuiTablePagination: {
			styleOverrides: {
				root: ({ ownerState, theme }) => ({
					borderTop: "1px solid rgba(224, 224, 224, 1)"
				})
			}
		},
		MuiButton: {
			styleOverrides: {
				root: ({ ownerState, theme }) => ({
					...(ownerState.variant === "error" && {
						backgroundColor: "rgb(245, 85, 64)",
						color: "white",
						"&:hover": {
							backgroundColor: "rgb(252, 108, 88)"
						}
					}),
					...(ownerState.variant === "primary" && {
						backgroundColor: "rgb(80, 72, 229)",
						color: "white",
						"&:hover": {
							backgroundColor: "rgb(56, 50, 160)"
						}
					}),
					...(ownerState.variant === "action" && {
						backgroundColor: "rgb(133, 139, 148)",
						color: "white",
						"&:hover": {
							backgroundColor: "rgb(116, 120, 130)"
						}
					}),
					...(ownerState.variant === "edit" && {
						backgroundColor: "rgb(33, 43, 54)",
						color: "white",
						"&:hover": {
							backgroundColor: "rgb(51, 62, 82)"
						}
					}),
					...(ownerState.disabled && {
						backgroundColor: "transparent"
					})
				})
			}
		},
		MuiSvgIcon: {
			styleOverrides: {
				root: ({ ownerState, theme }) => ({
					...(ownerState.color === "primary" && {
						color: "rgb(80, 72, 229)"
					}),
					...(ownerState.color === "delete" && {
						color: "rgb(245, 85, 64)"
					}),
					...(ownerState.color === "edit" && {
						color: "rgb(33, 43, 54)"
					})
				})
			}
		}
	}
});
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
											<Route path="/role" element={<RolePage />} />
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
