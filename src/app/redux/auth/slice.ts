import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "./interfaces";
import { loginToAccount, logoutFromAccount } from "./actions";
import { getProfile, resetAuthState } from ".";

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
			})
			.addCase(getProfile.fulfilled, (state, action) => {
				state.profile = action.payload;
			})
			.addCase(resetAuthState, (state, action) => {
				return authState;
			});
	}
});
const authReducer = authSlice.reducer;

export { authReducer };
