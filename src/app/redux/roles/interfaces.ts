import { Status } from "@app/utils";
import { PermissionData } from "@app/redux";

export interface RoleData {
	id: number;
	name: string;
	permissions: number[] | PermissionData[];
}

export interface RolesState {
	getRoles: {
		data: RoleData[];
		status: Status;
		error?: Error;
	};
	getRolesByName: {
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
