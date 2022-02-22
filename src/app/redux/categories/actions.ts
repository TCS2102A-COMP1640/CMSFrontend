import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler } from "@app/utils";
import { CategoryData,  CategoiryResponseData} from "./interfaces";
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

export const createCategories = createAsyncThunk<CategoryData, Omit<CategoryData, "id">>(
	"categories/createCategories",
	async (payload, { rejectWithValue, getState }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: CategoiryResponseData; error?: Error }>await fetchHandler({
			path: APIPaths.Categories,
			method: "POST",
			body: payload,
			token
		});
		if (_.isNil(error)) {
			return {
				...data,
				//CategoryData: parseISO(data.CategoryData),
			};
		}
		return rejectWithValue(error);
	}
);

export const editCategories = createAsyncThunk<CategoryData, Partial<CategoryData>>(
	"categories/editCategories",
	async (payload, { rejectWithValue, getState }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: CategoiryResponseData; error?: Error }>await fetchHandler({
			path: `${APIPaths.Categories}/:id`,
			method: "PUT",
			body: payload,
			params: {
				id: payload.id
			},
			token
		});
		if (_.isNil(error)) {
			return {
				...data,
				//CategoryData: parseISO(data.CategoryData),
			};
		}
		return rejectWithValue(error);
	}
);

export const deleteCategorise = createAsyncThunk<void, Pick<CategoryData, "id">>(
	"categories/deleteCategories",
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