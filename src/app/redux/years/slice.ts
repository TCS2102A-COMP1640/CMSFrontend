import { createSlice } from "@reduxjs/toolkit";
import { YearsState } from "./interfaces";
import { getYears, getYearsByName, createYear, editYear, deleteYear, resetYearsState } from "./actions";
import _ from "lodash";

const yearsState: YearsState = {
	getYears: {
		data: [],
		status: "idle"
	},
	getYearsByName: {
		data: [],
		status: "idle"
	},
	createYear: {
		status: "idle"
	},
	editYear: {
		status: "idle"
	},
	deleteYear: {
		status: "idle"
	}
};

const yearsSlice = createSlice({
	name: "years",
	initialState: yearsState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getYears.pending, (state, action) => {
				state.getYears.status = "pending";
				state.getYears.error = undefined;
			})
			.addCase(getYears.rejected, (state, action) => {
				state.getYears.status = "idle";
			})
			.addCase(getYears.fulfilled, (state, action) => {
				state.getYears.status = "idle";
				state.getYears.data = action.payload;
			})
			.addCase(getYearsByName.pending, (state, action) => {
				state.getYearsByName.status = "pending";
				state.getYearsByName.error = undefined;
			})
			.addCase(getYearsByName.rejected, (state, action) => {
				state.getYearsByName.status = "idle";
			})
			.addCase(getYearsByName.fulfilled, (state, action) => {
				state.getYearsByName.status = "idle";
				state.getYearsByName.data = action.payload;
			})
			.addCase(createYear.pending, (state, action) => {
				state.createYear.status = "pending";
				state.createYear.error = undefined;
			})
			.addCase(createYear.rejected, (state, action) => {
				state.createYear.status = "idle";
			})
			.addCase(createYear.fulfilled, (state, action) => {
				state.createYear.status = "idle";
			})
			.addCase(editYear.pending, (state, action) => {
				state.editYear.status = "pending";
				state.editYear.error = undefined;
			})
			.addCase(editYear.rejected, (state, action) => {
				state.editYear.status = "idle";
			})
			.addCase(editYear.fulfilled, (state, action) => {
				state.editYear.status = "idle";
			})
			.addCase(deleteYear.pending, (state, action) => {
				state.deleteYear.status = "pending";
				state.deleteYear.error = undefined;
			})
			.addCase(deleteYear.rejected, (state, action) => {
				state.deleteYear.status = "idle";
			})
			.addCase(deleteYear.fulfilled, (state, action) => {
				state.deleteYear.status = "idle";
			})
			.addCase(resetYearsState, (state, action) => {
				return yearsState;
			});
	}
});

const yearsReducer = yearsSlice.reducer;

export { yearsReducer };
