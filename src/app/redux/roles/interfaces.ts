import { Status } from "@app/utils";

export interface RoleData {
	id: number;
	name: string;
}

export interface RolesState {
	getRoles: {
		data: RoleData[];
		status: Status;
		error?: Error;
	};
	createRole: {
		status: Status;
		error?: Error;
	};
	editRole: {
		status: Status;
		error?: Error;
	};
	deleteRole: {
		status: Status;
		error?: Error;
	};
}
