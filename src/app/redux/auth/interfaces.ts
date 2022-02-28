import { Status } from "@app/utils";
import { UserData } from "@app/redux";

export interface AuthState {
	token: string;
	status: Status;
	profile?: UserData;
	error?: Error;
}

export interface LoginPayload {
	email: string;
	password: string;
}
