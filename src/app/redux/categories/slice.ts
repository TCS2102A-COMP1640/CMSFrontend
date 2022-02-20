import { createSlice } from "@reduxjs/toolkit";
import { CategoriesState } from "./interfaces";
import { getCategories } from "./actions";
import _ from "lodash";

const categoriesState: CategoriesState = {
	getCategories: {
		data: [],
		status: "idle"
	}
};

const categoriesSlice = createSlice({
	name: "categories",
	initialState: categoriesState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getCategories.pending, (state, action) => {
				state.getCategories.status = "pending";
				state.getCategories.error = undefined;
			})
			.addCase(getCategories.rejected, (state, action) => {
				state.getCategories.status = "idle";
			})
			.addCase(getCategories.fulfilled, (state, action) => {
				state.getCategories.status = "idle";
				state.getCategories.data = action.payload;
			});
	}
});

const categoriesReducer = categoriesSlice.reducer;

export { categoriesReducer };
