import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler } from "@app/utils";
import { IdeaData, GetIdeasPayload } from "./interfaces";
import _ from "lodash";

export const getIdeas = createAsyncThunk<IdeaData[], GetIdeasPayload, { rejectValue: Error }>(
	"ideas/getIdeas",
	async (payload, { rejectWithValue }) => {
		// const { data, error } = await fetchHandler({ path: APIPaths.Login, method: "GET", query: payload });
		// if (_.isNil(error)) {
		// 	return data.token as object[];
		// }
		// return rejectWithValue(error);

		// fake data for testing
		const ideaData: IdeaData = {
			user: {
				department: {
					name: "IT Department"
				}
			},
			// comments: [
			// 	{
			// 		content:
			// 			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."
			// 	},
			// 	{
			// 		content:
			// 			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."
			// 	}
			// ],
			content:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."
		};
		const data = [
			ideaData,
			ideaData,
			ideaData,
			ideaData,
			ideaData,
			ideaData,
			ideaData,
			ideaData,
			ideaData,
			ideaData,
			ideaData
		];
		const start = Math.min(Math.max((payload.page - 1) * payload.limit, 0), data.length - 1);
		const end = Math.min(Math.max(payload.page * payload.limit, 0), data.length);
		await new Promise((r) => setTimeout(r, 500));
		return data.slice(start, end);
	}
);
