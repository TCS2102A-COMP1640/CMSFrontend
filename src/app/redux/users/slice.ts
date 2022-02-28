import { createSlice } from "@reduxjs/toolkit";
import { UsersState } from "./interfaces";
import { getUsers, createUser, editUser, deleteUser } from "./actions";
import _ from "lodash";

const usersState: UsersState = {
	getUsers: {
		data: [],
		status: "idle"
	},
	createUser: {
		status: "idle"
	},
	editUser: {
		status: "idle"
	},
	deleteUser: {
		status: "idle"
	}
};

const usersSlice = createSlice({
	name: "users",
	initialState: usersState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getUsers.pending, (state, action) => {
				state.getUsers.status = "pending";
				state.getUsers.error = undefined;
			})
			.addCase(getUsers.rejected, (state, action) => {
				state.getUsers.status = "idle";
			})
			.addCase(getUsers.fulfilled, (state, action) => {
				state.getUsers.status = "idle";
				state.getUsers.data = action.payload;
			})
			.addCase(createUser.pending, (state, action) => {
				state.createUser.status = "pending";
				state.createUser.error = undefined;
			})
			.addCase(createUser.rejected, (state, action) => {
				state.createUser.status = "idle";
			})
			.addCase(createUser.fulfilled, (state, action) => {
				state.createUser.status = "idle";
			})
			.addCase(editUser.pending, (state, action) => {
				state.editUser.status = "pending";
				state.editUser.error = undefined;
			})
			.addCase(editUser.rejected, (state, action) => {
				state.editUser.status = "idle";
			})
			.addCase(editUser.fulfilled, (state, action) => {
				state.editUser.status = "idle";
			})
			.addCase(deleteUser.pending, (state, action) => {
				state.deleteUser.status = "pending";
				state.deleteUser.error = undefined;
			})
			.addCase(deleteUser.rejected, (state, action) => {
				state.deleteUser.status = "idle";
			})
			.addCase(deleteUser.fulfilled, (state, action) => {
				state.deleteUser.status = "idle";
			});
	}
});

const usersReducer = usersSlice.reducer;

export { usersReducer };
