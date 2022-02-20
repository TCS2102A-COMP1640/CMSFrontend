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
