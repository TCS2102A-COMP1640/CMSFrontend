export interface MessageData {
	id: string;
	message: string;
	severity: "success" | "error";
}

export interface MessagesState {
	stack: MessageData[];
}
