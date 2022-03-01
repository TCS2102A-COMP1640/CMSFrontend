import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { AuthState, authReducer } from "./auth";
import { ideasReducer } from "./ideas";
import { categoriesReducer } from "./categories";
import { yearsReducer } from "./years";
import { usersReducer } from "./users";
import { rolesReducer } from "./roles";
import { messagesReducer } from "./messages";
import { departmentsReducer } from "./departments";
import { permissionsReducer } from "./permissions";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

export const Store = configureStore({
	reducer: {
		auth: persistReducer<AuthState>(
			{ key: "auth", storage, blacklist: ["status", "error", "profile"] },
			authReducer
		),
		ideas: ideasReducer,
		years: yearsReducer,
		categories: categoriesReducer,
		users: usersReducer,
		roles: rolesReducer,
		departments: departmentsReducer,
		messages: messagesReducer,
		permissions: permissionsReducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk).concat()
});
export const StorePersistor = persistStore(Store);
