import { createSlice } from "@reduxjs/toolkit";
import { RolesState } from "./interfaces";
import { getRoles, createRole, editRole, deleteRole } from "./actions";
import _ from "lodash";

const rolesState: RolesState = {
	getRoles: {
		data: [],
		status: "idle"
	},
	createRole: {
		status: "idle"
	},
	editRole: {
		status: "idle"
	},
	deleteRole: {
		status: "idle"
	}
};

const rolesSlice = createSlice({
	name: "roles",
	initialState: rolesState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getRoles.pending, (state, action) => {
				state.getRoles.status = "pending";
				state.getRoles.error = undefined;
			})
			.addCase(getRoles.rejected, (state, action) => {
				state.getRoles.status = "idle";
			})
			.addCase(getRoles.fulfilled, (state, action) => {
				state.getRoles.status = "idle";
				state.getRoles.data = action.payload;
			})
			.addCase(createRole.pending, (state, action) => {
				state.createRole.status = "pending";
				state.createRole.error = undefined;
			})
			.addCase(createRole.rejected, (state, action) => {
				state.createRole.status = "idle";
			})
			.addCase(createRole.fulfilled, (state, action) => {
				state.createRole.status = "idle";
			})
			.addCase(editRole.pending, (state, action) => {
				state.editRole.status = "pending";
				state.editRole.error = undefined;
			})
			.addCase(editRole.rejected, (state, action) => {
				state.editRole.status = "idle";
			})
			.addCase(editRole.fulfilled, (state, action) => {
				state.editRole.status = "idle";
			})
			.addCase(deleteRole.pending, (state, action) => {
				state.deleteRole.status = "pending";
				state.deleteRole.error = undefined;
			})
			.addCase(deleteRole.rejected, (state, action) => {
				state.deleteRole.status = "idle";
			})
			.addCase(deleteRole.fulfilled, (state, action) => {
				state.deleteRole.status = "idle";
			});
	}
});

const rolesReducer = rolesSlice.reducer;

export { rolesReducer };
