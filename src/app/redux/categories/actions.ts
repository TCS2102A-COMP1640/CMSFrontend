import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler, PaginationPayload } from "@app/utils";
import { pushMessage } from "@app/redux";
import { CategoryData } from "./interfaces";
import _ from "lodash";

export const resetCategoriesState = createAction("categories/reset");

export const getCategories = createAsyncThunk<CategoryData[], PaginationPayload>(
	"categories/getCategories",
	async (payload, { rejectWithValue, getState, dispatch }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: CategoryData[]; error?: Error }>(
			await fetchHandler({ path: APIPaths.Categories, method: "GET", query: payload, token })
		);
		if (_.isNil(error)) {
			return data;
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));
		return rejectWithValue(error);
	}
);

export const createCategory = createAsyncThunk<CategoryData, Omit<CategoryData, "id">>(
	"categories/createCategory",
	async (payload, { rejectWithValue, getState, dispatch }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: CategoryData; error?: Error }>await fetchHandler({
			path: APIPaths.Categories,
			method: "POST",
			body: payload,
			token
		});
		if (_.isNil(error)) {
			dispatch(pushMessage({ message: "Category created", severity: "success" }));
			return data;
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));
		return rejectWithValue(error);
	}
);

export const editCategory = createAsyncThunk<CategoryData, Partial<CategoryData>>(
	"categories/editCategory",
	async (payload, { rejectWithValue, getState, dispatch }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: CategoryData; error?: Error }>await fetchHandler({
			path: `${APIPaths.Categories}/:id`,
			method: "PUT",
			body: payload,
			params: {
				id: payload.id
			},
			token
		});
		if (_.isNil(error)) {
			dispatch(pushMessage({ message: "Category edited", severity: "success" }));
			return data;
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));
		return rejectWithValue(error);
	}
);

export const deleteCategory = createAsyncThunk<void, Pick<CategoryData, "id">>(
	"categories/deleteCategory",
	async (payload, { rejectWithValue, getState, dispatch }) => {
		const {
			auth: { token }
		} = getState();
		const { error } = await fetchHandler({
			path: `${APIPaths.Categories}/:id`,
			method: "DELETE",
			params: payload,
			token
		});
		if (_.isNil(error)) {
			dispatch(pushMessage({ message: "Category deleted", severity: "success" }));
			return;
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));
		return rejectWithValue(error);
	}
);
