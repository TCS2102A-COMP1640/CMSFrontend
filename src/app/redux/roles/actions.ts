import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler, PaginationPayload } from "@app/utils";
import { pushMessage } from "@app/redux";
import { RoleData } from "./interfaces";
import _ from "lodash";

export const resetRolesState = createAction("roles/reset");

export const getRoles = createAsyncThunk<RoleData[], PaginationPayload>(
	"roles/getRoles",
	async (payload, { rejectWithValue, getState, dispatch }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: RoleData[]; error?: Error }>(
			await fetchHandler({ path: APIPaths.Roles, method: "GET", query: payload, token })
		);
		if (_.isNil(error)) {
			return data;
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));
		return rejectWithValue(error);
	}
);

export const getRolesByName = createAsyncThunk<RoleData[], Pick<RoleData, "name">>(
	"roles/getRolesByName",
	async (payload, { rejectWithValue, getState }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: RoleData[]; error?: Error }>(
			await fetchHandler({ path: `${APIPaths.Roles}/:name`, method: "GET", params: payload, token })
		);
		if (_.isNil(error)) {
			return data;
		}
		return rejectWithValue(error);
	}
);

export const createRole = createAsyncThunk<RoleData, Omit<RoleData, "id">>(
	"roles/createRole",
	async (payload, { rejectWithValue, getState, dispatch }) => {
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
			dispatch(pushMessage({ message: "Role created", severity: "success" }));
			return data;
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));
		return rejectWithValue(error);
	}
);

export const editRole = createAsyncThunk<RoleData, Partial<RoleData>>(
	"roles/editRole",
	async (payload, { rejectWithValue, getState, dispatch }) => {
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
			dispatch(pushMessage({ message: "Role edited", severity: "success" }));
			return data;
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));
		return rejectWithValue(error);
	}
);

export const deleteRole = createAsyncThunk<void, Pick<RoleData, "id">>(
	"roles/deleteRole",
	async (payload, { rejectWithValue, getState, dispatch }) => {
		const { auth } = getState();
		const { error } = await fetchHandler({
			path: `${APIPaths.Roles}/:id`,
			method: "DELETE",
			params: payload,
			token: auth.token
		});
		if (_.isNil(error)) {
			dispatch(pushMessage({ message: "Role deleted", severity: "success" }));
			return;
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));
		return rejectWithValue(error);
	}
);
