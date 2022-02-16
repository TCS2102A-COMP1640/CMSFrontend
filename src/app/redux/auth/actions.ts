import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler } from "@app/utils";
import { LoginPayload } from "./interfaces";
import _ from "lodash";

export const loginToAccount = createAsyncThunk<string, LoginPayload, { rejectValue: Error }>(
	"auth/login",
	async (payload, { rejectWithValue }) => {
		const { data, error } = await fetchHandler({ path: APIPaths.Login, method: "POST", body: payload });
		if (_.isNil(error)) {
			return data.token as string;
		}
		return rejectWithValue(error);
	}
);
export const logoutFromAccount = createAction("auth/logout");
