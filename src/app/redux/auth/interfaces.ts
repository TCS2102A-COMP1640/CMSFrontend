import { Status } from "@app/utils";

export interface AuthProfile {
	email: string;
	firstName: string;
	lastName: string;
	role: {
		name: string;
	};
	department?: {
		name: string;
	};
}

export interface AuthState {
	token: string;
	status: Status;
	profile?: AuthProfile;
	error?: Error;
}

export interface LoginPayload {
	email: string;
	password: string;
}
