export interface GetCommentsPayload {
	ideaId: number;
}

export interface CommentData {
	user: {
		department: {
			name: string;
		};
	};
	content: string;
}
