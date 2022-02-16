import { Status } from "@app/utils";

export interface GetIdeasPayload {
	page: number;
	limit: number;
}

export interface IdeaData {
	user: {
		department: {
			name: string;
		};
	};
	content: string;
}

export interface IdeasState {
	getIdeas: {
		data: IdeaData[];
		status: Status;
		error?: Error;
	};
}
