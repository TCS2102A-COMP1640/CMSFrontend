import { createStore, applyMiddleware, combineReducers } from "redux";
import { UsersReducer } from "./users/reducers";
import thunk from "redux-thunk";

const RootReducer = combineReducers({
	users: UsersReducer
});

const store = createStore(RootReducer, {}, applyMiddleware(thunk));

export default store;
