import { Status } from "@app/utils";

export interface GetIdeasPayload {
	page: number;
	pageLimit: number;
	academicYear: number;
}

export interface IdeaData {
	id: number;
	content: string;
	user: {
		id: number;
		department: {
			name: string;
		};
	};
	academicYear?:
		| number
		| {
				id: number;
		  };
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
