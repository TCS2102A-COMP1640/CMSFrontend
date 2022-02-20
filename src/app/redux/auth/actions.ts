import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler } from "@app/utils";
import { LoginPayload, AuthProfile } from "./interfaces";
import _ from "lodash";

export const resetAuthState = createAction("auth/reset");

export const loginToAccount = createAsyncThunk<string, LoginPayload>(
	"auth/login",
	async (payload, { rejectWithValue }) => {
		const { data, error } = await fetchHandler({ path: APIPaths.Auth, method: "POST", body: payload });
		if (_.isNil(error)) {
			return data.token as string;
		}
		return rejectWithValue(error);
	}
);
export const logoutFromAccount = createAction("auth/logout");

export const getProfile = createAsyncThunk<AuthProfile, void>(
	"auth/profile",
	async (ignored, { rejectWithValue, getState }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = await fetchHandler({ path: APIPaths.Auth, method: "GET", token });
		if (_.isNil(error)) {
			return data as AuthProfile;
		}
		return rejectWithValue(error);
	}
);
