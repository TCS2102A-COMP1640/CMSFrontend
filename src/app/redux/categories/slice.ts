import { createSlice } from "@reduxjs/toolkit";
import { CategoriesState } from "./interfaces";
import { getCategories, createCategory, editCategory, deleteCategory, resetCategoriesState } from "./actions";
import _ from "lodash";

const categoriesState: CategoriesState = {
	getCategories: {
		data: [],
		status: "idle"
	},
	createCategory: {
		status: "idle"
	},
	editCategory: {
		status: "idle"
	},
	deleteCategory: {
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
			})
			.addCase(createCategory.pending, (state, action) => {
				state.createCategory.status = "pending";
				state.createCategory.error = undefined;
			})
			.addCase(createCategory.rejected, (state, action) => {
				state.createCategory.status = "idle";
			})
			.addCase(createCategory.fulfilled, (state, action) => {
				state.createCategory.status = "idle";
			})
			.addCase(editCategory.pending, (state, action) => {
				state.editCategory.status = "pending";
				state.editCategory.error = undefined;
			})
			.addCase(editCategory.rejected, (state, action) => {
				state.editCategory.status = "idle";
			})
			.addCase(editCategory.fulfilled, (state, action) => {
				state.editCategory.status = "idle";
			})
			.addCase(deleteCategory.pending, (state, action) => {
				state.deleteCategory.status = "pending";
				state.deleteCategory.error = undefined;
			})
			.addCase(deleteCategory.rejected, (state, action) => {
				state.deleteCategory.status = "idle";
			})
			.addCase(deleteCategory.fulfilled, (state, action) => {
				state.deleteCategory.status = "idle";
			})
			.addCase(resetCategoriesState, (state, action) => {
				return categoriesState;
			});
	}
});

const categoriesReducer = categoriesSlice.reducer;

export { categoriesReducer };
