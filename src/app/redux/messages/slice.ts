import { createSlice } from "@reduxjs/toolkit";
import { MessagesState } from "./interfaces";
import { pushMessage, popMessage } from "./actions";
import _ from "lodash";

const messagesState: MessagesState = {
	stack: []
};

const messagesSlice = createSlice({
	name: "messages",
	initialState: messagesState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(pushMessage, (state, action) => {
				state.stack.push(action.payload);
			})
			.addCase(popMessage, (state, action) => {
				state.stack = [...state.stack.filter((m) => m.id !== action.payload.id)];
			});
	}
});

const messagesReducer = messagesSlice.reducer;

export { messagesReducer };
