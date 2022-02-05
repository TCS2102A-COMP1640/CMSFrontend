import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler } from "@app/utils";
import _ from "lodash";

interface AuthState {
	token: string;
	status: "idle" | "pending";
	error?: Error;
}

interface LoginPayload {
	email: string;
	password: string;
}

const loginToAccount = createAsyncThunk<string, LoginPayload, { rejectValue: Error }>(
	"auth/login",
	async (payload, { rejectWithValue }) => {
		const { data, error } = await fetchHandler({ path: APIPaths.Login, method: "POST", body: payload });
		if (_.isNil(error)) {
			return data.token as string;
		}
		return rejectWithValue(error);
	}
);
const logoutFromAccount = createAction("auth/logout");

const authState: AuthState = {
	token: "",
	status: "idle"
};
const authSlice = createSlice({
	name: "auth",
	initialState: authState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(loginToAccount.pending, (state, action) => {
				state.status = "pending";
				state.error = undefined;
			})
			.addCase(loginToAccount.rejected, (state, action) => {
				state.status = "idle";
				state.error = action.payload;
			})
			.addCase(loginToAccount.fulfilled, (state, action) => {
				state.status = "idle";
				state.token = action.payload;
			})
			.addCase(logoutFromAccount, (state, action) => {
				state.token = "";
			});
	}
});
const authReducer = authSlice.reducer;

export { AuthState, authReducer, loginToAccount, logoutFromAccount };
