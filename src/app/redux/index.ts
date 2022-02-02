import { configureStore } from "@reduxjs/toolkit";
import { AuthState, authReducer } from "./auth";
import { UsersState, usersReducer } from "./users";
import thunk from "redux-thunk";

interface RootState {
	auth: AuthState;
	users: UsersState;
}

const Store = configureStore({
	reducer: {
		auth: authReducer,
		users: usersReducer
	},
	middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), thunk]
});

export { Store, RootState };
export { loginToAccount } from "./auth";
export { getUserById } from "./users";
