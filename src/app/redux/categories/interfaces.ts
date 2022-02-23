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
	createCategory: {
		status: Status;
		error?: Error;
	};
	editCategory: {
		status: Status;
		error?: Error;
	};
	deleteCategory: {
		status: Status;
		error?: Error;
	};
}
