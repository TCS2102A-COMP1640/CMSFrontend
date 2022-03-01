export interface MessageData {
	id: string;
	message: string;
	severity: "success" | "error" | "info";
}

export interface MessagesState {
	stack: MessageData[];
}
