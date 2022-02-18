import { Status } from "@app/utils";

export interface YearData {
	id: number;
	name: string;
	openingDate: Date;
	closureDate: Date;
	finalClosureDate: Date;
}

export interface YearResponseData extends Pick<YearData, "id" | "name"> {
	openingDate: string;
	closureDate: string;
	finalClosureDate: string;
}

export interface YearsState {
	getYears: {
		data: YearData[];
		status: Status;
		error?: Error;
	};
	createYear: {
		status: Status;
		error?: Error;
	};
	deleteYear: {
		status: Status;
		error?: Error;
	};
}
