import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler } from "@app/utils";
import { RoleData } from "./interfaces";
import _ from "lodash";

export const getRoles = createAsyncThunk<RoleData[]>(
	"roles/getRoles",
	async (payload, { rejectWithValue, getState }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: RoleData[]; error?: Error }>(
			await fetchHandler({ path: APIPaths.Roles, method: "GET", token })
		);
		if (_.isNil(error)) {
			return data;
		}
		return rejectWithValue(error);
	}
);

export const createRole = createAsyncThunk<RoleData, Omit<RoleData, "id">>(
	"roles/createRole",
	async (payload, { rejectWithValue, getState }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: RoleData; error?: Error }>await fetchHandler({
			path: APIPaths.Roles,
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

export const editRole = createAsyncThunk<RoleData, Partial<RoleData>>(
	"roles/editRole",
	async (payload, { rejectWithValue, getState }) => {
		const { auth } = getState();
		const { data, error } = <{ data: RoleData; error?: Error }>await fetchHandler({
			path: `${APIPaths.Roles}/:id`,
			method: "PUT",
			body: payload,
			params: {
				id: payload.id
			},
			token: auth.token
		});
		if (_.isNil(error)) {
			return data;
		}
		return rejectWithValue(error);
	}
);

export const deleteRole = createAsyncThunk<void, Pick<RoleData, "id">>(
	"roles/deleteRole",
	async (payload, { rejectWithValue, getState }) => {
		const { auth } = getState();
		const { error } = await fetchHandler({
			path: `${APIPaths.Roles}/:id`,
			method: "DELETE",
			params: payload,
			token: auth.token
		});
		if (_.isNil(error)) {
			return;
		}
		return rejectWithValue(error);
	}
);
