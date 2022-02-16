import { createSlice } from "@reduxjs/toolkit";
import { IdeasState } from "./interfaces";
import { getIdeas } from "./actions";
import _ from "lodash";

const ideasState: IdeasState = {
	getIdeas: {
		data: [],
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
				state.getIdeas.error = undefined;
			})
			.addCase(getIdeas.rejected, (state, action) => {
				state.getIdeas.status = "idle";
			})
			.addCase(getIdeas.fulfilled, (state, action) => {
				state.getIdeas.status = "idle";
				state.getIdeas.data = action.payload;
			});
	}
});

const ideasReducer = ideasSlice.reducer;

export { ideasReducer };
