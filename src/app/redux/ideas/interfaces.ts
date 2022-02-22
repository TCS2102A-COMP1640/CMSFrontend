import { Status } from "@app/utils";
import { CategoryData, YearData } from "@app/redux";

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

export interface IdeaData {
	id: number;
	content: string;
	user: {
		id: number;
		department?: {
			name: string;
		};
	};
	categories: number[] | CategoryData[];
	reactions: {
		id: number;
		type: number;
	}[];
	comments: {
		id: number;
		content: string;
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
