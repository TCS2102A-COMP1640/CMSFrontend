import { AsyncThunkPayloadCreator, AsyncThunkOptions, AsyncThunk } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { AuthState } from "./auth";
import { IdeasState } from "./ideas";
import { CategoriesState } from "./categories";
import { YearsState } from "./years";
import { Store } from "./store";
import { UsersState } from "./users";
import { MessagesState } from "./messages";
import { RolesState } from "./roles";

export interface RootState {
	auth: AuthState;
	ideas: IdeasState;
	years: YearsState;
	categories: CategoriesState;
	users: UsersState;
	roles: RolesState;
	messages: MessagesState;
}

export type AppDispatch = typeof Store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

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
