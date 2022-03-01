import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler } from "@app/utils";
import { pushMessage } from "@app/redux";
import { PermissionData } from "./interfaces";
import _ from "lodash";

export const getPermissions = createAsyncThunk<PermissionData[]>(
	"permissions/getPermissions",
	async (payload, { rejectWithValue, getState, dispatch }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: PermissionData[]; error?: Error }>(
			await fetchHandler({ path: APIPaths.Permissions, method: "GET", token })
		);
		if (_.isNil(error)) {
			return data;
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));
		return rejectWithValue(error);
	}
);
