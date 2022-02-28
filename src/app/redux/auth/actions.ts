import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler } from "@app/utils";
import { LoginPayload } from "./interfaces";
import { UserData, pushMessage } from "@app/redux";
import _ from "lodash";

export const resetAuthState = createAction("auth/reset");

export const loginToAccount = createAsyncThunk<string, LoginPayload>(
	"auth/login",
	async (payload, { rejectWithValue, dispatch }) => {
		const { data, error } = await fetchHandler({ path: APIPaths.Auth, method: "POST", body: payload });
		if (_.isNil(error)) {
			dispatch(pushMessage({ message: "Logged in", severity: "success" }));
			return data.token as string;
		}
		dispatch(pushMessage({ message: "Wrong email or password provided", severity: "error" }));
		return rejectWithValue(error);
	}
);
export const logoutFromAccount = createAction("auth/logout");

export const getProfile = createAsyncThunk<UserData, void>(
	"auth/profile",
	async (ignored, { rejectWithValue, getState, dispatch }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: UserData; error?: Error }>(
			await fetchHandler({ path: APIPaths.Auth, method: "GET", token })
		);
		if (_.isNil(error)) {
			return data;
		}
		dispatch(pushMessage({ message: "Unable to get your account profile", severity: "error" }));
		return rejectWithValue(error);
	}
);
