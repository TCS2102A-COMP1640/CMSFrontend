import { Status } from "@app/utils";

export interface CategoryData {
	id: number;
	name: string;
}

export interface CategoriesState {
	getCategories: {
		data: CategoryData[];
		status: Status;
		error?: Error;
	};
}
