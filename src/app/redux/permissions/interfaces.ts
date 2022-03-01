import { Status } from "@app/utils";

export interface PermissionData {
	id: number;
	name: string;
}

export interface PermissionsState {
	getPermissions: {
		data: PermissionData[];
		status: Status;
		error?: Error;
	};
}
