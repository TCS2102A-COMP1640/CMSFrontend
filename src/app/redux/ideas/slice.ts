import { createSlice } from "@reduxjs/toolkit";
import { IdeasState } from "./interfaces";
import { getIdeas, createIdea } from "./actions";
import _ from "lodash";

const ideasState: IdeasState = {
	getIdeas: {
		pages: 0,
		data: [],
		status: "idle"
	},
	createIdea: {
		status: "idle"
	}
};

const ideasSlice = createSlice({
	name: "ideas",
	initialState: ideasState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getIdeas.pending, (state, action) => {
				state.getIdeas.status = "pending";
				state.getIdeas.data = [];
				state.getIdeas.pages = 0;
				state.getIdeas.error = undefined;
			})
			.addCase(getIdeas.rejected, (state, action) => {
				state.getIdeas.status = "idle";
			})
			.addCase(getIdeas.fulfilled, (state, action) => {
				state.getIdeas.status = "idle";
				state.getIdeas.data = action.payload.data;
				state.getIdeas.pages = action.payload.pages;
			})
			.addCase(createIdea.pending, (state, action) => {
				state.createIdea.status = "pending";
				state.createIdea.error = undefined;
			})
			.addCase(createIdea.rejected, (state, action) => {
				state.createIdea.status = "idle";
			})
			.addCase(createIdea.fulfilled, (state, action) => {
				state.createIdea.status = "idle";
			});
	}
});

const ideasReducer = ideasSlice.reducer;

export { ideasReducer };
