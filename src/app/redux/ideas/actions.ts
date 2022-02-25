import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler } from "@app/utils";
import { IdeaResponseData, IdeaData, GetIdeasPayload } from "./interfaces";
import { parseISO } from "date-fns";
import _ from "lodash";
import { IdeaCommentData } from ".";

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
					comments: idea.comments.map((comment) => {
						return {
							...comment,
							createTimestamp: parseISO(comment.createTimestamp as string)
						};
					}),
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

		const { data, error } = await fetchHandler({
			path: APIPaths.Ideas,
			method: "POST",
			multipart: true,
			body,
			token
		});
		if (_.isNil(error)) {
			return data as IdeaData;
		}
		return rejectWithValue(error);
	}
);

export const createIdeaComment = createAsyncThunk<
	IdeaCommentData,
	Pick<IdeaCommentData, "content"> & { ideaId: number }
>("ideas/createIdeaComment", async (payload, { rejectWithValue, getState }) => {
	const {
		auth: { token }
	} = getState();

	const { data, error } = await fetchHandler({
		path: `${APIPaths.Ideas}/:id/comments`,
		method: "POST",
		body: _.omit(payload, "ideaId"),
		params: {
			id: payload.ideaId
		},
		token
	});

	if (_.isNil(error)) {
		return data as IdeaCommentData;
	}

	return rejectWithValue(error);
});
