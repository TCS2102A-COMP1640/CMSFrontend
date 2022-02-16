import { Status } from "@app/utils";

export interface AuthState {
	token: string;
	status: Status;
	error?: Error;
}

export interface LoginPayload {
	email: string;
	password: string;
}
