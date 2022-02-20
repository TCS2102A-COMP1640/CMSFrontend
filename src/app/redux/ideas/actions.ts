import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler } from "@app/utils";
import { IdeaResponseData, IdeaData, GetIdeasPayload } from "./interfaces";
import { parseISO } from "date-fns";
import _ from "lodash";

export const getIdeas = createAsyncThunk<IdeaResponseData, GetIdeasPayload>(
	"ideas/getIdeas",
	async (payload, { rejectWithValue, getState }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = await fetchHandler({
			path: APIPaths.Ideas,
			method: "GET",
			query: payload,
			token
		});
		if (_.isNil(error)) {
			(data as IdeaResponseData).data = data.data.map((idea: IdeaData) => {
				return {
					...idea,
					createTimestamp: parseISO(idea.createTimestamp as string)
				};
			});
			return data as IdeaResponseData;
		}
		return rejectWithValue(error);
	}
);

export const createIdea = createAsyncThunk<IdeaData, Partial<IdeaData>>(
	"ideas/createIdea",
	async (payload, { rejectWithValue, getState }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = await fetchHandler({
			path: APIPaths.Ideas,
			method: "POST",
			body: payload,
			token
		});
		if (_.isNil(error)) {
			return data as IdeaData;
		}
		return rejectWithValue(error);
	}
);
