import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler } from "@app/utils";
import { pushMessage } from "@app/redux";
import { YearData, YearResponseData } from "./interfaces";
import { parseISO } from "date-fns";
import _ from "lodash";

export const getYears = createAsyncThunk<YearData[]>(
	"years/getYears",
	async (payload, { rejectWithValue, getState, dispatch }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: YearResponseData[]; error?: Error }>(
			await fetchHandler({ path: APIPaths.Years, method: "GET", token })
		);
		if (_.isNil(error)) {
			return data.map((year) => {
				return {
					...year,
					openingDate: parseISO(year.openingDate),
					closureDate: parseISO(year.closureDate),
					finalClosureDate: parseISO(year.finalClosureDate)
				};
			});
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));
		return rejectWithValue(error);
	}
);

export const createYear = createAsyncThunk<YearData, Omit<YearData, "id">>(
	"years/createYear",
	async (payload, { rejectWithValue, getState, dispatch }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: YearResponseData; error?: Error }>await fetchHandler({
			path: APIPaths.Years,
			method: "POST",
			body: payload,
			token
		});
		if (_.isNil(error)) {
			dispatch(pushMessage({ message: "Academic year created", severity: "success" }));
			return {
				...data,
				openingDate: parseISO(data.openingDate),
				closureDate: parseISO(data.closureDate),
				finalClosureDate: parseISO(data.finalClosureDate)
			};
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));
		return rejectWithValue(error);
	}
);

export const editYear = createAsyncThunk<YearData, Partial<YearData>>(
	"years/editYear",
	async (payload, { rejectWithValue, getState, dispatch }) => {
		const { auth } = getState();
		const { data, error } = <{ data: YearResponseData; error?: Error }>await fetchHandler({
			path: `${APIPaths.Years}/:id`,
			method: "PUT",
			body: payload,
			params: {
				id: payload.id
			},
			token: auth.token
		});
		if (_.isNil(error)) {
			dispatch(pushMessage({ message: "Academic year edited", severity: "success" }));
			return {
				...data,
				openingDate: parseISO(data.openingDate),
				closureDate: parseISO(data.closureDate),
				finalClosureDate: parseISO(data.finalClosureDate)
			};
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));
		return rejectWithValue(error);
	}
);

export const deleteYear = createAsyncThunk<void, Pick<YearData, "id">>(
	"years/deleteYear",
	async (payload, { rejectWithValue, getState, dispatch }) => {
		const { auth } = getState();
		const { error } = await fetchHandler({
			path: `${APIPaths.Years}/:id`,
			method: "DELETE",
			params: payload,
			token: auth.token
		});
		if (_.isNil(error)) {
			dispatch(pushMessage({ message: "Academic year deleted", severity: "success" }));
			return;
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));
		return rejectWithValue(error);
	}
);
