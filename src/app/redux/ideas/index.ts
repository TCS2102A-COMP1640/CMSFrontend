import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { APIPaths, fetchHandler } from "@app/utils";
import _ from "lodash";

interface IdeasState {
	getIdeas: {
		data: Object[];
		status: "idle" | "pending";
		error?: Error;
	};
}

const initialState: IdeasState = {
	getIdeas: {
		data: [],
		status: "idle"
	}
};

const getIdeas = createAsyncThunk("ideas/getIdeas", async (payload: { page: number }, { rejectWithValue }) => {
	const { data, error } = await fetchHandler({ path: APIPaths.Login, method: "GET", query: payload });
	if (_.isNil(error)) {
		return data.token as object[];
	}
	return rejectWithValue(error);
});

const ideasSlice = createSlice({
	name: "ideas",
	initialState: initialState,
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

export { IdeasState, ideasReducer, getIdeas };
