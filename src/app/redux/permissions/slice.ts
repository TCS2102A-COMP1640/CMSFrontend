import { createSlice } from "@reduxjs/toolkit";
import { PermissionsState } from "./interfaces";
import { getPermissions, resetPermissionsState } from "./actions";
import _ from "lodash";

const permissionsState: PermissionsState = {
	getPermissions: {
		data: [],
		status: "idle"
	}
};

const permissionsSlice = createSlice({
	name: "permissions",
	initialState: permissionsState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getPermissions.pending, (state, action) => {
				state.getPermissions.status = "pending";
				state.getPermissions.error = undefined;
			})
			.addCase(getPermissions.rejected, (state, action) => {
				state.getPermissions.status = "idle";
			})
			.addCase(getPermissions.fulfilled, (state, action) => {
				state.getPermissions.status = "idle";
				state.getPermissions.data = action.payload;
			})
			.addCase(resetPermissionsState, (state, action) => {
				return permissionsState;
			});
	}
});

const permissionsReducer = permissionsSlice.reducer;

export { permissionsReducer };
