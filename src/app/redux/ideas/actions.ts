import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler } from "@app/utils";
import { IdeaResponseData, IdeaCommentData, IdeaData, GetIdeasPayload } from "./interfaces";
import { parseISO } from "date-fns";
import _ from "lodash";

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
	async (payload, { rejectWithValue, getState }) => {
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
		return rejectWithValue(error);
	}
);

export const createIdea = createAsyncThunk<IdeaData, Partial<IdeaData>>(
	"ideas/createIdea",
	async (payload, { rejectWithValue, getState }) => {
		const {
			auth: { token }
		} = getState();
		const body = new FormData();
		body.append("content", payload.content as string);
		body.append("academicYear", _.toString(payload.academicYear));

		if (!_.isUndefined(payload.categories)) {
			body.append("categories", JSON.stringify(payload.categories));
		}
		if (!_.isUndefined(payload.documents)) {
			Array.from(payload.documents as FileList).forEach((file) => {
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
			return data;
		}
		return rejectWithValue(error);
	}
);

export const createIdeaComment = createAsyncThunk<
	IdeaCommentData,
	Pick<IdeaCommentData, "id" | "content"> & { academicYear: number }
>("ideas/createIdeaComment", async (payload, { rejectWithValue, getState }) => {
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
		return data;
	}

	return rejectWithValue(error);
});
