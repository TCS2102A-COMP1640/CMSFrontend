import { Status } from "@app/utils";
import { CategoryData, YearData, DepartmentData } from "@app/redux";

export interface GetIdeasPayload {
	page: number;
	pageLimit: number;
	academicYear: number;
	order?: "views" | "reactions" | "latest";
}

export interface IdeaUserData {
	id: number;
	firstName?: string;
	lastName?: string;
	department?: DepartmentData;
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
	user: IdeaUserData;
	isAnonymous: boolean;
}

export interface IdeaReactionData {
	type: number;
}

export interface IdeaViewData {
	createTimestamp: string | Date;
	updateTimestamp: string | Date;
}

export interface IdeaData {
	id: number;
	content: string;
	user: IdeaUserData;
	categories: number[] | CategoryData[];
	viewCount: number;
	reactionScore: number;
	thumbUpCount: number;
	thumbDownCount: number;
	documents: File[] | IdeaDocumentData[];
	academicYear?: number | YearData;
	createTimestamp: string | Date;
	isAnonymous: boolean;
}

export interface IdeaResponseData {
	pages: number;
	data: IdeaData[];
}

export interface IdeasStatisticsData {
	[index: string]: {
		total: number;
		percentage: number;
		contributors: number;
		anonymousIdeas: number;
		anonymousComments: number;
		ideasWithoutComment: number;
	};
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
