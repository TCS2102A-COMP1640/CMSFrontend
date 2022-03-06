import { Status } from "@app/utils";

export interface DepartmentData {
	id: number;
	name: string;
}

export interface DepartmentsState {
	getDepartments: {
		data: DepartmentData[];
		status: Status;
		error?: Error;
	};
	getDepartmentsByName: {
		data: DepartmentData[];
		status: Status;
		error?: Error;
	};
	createDepartment: {
		status: Status;
		error?: Error;
	};
	editDepartment: {
		status: Status;
		error?: Error;
	};
	deleteDepartment: {
		status: Status;
		error?: Error;
	};
}
