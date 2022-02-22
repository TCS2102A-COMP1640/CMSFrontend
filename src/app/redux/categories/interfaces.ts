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
	createCategories: {
		status: Status;
		error?: Error;
	};
	deleteCategories: {
		status: Status;
		error?: Error;
	};
	
}

export interface CategoiryResponseData extends Pick<CategoryData, "id" | "name"> {
	categoriesStatus: string;
}

