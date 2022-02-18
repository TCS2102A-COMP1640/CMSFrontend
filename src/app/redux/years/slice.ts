import { createSlice } from "@reduxjs/toolkit";
import { YearsState } from "./interfaces";
import { getYears, createYear, deleteYear } from "./actions";
import _ from "lodash";

const yearsState: YearsState = {
	getYears: {
		data: [],
		status: "idle"
	},
	createYear: {
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
			.addCase(deleteYear.pending, (state, action) => {
				state.deleteYear.status = "pending";
				state.deleteYear.error = undefined;
			})
			.addCase(deleteYear.rejected, (state, action) => {
				state.deleteYear.status = "idle";
			})
			.addCase(deleteYear.fulfilled, (state, action) => {
				state.deleteYear.status = "idle";
			});
	}
});

const yearsReducer = yearsSlice.reducer;

export { yearsReducer };
