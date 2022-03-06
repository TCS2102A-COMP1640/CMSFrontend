import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler, PaginationPayload } from "@app/utils";
import { DepartmentData } from "./interfaces";
import _ from "lodash";

export const resetDepartmentsState = createAction("departments/reset");

export const getDepartments = createAsyncThunk<DepartmentData[], PaginationPayload>(
	"departments/getDepartments",
	async (payload, { rejectWithValue, getState }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: DepartmentData[]; error?: Error }>(
			await fetchHandler({ path: APIPaths.Departments, method: "GET", query: payload, token })
		);
		if (_.isNil(error)) {
			return data;
		}
		return rejectWithValue(error);
	}
);

export const getDepartmentsByName = createAsyncThunk<DepartmentData[], Pick<DepartmentData, "name">>(
	"departments/getDepartmentsByName",
	async (payload, { rejectWithValue, getState }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: DepartmentData[]; error?: Error }>(
			await fetchHandler({ path: `${APIPaths.Departments}/:name`, method: "GET", params: payload, token })
		);
		if (_.isNil(error)) {
			return data;
		}
		return rejectWithValue(error);
	}
);

export const createDepartment = createAsyncThunk<DepartmentData, Omit<DepartmentData, "id">>(
	"departments/createDepartment",
	async (payload, { rejectWithValue, getState }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: DepartmentData; error?: Error }>await fetchHandler({
			path: APIPaths.Departments,
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

export const editDepartment = createAsyncThunk<DepartmentData, Partial<DepartmentData>>(
	"departments/editDepartment",
	async (payload, { rejectWithValue, getState }) => {
		const { auth } = getState();
		const { data, error } = <{ data: DepartmentData; error?: Error }>await fetchHandler({
			path: `${APIPaths.Departments}/:id`,
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

export const deleteDepartment = createAsyncThunk<void, Pick<DepartmentData, "id">>(
	"departments/deleteDepartment",
	async (payload, { rejectWithValue, getState }) => {
		const { auth } = getState();
		const { error } = await fetchHandler({
			path: `${APIPaths.Departments}/:id`,
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
