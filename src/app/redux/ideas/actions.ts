import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler } from "@app/utils";
import { IdeaResponseData, IdeaData, GetIdeasPayload } from "./interfaces";
import _ from "lodash";

export const getIdeas = createAsyncThunk<IdeaResponseData, GetIdeasPayload>(
	"ideas/getIdeas",
	async (payload, { rejectWithValue, getState }) => {
		const { auth } = getState();
		const { data, error } = await fetchHandler({
			path: APIPaths.Ideas,
			method: "GET",
			query: payload,
			token: auth.token
		});
		if (_.isNil(error)) {
			return data as IdeaResponseData;
		}
		return rejectWithValue(error);
	}
);

export const createIdea = createAsyncThunk<IdeaData, Partial<IdeaData>>(
	"ideas/createIdea",
	async (payload, { rejectWithValue, getState }) => {
		const { auth } = getState();
		const { data, error } = await fetchHandler({
			path: APIPaths.Ideas,
			method: "POST",
			body: payload,
			token: auth.token
		});
		if (_.isNil(error)) {
			return data as IdeaData;
		}
		return rejectWithValue(error);
	}
);
