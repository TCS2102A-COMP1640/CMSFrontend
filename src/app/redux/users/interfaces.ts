import { Status } from "@app/utils";

export interface UserData {
	id: number;
	email: string;
	password?: string;
	firstName: string;
	lastName: string;
	role: {
		id: number;
		name: string;
	};
	department?: {
		id: number;
		name: string;
	};
}

export interface UsersState {
	getUsers: {
		data: UserData[];
		status: Status;
		error?: Error;
	};
	createUser: {
		status: Status;
		error?: Error;
	};
	editUser: {
		status: Status;
		error?: Error;
	};
	deleteUser: {
		status: Status;
		error?: Error;
	};
}
