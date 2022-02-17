import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler } from "@app/utils";
import { CommentData, GetCommentsPayload } from "./interfaces";
import _ from "lodash";

export const getComments = createAsyncThunk<CommentData[], GetCommentsPayload>(
	"comments/getComments",
	async (payload, { rejectWithValue, requestId }) => {
		// const { data, error } = await fetchHandler({ path: APIPaths.Login, method: "GET", query: payload });
		// if (_.isNil(error)) {
		// 	return data.token as object[];
		// }
		// return rejectWithValue(error);

		// fake data for testing
		const commentData: CommentData = {
			user: {
				department: {
					name: "IT Department"
				}
			},
			content:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."
		};
		const data = [commentData, commentData, commentData];
		await new Promise((r) => setTimeout(r, 500));
		return data;
	}
);
