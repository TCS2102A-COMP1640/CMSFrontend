import { useDispatch } from "react-redux";
import { configureStore, AsyncThunkPayloadCreator, AsyncThunk, AsyncThunkOptions } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { AuthState, authReducer } from "./auth";
import { IdeasState, ideasReducer } from "./ideas";
import { CategoriesState, categoriesReducer } from "./categories";
import { YearsState, yearsReducer } from "./years";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

interface RootState {
	auth: AuthState;
	ideas: IdeasState;
	years: YearsState;
	categories: CategoriesState;
}

const Store = configureStore({
	reducer: {
		auth: persistReducer<AuthState>(
			{ key: "auth", storage, blacklist: ["status", "error", "profile"] },
			authReducer
		),
		ideas: ideasReducer,
		years: yearsReducer,
		categories: categoriesReducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk).concat()
});
const StorePersistor = persistStore(Store);

type AppDispatch = typeof Store.dispatch;
const useAppDispatch = () => useDispatch<AppDispatch>();

export { Store, StorePersistor, RootState, AppDispatch, useAppDispatch };
export { loginToAccount, logoutFromAccount, getProfile, resetAuthState } from "./auth";
export { getCategories } from "./categories";
export { getIdeas, createIdea } from "./ideas";
export { getComments } from "./comments";
export { getYears, createYear, editYear, deleteYear } from "./years";

export type { AuthState, LoginPayload } from "./auth";
export type { CommentData, GetCommentsPayload } from "./comments";
export type { CategoriesState, CategoryData } from "./categories";
export type { IdeasState, IdeaData, IdeaDocumentData, GetIdeasPayload } from "./ideas";
export type { YearsState, YearData } from "./years";

// Reference: https://stackoverflow.com/questions/64793504/cannot-set-getstate-type-to-rootstate-in-createasyncthunk
declare module "@reduxjs/toolkit" {
	type AsyncThunkConfig = {
		state?: unknown;
		dispatch?: AppDispatch;
		extra?: unknown;
		rejectValue?: unknown;
		serializedErrorType?: unknown;
	};

	function createAsyncThunk<
		Returned,
		ThunkArg = void,
		ThunkApiConfig extends AsyncThunkConfig = {
			state: RootState;
			rejectValue: Error;
		}
	>(
		typePrefix: string,
		payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkApiConfig>,
		options?: AsyncThunkOptions<ThunkArg, ThunkApiConfig>
	): AsyncThunk<Returned, ThunkArg, ThunkApiConfig>;
}
