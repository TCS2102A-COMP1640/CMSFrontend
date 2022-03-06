import { createSlice } from "@reduxjs/toolkit";
import { DepartmentsState } from "./interfaces";
import {
	getDepartments,
	getDepartmentsByName,
	createDepartment,
	editDepartment,
	deleteDepartment,
	resetDepartmentsState
} from "./actions";
import _ from "lodash";

const departmentsState: DepartmentsState = {
	getDepartments: {
		data: [],
		status: "idle"
	},
	getDepartmentsByName: {
		data: [],
		status: "idle"
	},
	createDepartment: {
		status: "idle"
	},
	editDepartment: {
		status: "idle"
	},
	deleteDepartment: {
		status: "idle"
	}
};

const departmentsSlice = createSlice({
	name: "departments",
	initialState: departmentsState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getDepartments.pending, (state, action) => {
				state.getDepartments.status = "pending";
				state.getDepartments.error = undefined;
			})
			.addCase(getDepartments.rejected, (state, action) => {
				state.getDepartments.status = "idle";
			})
			.addCase(getDepartments.fulfilled, (state, action) => {
				state.getDepartments.status = "idle";
				state.getDepartments.data = action.payload;
			})
			.addCase(getDepartmentsByName.pending, (state, action) => {
				state.getDepartmentsByName.status = "pending";
				state.getDepartmentsByName.error = undefined;
			})
			.addCase(getDepartmentsByName.rejected, (state, action) => {
				state.getDepartmentsByName.status = "idle";
			})
			.addCase(getDepartmentsByName.fulfilled, (state, action) => {
				state.getDepartmentsByName.status = "idle";
				state.getDepartmentsByName.data = action.payload;
			})
			.addCase(createDepartment.pending, (state, action) => {
				state.createDepartment.status = "pending";
				state.createDepartment.error = undefined;
			})
			.addCase(createDepartment.rejected, (state, action) => {
				state.createDepartment.status = "idle";
			})
			.addCase(createDepartment.fulfilled, (state, action) => {
				state.createDepartment.status = "idle";
			})
			.addCase(editDepartment.pending, (state, action) => {
				state.editDepartment.status = "pending";
				state.editDepartment.error = undefined;
			})
			.addCase(editDepartment.rejected, (state, action) => {
				state.editDepartment.status = "idle";
			})
			.addCase(editDepartment.fulfilled, (state, action) => {
				state.editDepartment.status = "idle";
			})
			.addCase(deleteDepartment.pending, (state, action) => {
				state.deleteDepartment.status = "pending";
				state.deleteDepartment.error = undefined;
			})
			.addCase(deleteDepartment.rejected, (state, action) => {
				state.deleteDepartment.status = "idle";
			})
			.addCase(deleteDepartment.fulfilled, (state, action) => {
				state.deleteDepartment.status = "idle";
			})
			.addCase(resetDepartmentsState, (state, action) => {
				return departmentsState;
			});
	}
});

const departmentsReducer = departmentsSlice.reducer;

export { departmentsReducer };
