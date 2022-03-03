import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler } from "@app/utils";
import { UserData } from "./interfaces";
import _ from "lodash";
import { pushMessage } from "..";

export const resetUsersState = createAction("users/reset");

export const getUsers = createAsyncThunk<UserData[]>(
	"users/getUsers",
	async (payload, { rejectWithValue, getState, dispatch }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: UserData[]; error?: Error }>(
			await fetchHandler({ path: APIPaths.Users, method: "GET", token })
		);
		if (_.isNil(error)) {
			return data;
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));
		return rejectWithValue(error);
	}
);

export const createUser = createAsyncThunk<UserData, Omit<UserData, "id">>(
	"users/createUser",
	async (payload, { rejectWithValue, getState, dispatch }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: UserData; error?: Error }>await fetchHandler({
			path: APIPaths.Users,
			method: "POST",
			body: payload,
			token
		});
		if (_.isNil(error)) {
			dispatch(pushMessage({ message: "User created", severity: "success" }));
			return data;
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));
		return rejectWithValue(error);
	}
);

export const editUser = createAsyncThunk<UserData, Partial<UserData>>(
	"users/editUser",
	async (payload, { rejectWithValue, getState, dispatch }) => {
		const { auth } = getState();
		const { data, error } = <{ data: UserData; error?: Error }>await fetchHandler({
			path: `${APIPaths.Users}/:id`,
			method: "PUT",
			body: { ...payload, department: payload.department ?? null },
			params: {
				id: payload.id
			},
			token: auth.token
		});
		if (_.isNil(error)) {
			dispatch(pushMessage({ message: "User edited", severity: "success" }));
			return data;
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));
		return rejectWithValue(error);
	}
);

export const deleteUser = createAsyncThunk<void, Pick<UserData, "id">>(
	"users/deleteUser",
	async (payload, { rejectWithValue, getState, dispatch }) => {
		const { auth } = getState();
		const { error } = await fetchHandler({
			path: `${APIPaths.Users}/:id`,
			method: "DELETE",
			params: payload,
			token: auth.token
		});
		if (_.isNil(error)) {
			dispatch(pushMessage({ message: "User deleted", severity: "success" }));
			return;
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));
		return rejectWithValue(error);
	}
);
