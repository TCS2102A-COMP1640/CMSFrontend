import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler } from "@app/utils";
import _ from "lodash";

interface AuthState {
	token: string;
}

const loginToAccount = createAsyncThunk("auth/login", async (payload: { email: string; password: string }, thunk) => {
	const data = await fetchHandler({ path: APIPaths.Login, method: "POST", body: payload });
	console.log(data);
	return data;
});

const authState: AuthState = {
	token: ""
};
const authSlice = createSlice({
	name: "auth",
	initialState: authState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(loginToAccount.fulfilled, (state, action) => {
			state.token = action.payload.data.token;
		});
	}
});
const authReducer = authSlice.reducer;

export { AuthState, authReducer, loginToAccount };
