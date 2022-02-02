import { createAsyncThunk, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { UsersState } from "./state";

const getUserById = createAsyncThunk("users/getUserById", async (payload, thunk) => {});

function createCases(builder: ActionReducerMapBuilder<UsersState>) {
	builder.addCase(getUserById.rejected, (state, action) => {});
	builder.addCase(getUserById.fulfilled, (state, action) => {});
	builder.addCase(getUserById.pending, (state, action) => {});
}

export { getUserById, createCases };
