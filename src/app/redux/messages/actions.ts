import { createAction, nanoid } from "@reduxjs/toolkit";
import { MessageData } from "./interfaces";

export const pushMessage = createAction("messages/push", (payload: Pick<MessageData, "message" | "severity">) => {
	return {
		payload: {
			...payload,
			id: nanoid()
		}
	};
});

export const popMessage = createAction<Pick<MessageData, "id">>("messages/pop");
