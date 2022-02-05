import { configureStore } from "@reduxjs/toolkit";
import { AuthState, authReducer } from "./auth";
import { UsersState, usersReducer } from "./users";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

interface RootState {
	auth: AuthState;
	users: UsersState;
}

const Store = configureStore({
	reducer: {
		auth: persistReducer<AuthState>({ key: "auth", storage }, authReducer),
		users: usersReducer
	},
	middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), thunk]
});
const StorePersistor = persistStore(Store);

export { Store, StorePersistor, RootState };
export { loginToAccount, logoutFromAccount } from "./auth";
export { getUserById } from "./users";
