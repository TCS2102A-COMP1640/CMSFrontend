import { Status } from "@app/utils";
import { CategoryData, YearData, DepartmentData } from "@app/redux";

export interface GetIdeasPayload {
	page: number;
	pageLimit: number;
	academicYear: number;
}

export interface IdeaDocumentData {
	id: number;
	name: string;
	path: string;
}

export interface IdeaCommentData {
	id: number;
	content: string;
	createTimestamp: string | Date;
	user: {
		id: number;
		department?: DepartmentData;
	};
}

export interface IdeaData {
	id: number;
	content: string;
	user: {
		id: number;
		department?: DepartmentData;
	};
	categories: number[] | CategoryData[];
	reactions: {
		id: number;
		type: number;
	}[];
	views: {
		id: number;
	}[];
	documents: FileList | IdeaDocumentData[];
	academicYear?: number | YearData;
	createTimestamp: string | Date;
}

export interface IdeaResponseData {
	pages: number;
	data: IdeaData[];
}

export interface IdeasState {
	getIdeas: {
		pages: number;
		data: IdeaData[];
		status: Status;
		error?: Error;
	};
	createIdea: {
		status: Status;
		error?: Error;
	};
}
