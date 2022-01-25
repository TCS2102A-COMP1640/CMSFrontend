import { createSlice } from "@reduxjs/toolkit";
import { createCases } from "./actions";
import { initialState } from "./state";

const usersSlice = createSlice({
	name: "users",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		createCases(builder);
	}
});

export const UsersReducer = usersSlice.reducer;
