import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface UsersState {
	getUserById: {
		data: object;
		status: string;
	};
}

const getUserById = createAsyncThunk("users/getUserById", async (payload: { id: string }, thunk) => {});

const usersState: UsersState = {
	getUserById: {
		data: {},
		status: "idle"
	}
};
const usersSlice = createSlice({
	name: "users",
	initialState: usersState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getUserById.rejected, (state, action) => {});
		builder.addCase(getUserById.fulfilled, (state, action) => {});
		builder.addCase(getUserById.pending, (state, action) => {});
	}
});
const usersReducer = usersSlice.reducer;

export { UsersState, usersReducer, getUserById };
