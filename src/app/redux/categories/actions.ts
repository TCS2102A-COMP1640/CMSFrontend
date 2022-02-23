import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler } from "@app/utils";
import { CategoryData } from "./interfaces";
import _ from "lodash";

export const getCategories = createAsyncThunk<CategoryData[]>(
	"categories/getCategories",
	async (payload, { rejectWithValue, getState }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = await fetchHandler({ path: APIPaths.Categories, method: "GET", token });
		if (_.isNil(error)) {
			return data as CategoryData[];
		}
		return rejectWithValue(error);
	}
);

export const createCategory = createAsyncThunk<CategoryData, Omit<CategoryData, "id">>(
	"categories/createCategory",
	async (payload, { rejectWithValue, getState }) => {
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
			return data;
		}
		return rejectWithValue(error);
	}
);

export const editCategory = createAsyncThunk<CategoryData, Partial<CategoryData>>(
	"categories/editCategory",
	async (payload, { rejectWithValue, getState }) => {
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
			return data;
		}
		return rejectWithValue(error);
	}
);

export const deleteCategory = createAsyncThunk<void, Pick<CategoryData, "id">>(
	"categories/deleteCategory",
	async (payload, { rejectWithValue, getState }) => {
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
			return;
		}
		return rejectWithValue(error);
	}
);
