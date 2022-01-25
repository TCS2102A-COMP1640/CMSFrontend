export type UsersState = {
	getUserById: {
		data: object;
		status: string;
	};
};

export const initialState: UsersState = {
	getUserById: {
		data: {},
		status: "idle"
	}
};
