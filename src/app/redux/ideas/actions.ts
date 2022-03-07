import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler } from "@app/utils";
import { pushMessage, YearData, CategoryData } from "@app/redux";
import {
	IdeaResponseData,
	IdeaCommentData,
	IdeaReactionData,
	IdeaViewData,
	IdeaData,
	GetIdeasPayload
} from "./interfaces";
import { parseISO } from "date-fns";
import _ from "lodash";

export const resetIdeasState = createAction("ideas/reset");

export const getIdeas = createAsyncThunk<IdeaResponseData, GetIdeasPayload>(
	"ideas/getIdeas",
	async (payload, { rejectWithValue, getState }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: IdeaResponseData; error?: Error }>await fetchHandler({
			path: APIPaths.Ideas,
			method: "GET",
			query: payload,
			token
		});
		if (_.isNil(error)) {
			data.data = data.data.map((idea: IdeaData) => {
				return {
					...idea,
					createTimestamp: parseISO(idea.createTimestamp as string)
				};
			});
			return data;
		}
		return rejectWithValue(error);
	}
);

export const getIdeaComments = createAsyncThunk<IdeaCommentData[], { id: number }>(
	"ideas/getIdeaComments",
	async (payload, { rejectWithValue, getState, dispatch }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: IdeaCommentData[]; error?: Error }>await fetchHandler({
			path: `${APIPaths.Ideas}/:id/comments`,
			method: "GET",
			params: payload,
			token
		});
		if (_.isNil(error)) {
			return data.map((comment: IdeaCommentData) => {
				return {
					...comment,
					createTimestamp: parseISO(comment.createTimestamp as string)
				};
			});
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));
		return rejectWithValue(error);
	}
);

export const getIdeaReaction = createAsyncThunk<IdeaReactionData, { id: number }>(
	"ideas/getIdeaReaction",
	async (payload, { rejectWithValue, getState, dispatch }) => {
		const {
			auth: { token }
		} = getState();
		const { data, error } = <{ data: IdeaReactionData; error?: Error }>await fetchHandler({
			path: `${APIPaths.Ideas}/:id/reactions`,
			method: "GET",
			params: payload,
			token
		});
		if (_.isNil(error)) {
			return data;
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));
		return rejectWithValue(error);
	}
);

export const createIdea = createAsyncThunk<IdeaData, Partial<IdeaData>>(
	"ideas/createIdea",
	async (payload, { rejectWithValue, getState, dispatch }) => {
		const {
			auth: { token }
		} = getState();
		const body = new FormData();
		body.append("content", payload.content as string);
		body.append("academicYear", _.toString((payload.academicYear as YearData).id));

		if (!_.isUndefined(payload.categories)) {
			body.append("categories", JSON.stringify((payload.categories as CategoryData[]).map((cat) => cat.id)));
		}
		if (!_.isUndefined(payload.documents)) {
			(payload.documents as File[]).forEach((file) => {
				body.append("documents", file);
			});
		}

		const { data, error } = <{ data: IdeaData; error?: Error }>await fetchHandler({
			path: APIPaths.Ideas,
			method: "POST",
			multipart: true,
			body,
			token
		});
		if (_.isNil(error)) {
			dispatch(pushMessage({ message: "New idea posted!", severity: "success" }));
			return data;
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));
		return rejectWithValue(error);
	}
);

export const createIdeaComment = createAsyncThunk<
	IdeaCommentData,
	Pick<IdeaCommentData, "id" | "content"> & { academicYear: number }
>("ideas/createIdeaComment", async (payload, { rejectWithValue, getState, dispatch }) => {
	const {
		auth: { token }
	} = getState();

	const { data, error } = <{ data: IdeaCommentData; error?: Error }>await fetchHandler({
		path: `${APIPaths.Ideas}/:id/comments`,
		method: "POST",
		body: _.omit(payload, "id"),
		params: {
			id: payload.id
		},
		token
	});

	if (_.isNil(error)) {
		dispatch(pushMessage({ message: "New comment posted!", severity: "success" }));
		return data;
	}
	dispatch(pushMessage({ message: error.message, severity: "error" }));

	return rejectWithValue(error);
});

export const createIdeaReaction = createAsyncThunk<IdeaReactionData, IdeaReactionData & { id: number }>(
	"ideas/createIdeaReaction",
	async (payload, { rejectWithValue, getState, dispatch }) => {
		const {
			auth: { token }
		} = getState();

		const { data, error } = <{ data: IdeaReactionData; error?: Error }>await fetchHandler({
			path: `${APIPaths.Ideas}/:id/reactions`,
			method: "POST",
			body: _.omit(payload, "id"),
			params: {
				id: payload.id
			},
			token
		});

		if (_.isNil(error)) {
			return data;
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));

		return rejectWithValue(error);
	}
);

export const createIdeaView = createAsyncThunk<IdeaViewData, { id: number }>(
	"ideas/createIdeaView",
	async (payload, { rejectWithValue, getState, dispatch }) => {
		const {
			auth: { token }
		} = getState();

		const { data, error } = <{ data: IdeaViewData; error?: Error }>await fetchHandler({
			path: `${APIPaths.Ideas}/:id/views`,
			method: "POST",
			params: payload,
			token
		});

		if (_.isNil(error)) {
			return data;
		}
		dispatch(pushMessage({ message: error.message, severity: "error" }));

		return rejectWithValue(error);
	}
);
